"""Tests for Slice B — Agent Fiskal's deterministic PPh Final engine + cascade.

No network, no Gemini: the tax arithmetic and the statutory grounding are tested
directly, and the cascade wiring is asserted on the agent objects.
"""

import pytest

from nata_agent import tax
from nata_agent.agent import agent_fiskal, commit_journal_entry, root_agent
from nata_agent.tax import (
    PPH_FINAL_RATE,
    PPH_INDIVIDUAL_EXEMPTION,
    PPH_TURNOVER_CEILING,
    TAXPAYER_ENTITY,
    TAXPAYER_INDIVIDUAL,
    assess_pph_final,
    compute_pph_final,
    gross_turnover,
)


class FakeState(dict):
    pass


class FakeToolContext:
    """Minimal stand-in for google.adk ToolContext (only `.state` is used)."""

    def __init__(self, entries=None):
        self.state = FakeState()
        if entries is not None:
            self.state["ledger_entries"] = entries


# ── Arithmetic: PP 55/2022 Pasal 56–61 ──────────────────────────────────────


def test_rate_is_half_a_percent():
    assert PPH_FINAL_RATE == 0.005


def test_individual_below_exemption_pays_zero():
    result = assess_pph_final(400_000_000, taxpayer=TAXPAYER_INDIVIDUAL)
    assert result.payable == 0
    assert result.exemption_applied == 400_000_000
    assert result.taxable_base == 0
    assert result.exemption_remaining == 100_000_000


def test_individual_above_exemption_taxes_only_the_excess():
    # Rp 600.000.000 turnover - Rp 500.000.000 band = Rp 100.000.000 base.
    result = assess_pph_final(600_000_000, taxpayer=TAXPAYER_INDIVIDUAL)
    assert result.exemption_applied == PPH_INDIVIDUAL_EXEMPTION
    assert result.taxable_base == 100_000_000
    assert result.payable == 500_000  # 0,5% x 100.000.000


def test_entity_gets_no_individual_exemption():
    result = assess_pph_final(600_000_000, taxpayer=TAXPAYER_ENTITY)
    assert result.exemption_applied == 0
    assert result.taxable_base == 600_000_000
    assert result.payable == 3_000_000  # 0,5% x 600.000.000


def test_rate_percent_reads_as_indonesian_decimal():
    assert assess_pph_final(1_000_000).as_dict()["rate_percent"] == "0,5%"


def test_turnover_over_ceiling_is_flagged():
    result = assess_pph_final(5_000_000_000, taxpayer=TAXPAYER_INDIVIDUAL)
    assert result.over_ceiling is True
    assert result.taxable_base == 4_500_000_000
    assert result.payable == 22_500_000


def test_negative_turnover_is_floored():
    result = assess_pph_final(-10, taxpayer=TAXPAYER_INDIVIDUAL)
    assert result.payable == 0
    assert result.taxable_base == 0


def test_unknown_taxpayer_is_rejected():
    with pytest.raises(ValueError):
        assess_pph_final(1_000_000, taxpayer="nope")


def test_ceiling_constant_matches_the_law():
    assert PPH_TURNOVER_CEILING == 4_800_000_000


# ── Grounding: every citation is verbatim in the in-repo statute ────────────


def test_every_citation_is_verbatim_in_statute():
    text = tax.statute_text()
    assert text, "statute file must not be empty"
    for key, cite in tax.CITATIONS.items():
        assert cite.quote in text or tax.citation_is_verbatim(cite.quote), (
            f"citation {key} is not verbatim in the statute file"
        )
        assert tax._squash(cite.article) in tax._squash(text), (
            f"article {cite.article} missing from the statute file"
        )


def test_key_figures_cite_the_expected_articles():
    individual = assess_pph_final(600_000_000, taxpayer=TAXPAYER_INDIVIDUAL)
    articles = {c["article"] for c in individual.citations}
    assert "Pasal 56 ayat (2)" in articles  # the 0,5% rate
    assert "Pasal 60 ayat (2)" in articles  # the Rp 500 juta band
    assert "Pasal 60 ayat (3)" in articles  # cumulative since first period
    assert "Pasal 60 ayat (5) huruf b" in articles  # how the base is computed

    entity = assess_pph_final(600_000_000, taxpayer=TAXPAYER_ENTITY)
    entity_articles = {c["article"] for c in entity.citations}
    assert "Pasal 60 ayat (2)" not in entity_articles  # no individual exemption


def test_exemption_summary_quotes_pasal_60_ayat_2():
    result = assess_pph_final(100_000_000, taxpayer=TAXPAYER_INDIVIDUAL)
    assert "Pasal 60 ayat (2)" in result.as_dict()["summary"]


def test_exemption_summary_formats_numbers_without_mangling_sentences():
    summary = assess_pph_final(875_000, taxpayer=TAXPAYER_INDIVIDUAL).as_dict()["summary"]
    assert "Rp875.000" in summary
    assert "Rp500.000.000" in summary
    assert "(Pasal 60 ayat (2))," in summary  # sentence comma preserved


def test_taxed_summary_uses_indonesian_grouping():
    summary = assess_pph_final(600_000_000, taxpayer=TAXPAYER_INDIVIDUAL).as_dict()["summary"]
    assert "Rp100.000.000" in summary  # taxable base, dot-grouped
    assert "Rp500.000" in summary  # 0,5% x 100.000.000
    assert "0,5%" in summary


def test_every_citation_result_is_serialisable():
    for cite in tax.CITATIONS.values():
        d = cite.as_dict()
        assert d["article"] and d["quote"] and d["label"]
        assert d["source"] == "PP 55/2022"


# ── Turnover from the ledger ────────────────────────────────────────────────


def _entry(date, lines):
    return {"date": date, "description": "x", "lines": lines}


def test_gross_turnover_sums_revenue_credit_side():
    entries = [
        _entry("2026-10-05", [{"account": "Kas", "debit": 5_000_000, "credit": 0},
                              {"account": "Pendapatan Penjualan", "debit": 0, "credit": 5_000_000}]),
        _entry("2026-10-06", [{"account": "Kas", "debit": 3_000_000, "credit": 0},
                              {"account": "Pendapatan Usaha", "debit": 0, "credit": 3_000_000}]),
    ]
    assert gross_turnover(entries) == 8_000_000


def test_gross_turnover_nets_contra_revenue():
    entries = [
        _entry("2026-10-06", [{"account": "Pendapatan Penjualan", "debit": 0, "credit": 10_000_000}]),
        _entry("2026-10-07", [{"account": "Retur Penjualan", "debit": 1_000_000, "credit": 0}]),
    ]
    assert gross_turnover(entries) == 9_000_000


def test_expenses_do_not_count_as_turnover():
    entries = [
        _entry("2026-10-05", [{"account": "Beban Sewa", "debit": 3_000_000, "credit": 0},
                              {"account": "Kas", "debit": 0, "credit": 3_000_000}]),
    ]
    assert gross_turnover(entries) == 0


# ── The tool (compute_pph_final) ────────────────────────────────────────────


def test_tool_errors_without_ledger_entries():
    result = compute_pph_final(tool_context=FakeToolContext())
    assert result["status"] == "error"
    assert "ledger" in result["error_message"].lower()


def test_tool_assesses_the_session_ledger():
    ctx = FakeToolContext()
    commit_journal_entry(
        description="Penjualan kopi hari ini",
        lines=[
            {"account": "Kas", "debit": 600_000_000, "credit": 0},
            {"account": "Pendapatan Penjualan", "debit": 0, "credit": 600_000_000},
        ],
        tool_context=ctx,
    )
    # The committed entry is now in session state, so the tax agent can read it.
    assert len(ctx.state["ledger_entries"]) == 1

    result = compute_pph_final(tool_context=ctx, taxpayer=TAXPAYER_INDIVIDUAL)
    assert result["status"] == "success"
    assert result["turnover"] == 600_000_000
    assert result["payable"] == 500_000
    assert result["citations"]
    assert ctx.state["tax_return"]["payable"] == 500_000


def test_tool_can_be_called_without_context_for_imports():
    # A bare call must not explode (it simply reports no ledger).
    assert compute_pph_final()["status"] == "error"


def test_tool_accepts_explicit_turnover_without_a_session_ledger():
    # This is the path the console uses: it sends the ledger's own turnover.
    result = compute_pph_final(tool_context=FakeToolContext(), turnover=600_000_000)
    assert result["status"] == "success"
    assert result["turnover"] == 600_000_000
    assert result["payable"] == 500_000
    assert result["turnover_source"] == "argument"


def test_tool_reports_session_ledger_as_the_source():
    ctx = FakeToolContext(
        [
            _entry(
                "2026-10-05",
                [{"account": "Pendapatan Penjualan", "debit": 0, "credit": 700_000_000}],
            )
        ]
    )
    result = compute_pph_final(tool_context=ctx)
    assert result["status"] == "success"
    assert result["turnover_source"] == "session_ledger"
    assert result["payable"] == 1_000_000  # 0,5% x (700.000.000 - 500.000.000)


def test_tool_rejects_a_non_numeric_turnover():
    result = compute_pph_final(tool_context=FakeToolContext(), turnover="banyak")  # type: ignore[arg-type]
    assert result["status"] == "error"


# ── Cascade wiring (ADK) ────────────────────────────────────────────────────


def test_root_agent_keeps_slice_a_identity_and_tool():
    assert root_agent.name == "agent_keuangan"
    assert commit_journal_entry in [getattr(t, "func", t) for t in root_agent.tools]


def test_root_agent_has_agent_fiskal_as_sub_agent():
    names = [a.name for a in root_agent.sub_agents]
    assert "agent_fiskal" in names


def test_agent_fiskal_exposes_the_tax_tool_and_is_one_way():
    assert agent_fiskal.name == "agent_fiskal"
    assert compute_pph_final in [getattr(t, "func", t) for t in agent_fiskal.tools]
    assert agent_fiskal.disallow_transfer_to_parent is True
