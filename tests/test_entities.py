"""Tests for the entity-type model (bentuk badan usaha).

Grounding: PP 55/2022 in-repo.
- Pasal 57 ayat (1) huruf b lists the corporate forms eligible for the 0.5% rate.
- Pasal 60 ayat (2) grants the Rp 500 million exemption to *orang pribadi* only.
"""

from __future__ import annotations

import pytest

from nata_agent import entities
from nata_agent.tax import assess_pph_final


def test_three_entity_types_exist():
    assert set(entities.ENTITY_TYPES) == {"orang_pribadi", "pt_perorangan", "pt_cv"}


def test_only_individual_gets_the_exemption():
    """Pasal 60 ayat (2): the Rp 500 million band is for orang pribadi only."""
    assert entities.exemption_applies("orang_pribadi") is True
    assert entities.exemption_applies("pt_perorangan") is False
    assert entities.exemption_applies("pt_cv") is False


def test_profile_of_unknown_type_raises():
    with pytest.raises(ValueError, match="bentuk usaha tidak dikenal"):
        entities.profile_of("koperasi_luar_angkasa")


def test_every_profile_cites_the_statute():
    """Each profile must name at least one Pasal — no uncited tax claims."""
    for profile in entities.PROFILES.values():
        assert profile.citations, f"{profile.id} has no citations"
        assert all(key.startswith("pasal_") for key in profile.citations)


def test_option_list_is_ui_ready():
    opts = entities.entity_options()
    assert len(opts) == 3
    for o in opts:
        assert set(o) == {"id", "label", "short", "description", "exemption"}
        assert o["label"] and o["short"] and o["description"]


# ── Entity-aware tax assessment ─────────────────────────────────────────────


def test_same_turnover_taxed_differently_by_entity():
    """Rp 600 million over a year: the entity form changes the liability."""
    turnover = 600_000_000

    individual = assess_pph_final(turnover, entity="orang_pribadi")
    pt_perorangan = assess_pph_final(turnover, entity="pt_perorangan")
    pt_cv = assess_pph_final(turnover, entity="pt_cv")

    # Individual: 600jt - 500jt band = 100jt base -> 0.5% = 500,000
    assert individual.exemption_applied == 500_000_000
    assert individual.taxable_base == 100_000_000
    assert individual.payable == 500_000

    # Entities: no band, full base -> 0.5% = 3,000,000
    assert pt_perorangan.exemption_applied == 0
    assert pt_perorangan.payable == 3_000_000
    assert pt_cv.payable == 3_000_000


def test_pt_perorangan_is_treated_as_a_body_not_an_individual():
    """The old two-value flag could not express this: PT Perorangan is a badan."""
    a = assess_pph_final(500_000_000, entity="pt_perorangan")
    assert a.payable == 2_500_000
    assert a.exemption_remaining == 0

    b = assess_pph_final(500_000_000, entity="orang_pribadi")
    # Entirely inside the band -> zero tax.
    assert b.payable == 0
    assert b.exemption_remaining == 0


def test_entity_citations_omit_the_individual_only_articles():
    individual = assess_pph_final(600_000_000, entity="orang_pribadi")
    entity = assess_pph_final(600_000_000, entity="pt_perorangan")

    ind_keys = {c["article"] for c in individual.citations}
    ent_keys = {c["article"] for c in entity.citations}

    # The exemption articles (Pasal 60) apply only to individuals.
    assert "Pasal 60 ayat (2)" in ind_keys
    assert "Pasal 60 ayat (2)" not in ent_keys
    # Both cite the rate and the eligibility ceiling.
    for keys in (ind_keys, ent_keys):
        assert "Pasal 56 ayat (2)" in keys


def test_unknown_entity_raises_from_assessment():
    with pytest.raises(ValueError, match="bentuk usaha tidak dikenal"):
        assess_pph_final(100_000_000, entity="nope")


def test_legacy_taxpayer_flag_still_works():
    """Existing callers using taxpayer= keep their behaviour."""
    a = assess_pph_final(600_000_000, taxpayer="orang_pribadi")
    b = assess_pph_final(600_000_000, taxpayer="badan")
    assert a.payable == 500_000
    assert b.payable == 3_000_000


# ── Statutory boundaries ────────────────────────────────────────────────────
#
# The band edge and the ceiling are the two figures in PP 55/2022 that decide
# real money, so the exact boundary behaviour is pinned rather than assumed:
# Pasal 60 ayat (2) for the Rp 500 million band, Pasal 57 ayat (1) huruf b for
# the Rp 4.8 billion ceiling.


@pytest.mark.parametrize("turnover", [0, 1, 499_999_999, 500_000_000, 500_000_001])
def test_turnover_within_the_band_owes_nothing_for_an_individual(turnover):
    a = assess_pph_final(turnover, entity="orang_pribadi")
    # At 500_000_001 the exemption is capped at 500_000_000 and the remaining
    # rupiah rounds to zero tax — so "owes nothing" holds, but the exemption is
    # the band, not the turnover.
    assert a.payable == 0, f"{turnover} should produce no tax"
    assert a.exemption_applied == min(turnover, 500_000_000)
    assert a.over_ceiling is False


def test_the_band_is_capped_at_500_million_not_the_turnover():
    a = assess_pph_final(600_000_000, entity="orang_pribadi")
    assert a.exemption_applied == 500_000_000
    assert a.taxable_base == 100_000_000


def test_the_ceiling_is_inclusive():
    """Pasal 57 ayat (1) huruf b reads "tidak melebihi Rp4.800.000.000" — so
    exactly at the ceiling is still within the scheme."""
    at_ceiling = assess_pph_final(4_800_000_000, entity="orang_pribadi")
    over = assess_pph_final(4_800_000_001, entity="orang_pribadi")
    assert at_ceiling.over_ceiling is False
    assert over.over_ceiling is True


def test_pasal_61_is_cited_only_above_the_ceiling():
    """Pasal 61 ayat (1) explains the rate continuing to year end once turnover
    has passed the ceiling, so it must not be cited below it."""
    def articles(turnover):
        return {c["article"] for c in assess_pph_final(turnover, entity="orang_pribadi").citations}

    assert "Pasal 61 ayat (1)" not in articles(4_800_000_000)
    assert "Pasal 61 ayat (1)" in articles(4_800_000_001)


def test_never_negative_even_for_a_nonsensical_turnover():
    a = assess_pph_final(-1_000, entity="orang_pribadi")
    assert a.payable == 0
    assert a.taxable_base == 0
    assert a.exemption_applied == 0


def test_entity_turnover_never_gets_the_band():
    for turnover in (100_000_000, 500_000_000, 4_800_000_000):
        a = assess_pph_final(turnover, entity="pt_cv")
        assert a.exemption_applied == 0, f"pt_cv at {turnover} must get no band"
        assert a.taxable_base == turnover


def test_entity_overrides_the_coarse_flag():
    """When both are given, the precise entity form wins."""
    a = assess_pph_final(600_000_000, taxpayer="orang_pribadi", entity="pt_perorangan")
    assert a.payable == 3_000_000  # entity wins: no band


# ── The ADK tool must expose the entity too ─────────────────────────────────
#
# The engine understood entity types before the tool did, which meant Agent
# Fiskal could only pass the coarse `taxpayer` flag — so a PT Perorangan
# received the individual's Rp 500 million band. The tool is what the model
# actually calls, so the capability has to be there.


def test_tool_accepts_the_entity_argument():
    from nata_agent.tax import compute_pph_final

    individual = compute_pph_final(entity="orang_pribadi", turnover=600_000_000)
    pt_perorangan = compute_pph_final(entity="pt_perorangan", turnover=600_000_000)

    assert individual["status"] == "success"
    assert individual["payable"] == 500_000
    assert individual["entity_profile"] == "Orang pribadi"

    assert pt_perorangan["status"] == "success"
    assert pt_perorangan["payable"] == 3_000_000
    assert pt_perorangan["entity_profile"] == "PT Perorangan"


def test_tool_rejects_an_unknown_entity_rather_than_guessing():
    """An unrecognised form must not silently fall back to the payer flag."""
    from nata_agent.tax import compute_pph_final

    r = compute_pph_final(entity="badan_tidak_ada", turnover=600_000_000)
    assert r["status"] == "error"
    assert "tidak dikenal" in r["error_message"]


def test_tool_without_entity_keeps_legacy_behaviour():
    from nata_agent.tax import compute_pph_final

    r = compute_pph_final(turnover=600_000_000)
    assert r["status"] == "success"
    assert r["payable"] == 500_000  # defaults to orang pribadi
