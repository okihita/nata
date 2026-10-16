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
]


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
