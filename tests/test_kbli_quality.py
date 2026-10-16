"""Classification quality — the KBLI search against realistic UMKM descriptions.

These are not unit tests of a helper; they are a quality floor. The search is a
plain text heuristic (no model), so its behaviour is measurable and regressions
are easy to introduce — a single stopword once pulled a phone-repair query to a
fishing-services code, and a qualifier ("digital") pulled advertising into
computer services.

Each case asserts the **division** (first two digits) rather than the exact code,
because several codes are legitimately correct for one description: a
"percetakan dan fotokopi" shop is both 18111 (printing) and 82190
(photocopying), and "ekspedisi" is 52291-52299 (freight forwarding) as much as
53201 (courier). Pinning exact codes there would encode an arbitrary choice.

Set `NATA_KBLI_MIN_SCORE` to require a higher pass rate in CI.
"""

from __future__ import annotations

import os

import pytest

from nata_agent import regulasi

#: (description a shop owner might type, expected KBLI division)
CASES: list[tuple[str, str]] = [
    # Makan-minum / jasa boga
    ("warung makan nasi padang", "56"),
    ("kedai kopi kekinian", "56"),
    ("restoran ayam geprek", "56"),
    ("catering makan siang kantor", "56"),
    ("warung kopi susu", "56"),
    # Perdagangan eceran
    ("toko kelontong sembako", "47"),
    ("minimarket kecil", "47"),
    ("toko baju dan aksesoris", "47"),
    ("apotek jual obat", "47"),
    ("toko online jual pakaian", "47"),
    ("toko bangunan material", "47"),
    ("jasa titip beli / reseller", "47"),
    # Reparasi / jasa
    ("bengkel motor", "45"),
    ("servis ac dan kulkas", "95"),
    ("jasa perbaikan ponsel", "95"),
    ("laundry kiloan", "96"),
    ("salon rambut dan kecantikan", "96"),
    ("barbershop", "96"),
    # Profesional
    ("jasa konsultan pajak", "69"),
    ("jasa pembukuan akuntansi", "69"),
    ("jasa desain grafis", "74"),
    ("jasa iklan digital", "73"),
    ("kursus bahasa inggris", "85"),
    # Produksi
    ("peternakan ayam kampung", "01"),
    ("budidaya lele", "03"),
    # Tambahan: deskripsi yang lebih realistis, ditemukan lewat pengukuran.
    ("warung nasi uduk buka pagi", "56"),
    ("jual martabak manis malam hari", "56"),
    ("rumah makan seafood", "56"),
    ("katering rumahan untuk hajatan", "56"),
    ("toko buah dan sayur segar", "47"),
    ("toko emas dan perhiasan", "47"),
    ("toko sepatu dan sandal", "47"),
    ("jual pulsa dan token listrik", "47"),
    ("toko kue dan roti", "47"),
    ("reparasi komputer dan laptop", "95"),
    ("reparasi alat elektronik", "95"),
    ("pangkas rambut pria", "96"),
    ("laundry antar jemput", "96"),
    ("jasa jahit baju pesanan", "14"),
    ("percetakan spanduk dan banner", "18"),
    ("jasa akuntansi dan pembukuan", "69"),
    ("kursus mengemudi", "85"),
    ("jasa pengiriman paket", "53"),
    ("jasa bersih-bersih rumah", "81"),
    ("penginapan homestay", "55"),
    ("budidaya ikan lele kolam", "03"),
    ("kebun kopi", "01"),
    ("toko online shop pakaian", "47"),
]

#: Kasus yang jawabannya boleh lebih dari satu divisi. Dipisahkan supaya
#: ambang mutu tetap ketat untuk kasus yang jawabannya tunggal.
CASES_AMBIGUOUS: list[tuple[str, set[str]]] = [
    # Renovasi rumah bisa masuk konstruksi gedung (41) atau konstruksi khusus
    # (43) — keduanya benar menurut KBLI.
    ("jasa renovasi rumah", {"41", "43"}),
]

#: Kasus yang diketahui masih **melenceng**, dicatat terbuka alih-alih
#: disembunyikan di dalam ambang mutu.
#:
#: "bengkel las besi" saat ini mengarah ke 24103 (Industri Pipa Dan Sambungan
#: Pipa Dari Baja) — masih satu bidang logam, tapi bukan jasa pengelasan.
#: Belum diperbaiki karena perbaikan yang benar butuh sinonim yang lebih
#: spesifik ("pengelasan"), dan itu belum diverifikasi terhadap katalog.
KNOWN_GAPS: list[tuple[str, str]] = [("bengkel las besi", "24")]


def _division_of(description: str) -> str | None:
    hits = regulasi.search(description, limit=1)
    return hits[0].code[:2] if hits else None


@pytest.mark.parametrize("description,expected_div", CASES, ids=[c[0] for c in CASES])
def test_search_finds_the_right_sector(description, expected_div):
    got = _division_of(description)
    hits = regulasi.search(description, limit=1)
    detail = f"{hits[0].code} {hits[0].title!r}" if hits else "no results"
    assert got == expected_div, f"{description!r} -> {got} ({detail}), expected {expected_div}xxx"


def test_overall_quality_floor():
    """Guard the aggregate, so a small regression in scoring is caught early."""
    passed = sum(1 for d, want in CASES if _division_of(d) == want)
    total = len(CASES)
    floor = float(os.environ.get("NATA_KBLI_MIN_SCORE", "0.90"))
    assert passed / total >= floor, (
        f"KBLI classification scored {passed}/{total} "
        f"({passed / total:.0%}), below the {floor:.0%} floor"
    )


@pytest.mark.parametrize(
    "description,acceptable", CASES_AMBIGUOUS, ids=[c[0] for c in CASES_AMBIGUOUS]
)
def test_ambiguous_descriptions_land_in_an_acceptable_division(description, acceptable):
    got = _division_of(description)
    assert got in acceptable, (
        f"{description!r} -> {got}, expected one of {sorted(acceptable)}"
    )


@pytest.mark.parametrize(
    "description,known_wrong_division",
    KNOWN_GAPS,
    ids=[c[0] for c in KNOWN_GAPS],
)
def test_known_gaps_are_recorded_not_hidden(description, known_wrong_division):
    """Pin the current (wrong) answer so a fix is visible as a test change.

    Recording the shortfall honestly beats folding it into the aggregate
    threshold, where it would read as a pass. When the synonym work lands, this
    test should start failing — which is the point: it says "fixed".
    """
    assert _division_of(description) == known_wrong_division, (
        f"{description!r} no longer lands in {known_wrong_division} — "
        "if that is an improvement, move it out of KNOWN_GAPS"
    )


def test_every_result_is_a_real_code():
    """Whatever the ranking does, it must only ever propose catalogue codes."""
    for description, _ in CASES:
        for e in regulasi.search(description, limit=3):
            assert regulasi.is_valid_code(e.code), f"{e.code} is not in the catalogue"


def test_results_are_stable():
    """Same query, same answer — the ranking has no hidden state."""
    for description, _ in CASES:
        first = [e.code for e in regulasi.search(description, limit=3)]
        second = [e.code for e in regulasi.search(description, limit=3)]
        assert first == second


def test_generic_words_do_not_dominate():
    """"jasa" appears in hundreds of titles; it must not decide the ranking.

    Before it was stopped, "jasa perbaikan ponsel" ranked a fishing-services
    code (03131) first because both titles happened to contain "Jasa".
    """
    hits = regulasi.search("jasa perbaikan ponsel", limit=1)
    assert hits, "expected at least one result"
    assert hits[0].code.startswith("95"), (
        f"phone repair ranked {hits[0].code} {hits[0].title!r} first"
    )
