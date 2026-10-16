"""Tests for Agent Regulasi (KBLI 2020 classification + verification).

The rule under test is the same one the ledger guardrail enforces: the model may
propose, but code decides. A code that is not in the shipped catalogue must be
rejected — never echoed back as if it were real.
"""

from __future__ import annotations

import pytest

from nata_agent import regulasi


# ── Catalogue ───────────────────────────────────────────────────────────────


def test_catalogue_is_populated():
    """The shipped KBLI 2020 catalogue must actually contain the 5-digit codes."""
    assert regulasi.catalog_size() == 1790


def test_known_codes_are_valid():
    for code in ("56101", "56102", "56303", "47111", "69202", "96200"):
        assert regulasi.is_valid_code(code), f"{code} should be in the catalogue"


def test_fabricated_codes_are_rejected():
    for code in ("99999", "00000", "12345"):
        assert not regulasi.is_valid_code(code)


def test_entry_returns_title_verbatim_from_catalogue():
    e = regulasi.entry("56102")
    assert e.code == "56102"
    assert e.title == "Rumah/Warung Makan"


def test_entry_of_unknown_code_raises():
    with pytest.raises(regulasi.KbliError, match="tidak ditemukan"):
        regulasi.entry("99999")


# ── Verification of a proposed code (the guardrail) ─────────────────────────


def test_verify_accepts_a_real_code_and_quotes_it():
    r = regulasi.classify_kbli(code="56102")
    assert r["status"] == "success"
    assert r["code"] == "56102"
    assert r["title"] == "Rumah/Warung Makan"
    assert r["title_verbatim"] is True
    assert r["file"].endswith("kbli-2020-5digit.json")


def test_verify_rejects_a_fabricated_code():
    r = regulasi.classify_kbli(code="99999")
    assert r["status"] == "error"
    assert "99999" in r["error_message"]
    assert "tidak ada di katalog" in r["error_message"]


def test_verify_rejects_malformed_codes():
    for bad in ("123", "123456", "abcde", "", "56-102"):
        r = regulasi.classify_kbli(code=bad)
        assert r["status"] == "error", f"{bad!r} should be rejected"


def test_verify_offers_nearby_candidates_when_rejecting():
    """A rejection should help the model correct itself, not just say no."""
    r = regulasi.classify_kbli(code="99999", description="rumah makan")
    assert r["status"] == "error"
    assert "Kandidat" in r["error_message"]


# ── Risk level is never invented ────────────────────────────────────────────


def test_risk_level_is_not_fabricated():
    """KBLI carries no risk tier; the tool must say so rather than guess."""
    r = regulasi.classify_kbli(code="56102")
    assert r["risk_level"] is None
    assert "OSS-RBA" in r["risk_note"]


# ── Search ──────────────────────────────────────────────────────────────────


@pytest.mark.parametrize(
    "query,expected_prefix",
    [
        ("warung kopi yang juga menjual snack", "56"),
        ("rumah makan padang", "56"),
        ("jasa catering makan siang", "56"),
        ("toko sembako kelontong", "47"),
        ("konsultan pajak", "69"),
        ("bengkel servis motor", "45"),
        ("laundry kiloan", "96"),
    ],
)
def test_search_ranks_the_expected_sector_first(query, expected_prefix):
    hits = regulasi.search(query, limit=3)
    assert hits, f"no results for {query!r}"
    assert hits[0].code.startswith(expected_prefix), (
        f"{query!r} -> {hits[0].code} {hits[0].title!r}, "
        f"expected a {expected_prefix}xxx code"
    )


def test_search_returns_only_catalogue_codes():
    for e in regulasi.search("warung kopi", limit=5):
        assert regulasi.is_valid_code(e.code)


def test_search_of_empty_or_noise_query_returns_nothing():
    assert regulasi.search("") == []
    assert regulasi.search("   ") == []


def test_classify_without_input_is_an_error():
    r = regulasi.classify_kbli()
    assert r["status"] == "error"


def test_classify_search_mode_returns_candidates():
    r = regulasi.classify_kbli(description="jual sembako kelontong")
    assert r["status"] == "success"
    assert r["catalog_size"] == 1790
    assert len(r["candidates"]) > 0
    for c in r["candidates"]:
        assert {"code", "title", "desc"} <= set(c)
        assert regulasi.is_valid_code(c["code"])


def test_verify_includes_the_hierarchy():
    """A code is not a bare number: it sits at a known place in the taxonomy."""
    r = regulasi.classify_kbli(code="56102")
    assert r["status"] == "success"
    levels = [h["level"] for h in r["hierarchy"]]
    assert levels == ["Divisi", "Golongan", "Subgolongan", "Kelompok"]
    assert r["hierarchy"][0]["code"] == "56"
    assert r["hierarchy"][-1]["code"] == "56102"
    # Every ancestor title is non-empty and quoted from the catalogue.
    assert all(h["title"] for h in r["hierarchy"])


def test_classify_search_mode_with_no_match_is_an_error():
    r = regulasi.classify_kbli(description="zzzz qqqq xxxx")
    assert r["status"] == "error"
