"""Bentuk badan usaha (entity type) dan perlakuan pajaknya.

Bentuk usaha menentukan apakah pembebasan Rp 500 juta berlaku. Dasar hukumnya
sudah ada di repo ini (PP 55/2022), jadi tidak perlu menunggu peraturan lain:

- **Pasal 57 ayat (1) huruf b** menyebut bentuk badan yang boleh memakai tarif
  0,5%: koperasi, persekutuan komanditer, firma, **perseroan terbatas**, atau
  badan usaha milik desa. "PT Perorangan" adalah perseroan terbatas, jadi ia
  termasuk golongan ini.
- **Pasal 60 ayat (2)** memberi pembebasan Rp 500 juta hanya kepada **orang
  pribadi**. Badan usaha tidak mendapatkannya.
- **Pasal 60 ayat (5) huruf b** menyebut dasar pengenaan pajak bagi orang
  pribadi setelah memperhitungkan pembebasan tersebut.

Karena itu:

| Bentuk | Tarif 0,5% | Pembebasan Rp 500 juta |
| --- | --- | --- |
| Orang pribadi | ya | **ya** |
| PT Perorangan | ya | tidak |
| PT / CV / koperasi / firma | ya | tidak |

Catatan penting soal kejelasan: ada sumber riset (di luar repo) yang menyebut
PP 20/2026 mengubah aturan ini — mis. tarif tetap permanen, dan PT/CV
dikeluarkan dari skema 0,5%. Klaim itu **belum diverifikasi** dan tidak dipakai
di sini. Selama belum ada teks resmi yang masuk ke `statutes/`, modul ini
mengikuti PP 55/2022 yang sudah ada dan terverifikasi. Lihat
`docs/regulasi-provenance.md`.
"""

from __future__ import annotations

from dataclasses import dataclass

# ── Bentuk usaha ────────────────────────────────────────────────────────────

ENTITY_ORANG_PRIBADI = "orang_pribadi"
ENTITY_PT_PERORANGAN = "pt_perorangan"
ENTITY_PT_CV = "pt_cv"

ENTITY_TYPES = (ENTITY_ORANG_PRIBADI, ENTITY_PT_PERORANGAN, ENTITY_PT_CV)


@dataclass(frozen=True)
class EntityProfile:
    """Satu bentuk badan usaha dan konsekuensi pajaknya."""

    id: str
    label: str
    short: str
    description: str
    """Apakah pembebasan Rp 500 juta (Pasal 60 ayat (2)) berlaku."""
    exemption: bool
    """Pasal yang menjadi dasar perlakuan ini."""
    citations: tuple[str, ...]


PROFILES: dict[str, EntityProfile] = {
    ENTITY_ORANG_PRIBADI: EntityProfile(
        id=ENTITY_ORANG_PRIBADI,
        label="Orang pribadi",
        short="Perorangan",
        description=(
            "Usaha milik pribadi, tanpa badan hukum. Omzet sampai Rp 500 juta "
            "dalam satu tahun tidak dikenai PPh Final."
        ),
        exemption=True,
        citations=("pasal_56_ayat_2", "pasal_60_ayat_2", "pasal_60_ayat_3"),
    ),
    ENTITY_PT_PERORANGAN: EntityProfile(
        id=ENTITY_PT_PERORANGAN,
        label="PT Perorangan",
        short="PT Perorangan",
        description=(
            "Perseroan terbatas milik satu orang. Diperlakukan sebagai badan "
            "usaha, jadi tidak ada pembebasan Rp 500 juta."
        ),
        exemption=False,
        citations=("pasal_56_ayat_2", "pasal_57_ayat_1_huruf_b"),
    ),
    ENTITY_PT_CV: EntityProfile(
        id=ENTITY_PT_CV,
        label="PT / CV / koperasi / firma",
        short="PT / CV",
        description=(
            "Badan usaha bermitra atau berbadan hukum. Tarif 0,5% berlaku, "
            "tanpa pembebasan Rp 500 juta."
        ),
        exemption=False,
        citations=("pasal_56_ayat_2", "pasal_57_ayat_1_huruf_b"),
    ),
}


def is_known_entity(entity_id: str) -> bool:
    return entity_id in PROFILES


def profile_of(entity_id: str) -> EntityProfile:
    """Profil untuk satu bentuk usaha; melempar untuk id yang tidak dikenal."""
    try:
        return PROFILES[entity_id]
    except KeyError as exc:  # pragma: no cover - defensif
        raise ValueError(
            f"bentuk usaha tidak dikenal: {entity_id!r} "
            f"(pilihan: {', '.join(ENTITY_TYPES)})"
        ) from exc


def exemption_applies(entity_id: str) -> bool:
    """True bila pembebasan Rp 500 juta berlaku untuk bentuk usaha ini."""
    return profile_of(entity_id).exemption


def entity_options() -> list[dict[str, object]]:
    """Pilihan bentuk usaha untuk UI, lengkap dengan konsekuensi pajaknya."""
    return [
        {
            "id": p.id,
            "label": p.label,
            "short": p.short,
            "description": p.description,
            "exemption": p.exemption,
        }
        for p in PROFILES.values()
    ]
