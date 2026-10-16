"""Agent Regulasi — klasifikasi KBLI 2020, dengan pengaman yang sama seperti pajak.

Prinsipnya sama dengan modul pajak: **model mengusulkan, kode yang memutuskan.**
Model tidak boleh mengarang kode KBLI. Setiap kode yang dilaporkan harus ada di
dalam katalog resmi yang ikut disimpan di repo, dan judulnya dikutip apa adanya
dari katalog itu.

Sumber data
-----------
``statutes/kbli/kbli-2020-5digit.json`` — 1.790 kode KBLI 2020 tingkat 5 digit
(level yang dipakai OSS-RBA untuk perizinan berusaha). Setiap entri berisi
``code``, ``title``, ``desc`` persis seperti pada katalog aslinya. Provenance
lengkap ada di ``docs/regulasi-provenance.md``.

Yang **tidak** ada di sini
--------------------------
Katalog KBLI tidak memuat tingkat risiko (Rendah/Menengah/Tinggi) maupun daftar
persyaratan perizinan per kode — keduanya berasal dari OSS-RBA/PP 5/2021, yang
teksnya belum ada di repo ini. Modul ini karena itu **tidak** mengarang tingkat
risiko atau langkah perizinan; ia mengembalikan kode + judul yang terverifikasi,
dan menandai bahwa tingkat risiko perlu dicek di OSS-RBA. Menandai sesuatu yang
belum diketahui lebih baik daripada menebak — terutama untuk hal berbadan hukum.
"""

from __future__ import annotations

import json
import re
import unicodedata
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

KBLI_FILE = Path(__file__).resolve().parent / "statutes" / "kbli" / "kbli-2020-5digit.json"

#: Jumlah kandidat yang dikembalikan saat mencari.
DEFAULT_CANDIDATES = 5


@dataclass(frozen=True)
class KbliEntry:
    """Satu kode KBLI beserta judul resminya (dikutip apa adanya)."""

    code: str
    title: str
    desc: str

    def as_dict(self) -> dict[str, str]:
        return {"code": self.code, "title": self.title, "desc": self.desc}


class KbliError(ValueError):
    """Kode KBLI tidak ada di katalog."""


# ── Katalog ─────────────────────────────────────────────────────────────────


@lru_cache(maxsize=1)
def _catalog() -> tuple[KbliEntry, ...]:
    raw = json.loads(KBLI_FILE.read_text(encoding="utf-8"))
    return tuple(
        KbliEntry(code=e["code"], title=e["title"], desc=e.get("desc", "")) for e in raw
    )


@lru_cache(maxsize=1)
def _by_code() -> dict[str, KbliEntry]:
    return {e.code: e for e in _catalog()}


def catalog_size() -> int:
    """Berapa kode KBLI 2020 tingkat 5 digit yang tersedia."""
    return len(_catalog())


def is_valid_code(code: str) -> bool:
    """True bila ``code`` benar-benar ada di katalog KBLI 2020."""
    return str(code).strip() in _by_code()


def entry(code: str) -> KbliEntry:
    """Satu entri katalog berdasarkan kode; melempar :class:`KbliError` bila tidak ada."""
    key = str(code).strip()
    try:
        return _by_code()[key]
    except KeyError as exc:
        raise KbliError(
            f"kode KBLI {key!r} tidak ditemukan di katalog KBLI 2020 "
            f"({catalog_size()} kode tersedia)."
        ) from exc


# ── Pencarian (deterministik) ───────────────────────────────────────────────


def _fold(text: str) -> str:
    """Normalisasi: huruf kecil, buang aksen, rapikan tanda baca."""
    text = unicodedata.normalize("NFKD", text or "")
    text = "".join(c for c in text if not unicodedata.combining(c))
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    return " ".join(text.split())


# Kata umum yang tidak membantu membedakan kode.
#
# Catatan: "warung", "toko", "kedai", "kafe" dan sejenisnya SENGAJA tidak ada
# di sini. Kata-kata itu justru paling menentukan bidang usahanya — "warung"
# mengarah ke jasa boga (56), "toko" ke perdagangan eceran (47). Membuangnya
# membuat "warung kopi" salah jatuh ke industri pengolahan kopi.
_STOPWORDS = {
    "dan", "atau", "yang", "untuk", "dengan", "di", "ke", "dari", "pada",
    "ini", "itu", "saya", "usaha", "bisnis", "jual", "jualan", "menjual",
    "buka", "punya", "ada", "juga", "sebuah", "selain", "serta",
    "the", "and", "for", "with", "business",
}


# Kata sehari-hari pemilik usaha → istilah yang muncul di katalog KBLI.
# Ini yang membuat "warung kopi" mengarah ke rumah makan (56xxx), bukan ke
# industri pengolahan kopi (10xxx). Tanpa peta ini, pencocokan teks biasa
# menangkap "kopi" di mana-mana dan salah menebak bidang usahanya.
_SYNONYMS: dict[str, tuple[str, ...]] = {
    # Makan-minum / jasa boga
    "warung": ("rumah makan", "restoran", "makan", "minum"),
    "kedai": ("rumah makan", "kafe", "minum"),
    "kafe": ("rumah minum", "kafe", "minum"),
    "cafe": ("rumah minum", "kafe", "minum"),
    "restoran": ("restoran",),
    "resto": ("restoran",),
    "kopi": ("rumah minum", "kafe", "minum", "makan"),
    "nasi": ("rumah makan", "makan"),
    "bakso": ("rumah makan", "makan"),
    "mie": ("rumah makan", "makan"),
    "catering": ("jasa boga", "makan"),
    "frozen": ("makanan",),
    "snack": ("makanan", "camilan"),
    "kue": ("roti", "kue"),
    # Perdagangan eceran
    "sembako": ("eceran", "makanan", "minuman"),
    "kelontong": ("eceran", " makanan", "minuman"),
    "toko": ("perdagangan eceran",),
    "minimarket": ("perdagangan eceran",),
    "butik": ("pakaian", "eceran"),
    "baju": ("pakaian",),
    "pakaian": ("pakaian",),
    "sepatu": ("alas kaki",),
    "hp": ("telepon", "seluler"),
    "pulsa": ("telekomunikasi", "eceran"),
    "obat": ("farmasi", "apotek"),
    "apotek": ("farmasi", "apotek"),
    "bangunan": ("material", "konstruksi"),
    # Jasa
    "servis": ("reparasi",),
    "service": ("reparasi",),
    "bengkel": ("reparasi", "mobil", "sepeda motor"),
    "salon": ("kecantikan", "perawatan"),
    "barbershop": ("cukur", "rambut"),
    "cukur": ("cukur", "rambut"),
    "laundry": ("penatu",),
    "binatu": ("penatu",),
    "print": ("percetakan", "fotokopi"),
    "percetakan": ("percetakan",),
    "fotokopi": ("fotokopi",),
    "konsultan": ("konsultasi",),
    "konsultasi": ("konsultasi",),
    "kursus": ("pendidikan",),
    "les": ("pendidikan",),
    "tambal": ("reparasi",),
    "jahit": ("penjahitan", "pakaian"),
    "katering": ("jasa boga",),
    "sopir": ("angkutan",),
    "travel": ("angkutan", "perjalanan"),
    "kos": ("penginapan", "akomodasi"),
    "penginapan": ("akomodasi",),
    "hotel": ("akomodasi",),
    "peternakan": ("peternakan",),
    "ternak": ("peternakan",),
    "ikan": ("perikanan",),
    "tanaman": ("pertanian",),
    "tani": ("pertanian",),
    "kebun": ("perkebunan",),
    "digital": ("pemrograman", "komputer"),
    "aplikasi": ("pemrograman", "komputer"),
    "software": ("pemrograman", "komputer"),
    "desain": ("desain",),
    "iklan": ("periklanan",),
    "properti": ("real estat",),
    "kontraktor": ("konstruksi",),
}


def _terms(text: str) -> list[str]:
    return [t for t in _fold(text).split() if len(t) > 2 and t not in _STOPWORDS]


def _expand(terms: list[str]) -> list[str]:
    """Perluas istilah dengan padanan katalognya (lihat :data:`_SYNONYMS`)."""
    out: list[str] = list(terms)
    for t in terms:
        for syn in _SYNONYMS.get(t, ()):
            out.extend(_fold(syn).split())
    return out


# Kata sehari-hari → divisi KBLI (2 digit pertama) yang paling masuk akal.
# Ini yang membedakan "warung kopi" (jasa boga, 56) dari "jual kopi bubuk"
# (perdagangan eceran, 47) tanpa perlu model.
_DIVISION_HINTS: dict[str, tuple[str, ...]] = {
    "warung": ("56",),
    "kedai": ("56",),
    "kafe": ("56",),
    "cafe": ("56",),
    "restoran": ("56",),
    "resto": ("56",),
    "nasi": ("56",),
    "bakso": ("56",),
    "mie": ("56",),
    "catering": ("56",),
    "katering": ("56",),
    "makan": ("56",),
    "minum": ("56",),
    "laundry": ("96",),
    "binatu": ("96",),
    "penatu": ("96",),
    "salon": ("96",),
    "barbershop": ("96",),
    "cukur": ("96",),
    "bengkel": ("45",),
    "servis": ("45", "95"),
    "service": ("45", "95"),
    "sembako": ("47",),
    "kelontong": ("47",),
    "toko": ("47",),
    "apotek": ("47", "21"),
    "obat": ("47", "21"),
    "baju": ("47", "14"),
    "pakaian": ("47", "14"),
    "sepatu": ("47",),
    "konsultan": ("69", "70"),
    "konsultasi": ("69", "70"),
    "aplikasi": ("62",),
    "software": ("62",),
    "digital": ("62",),
    "kursus": ("85",),
    "les": ("85",),
    "hotel": ("55",),
    "penginapan": ("55",),
    "kos": ("55",),
    "travel": ("79",),
    "ikan": ("03", "10"),
    "ternak": ("01",),
    "peternakan": ("01",),
    "tani": ("01",),
    "tanaman": ("01",),
    "kebun": ("01",),
    "kontraktor": ("41", "43"),
    "properti": ("68",),
    "jahit": ("14", "95"),
    "percetakan": ("18",),
    "print": ("18",),
    "fotokopi": ("82",),
    "iklan": ("73",),
    "desain": ("74",),
}


def _preferred_divisions(terms: list[str]) -> set[str]:
    """Divisi KBLI (2 digit pertama) yang paling mungkin untuk istilah ini."""
    out: set[str] = set()
    for t in terms:
        for d in _DIVISION_HINTS.get(t, ()):
            out.add(d)
    return out


def search(query: str, *, limit: int = DEFAULT_CANDIDATES) -> list[KbliEntry]:
    """Cari kode KBLI yang paling cocok dengan deskripsi kegiatan usaha.

    Penilaian sederhana dan dapat dijelaskan: kecocokan pada **judul** lebih
    berbobot daripada pada deskripsi, istilah asli lebih berbobot daripada
    padanannya, dan kode yang lebih spesifik (5 digit) tetap yang dikembalikan.
    Tidak ada model yang dilibatkan di sini — pencarian ini murni teks, supaya
    hasilnya bisa diperiksa ulang.

    Padanan kata (``_SYNONYMS``) diberi bobot lebih rendah daripada kata asli,
    supaya "warung kopi" naik ke 56xxx (rumah makan/minum) tanpa menenggelamkan
    kode yang judulnya benar-benar memuat kata aslinya.
    """
    q = _terms(query)
    if not q:
        return []

    primary = set(q)
    expanded = _expand(q)
    # De-duplicate: "minum" arrives from several synonyms at once, and counting
    # it once per origin would double-credit whichever codes happen to contain it.
    unique_expanded = list(dict.fromkeys(expanded))
    preferred = _preferred_divisions(q)

    scored: list[tuple[float, KbliEntry]] = []
    for e in _catalog():
        title = _fold(e.title)
        desc = _fold(e.desc)
        words = set(title.split())
        score = 0.0
        for term in unique_expanded:
            weight = 3.0 if term in primary else 1.0
            # Whole-word matches only. Substring matching let long retail titles
            # ("...Yang Utamanya Makanan, Minuman...") collect points for words
            # they merely contain, which pushed 47xxx above 56xxx for a query
            # like "warung kopi".
            if term in words:
                score += 3.0 * weight
            elif term in title:
                score += 2.0 * weight
            elif term in desc:
                score += 1.0 * weight
        if score > 0:
            # Sector intent: when the words point at a known division (e.g. a
            # coffee shop is 56 = food service, not 47 = retail), prefer codes
            # in it. This is what separates "warung kopi" (56303) from
            # "perdagangan eceran kopi" (47243).
            if e.code[:2] in preferred:
                score += 4.0
            scored.append((score, e))

    scored.sort(key=lambda pair: (-pair[0], pair[1].code))
    return [e for _, e in scored[:limit]]


# ── Verifikasi usulan model ─────────────────────────────────────────────────


def verify(code: str, *, description: str = "") -> dict:
    """Verifikasi satu kode KBLI yang diusulkan model.

    Mengembalikan kode beserta judul resminya. Bila kode tidak ada di katalog,
    pengembaliannya berisi ``status: "error"`` — persis seperti
    ``commit_journal_entry`` yang menolak jurnal tak seimbang. Model tidak bisa
    "memaksa" kode yang tidak ada.
    """
    key = str(code).strip()
    if not re.fullmatch(r"\d{5}", key):
        return {
            "status": "error",
            "error_message": (
                f"KBLI harus 5 digit angka, menerima {code!r}. "
                "Perbaiki kodenya lalu panggil ulang."
            ),
        }
    if not is_valid_code(key):
        near = search(description or "", limit=3)
        hint = (
            " Kandidat terdekat: "
            + ", ".join(f"{e.code} ({e.title})" for e in near)
            if near
            else ""
        )
        return {
            "status": "error",
            "error_message": (
                f"Kode KBLI {key} tidak ada di katalog KBLI 2020. "
                f"Gunakan kode yang benar-benar terdaftar.{hint}"
            ),
        }

    e = entry(key)
    result: dict = {
        "status": "success",
        "code": e.code,
        "title": e.title,
        "source": "KBLI 2020 (katalog 5 digit)",
        "file": "nata_agent/statutes/kbli/kbli-2020-5digit.json",
        "title_verbatim": True,
    }
    if e.desc:
        result["description"] = e.desc

    # Tingkat risiko sengaja TIDAK ditebak: katalog KBLI tidak memuatnya.
    result["risk_level"] = None
    result["risk_note"] = (
        "Tingkat risiko (Rendah/Menengah/Tinggi) dan persyaratan izin tidak ada "
        "di dalam katalog KBLI; keduanya perlu dicek di OSS-RBA. Nata tidak "
        "menebaknya."
    )
    return result


# ── ADK tool ────────────────────────────────────────────────────────────────


def classify_kbli(description: str = "", code: str = "") -> dict:
    """Klasifikasikan kegiatan usaha ke kode KBLI 2020.

    Dua mode:

    * **Verifikasi** — bila ``code`` diberi, kode itu diperiksa terhadap katalog
      dan judul resminya dikembalikan. Ini cara utama: model mengusulkan kode,
      kode program memutuskan sah atau tidak.
    * **Pencarian** — bila hanya ``description`` diberi, pencarian teks
      mengembalikan beberapa kandidat beserta judul resminya, supaya model
      memilih dari daftar nyata, bukan mengarang.

    Args:
        description: Deskripsi kegiatan usaha dalam bahasa sehari-hari, mis.
            "warung kopi yang juga menjual snack".
        code: Kode KBLI 5 digit yang ingin diverifikasi.

    Returns:
        dict: ``{"status": "success", ...}`` berisi kode, judul resmi, dan
        daftar kandidat; atau ``{"status": "error", "error_message": ...}`` bila
        kode yang diminta tidak ada di katalog.
    """
    if code:
        return verify(code, description=description)

    if not (description or "").strip():
        return {
            "status": "error",
            "error_message": (
                "Sebutkan kegiatan usahanya, atau kirim kode KBLI 5 digit untuk "
                "diverifikasi."
            ),
        }

    candidates = search(description, limit=DEFAULT_CANDIDATES)
    if not candidates:
        return {
            "status": "error",
            "error_message": (
                "Tidak ada kode KBLI yang cocok dengan deskripsi itu. "
                "Coba jelaskan barang/jasa yang dijual dan caranya "
                "(mis. 'jual kopi dan kue, pembeli makan di tempat')."
            ),
        }

    return {
        "status": "success",
        "query": description,
        "catalog_size": catalog_size(),
        "candidates": [e.as_dict() for e in candidates],
        "source": "KBLI 2020 (katalog 5 digit)",
        "note": (
            "Kandidat diambil dari katalog resmi KBLI 2020. Pilih satu, lalu "
            "panggil ulang tool ini dengan kode itu untuk memverifikasinya."
        ),
    }
