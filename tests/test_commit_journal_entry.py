"""Deterministic guardrail tests for Slice A — the model proposes, code enforces.

These tests never touch the network or Gemini: they exercise the tool's
double-entry validation directly.
"""

import pytest

from nata_agent.agent import (
    JournalEntryError,
    commit_journal_entry,
    root_agent,
    validate_journal_entry,
)


def test_valid_entry_commits_and_balances():
    result = commit_journal_entry(
        description="Pembelian perlengkapan kantor tunai",
        lines=[
            {"account": "Beban Perlengkapan", "debit": 150000, "credit": 0},
            {"account": "Kas", "debit": 0, "credit": 150000},
        ],
    )
    assert result["status"] == "success"
    assert result["total_debit"] == 150000
    assert result["total_credit"] == 150000
    assert result["balanced"] is True
    assert len(result["lines"]) == 2


def test_multi_line_entry_balances():
    result = commit_journal_entry(
        description="Pembelian peralatan sebagian kredit",
        lines=[
            {"account": "Peralatan", "debit": 1000000, "credit": 0},
            {"account": "Kas", "debit": 0, "credit": 400000},
            {"account": "Utang Usaha", "debit": 0, "credit": 600000},
        ],
    )
    assert result["status"] == "success"
    assert result["total_debit"] == result["total_credit"] == 1000000


def test_settle_receivable_and_revenue_balances():
    result = commit_journal_entry(
        description="Pendapatan jasa tunai",
        lines=[
            {"account": "Kas", "debit": 250000, "credit": 0},
            {"account": "Pendapatan Usaha", "debit": 0, "credit": 250000},
        ],
    )
    assert result["status"] == "success"


def test_unbalanced_entry_is_rejected():
    result = commit_journal_entry(
        description="tidak seimbang",
        lines=[
            {"account": "Kas", "debit": 100000, "credit": 0},
            {"account": "Pendapatan Usaha", "debit": 0, "credit": 90000},
        ],
    )
    assert result["status"] == "error"
    assert "unbalanced" in result["error_message"].lower()


def test_single_line_is_rejected():
    result = commit_journal_entry(
        description="only one side",
        lines=[{"account": "Kas", "debit": 100000, "credit": 0}],
    )
    assert result["status"] == "error"
    assert "at least 2 lines" in result["error_message"]


def test_line_with_both_sides_is_rejected():
    result = commit_journal_entry(
        description="both sides",
        lines=[
            {"account": "Kas", "debit": 50000, "credit": 50000},
            {"account": "Pendapatan Usaha", "debit": 0, "credit": 50000},
        ],
    )
    assert result["status"] == "error"
    assert "both" in result["error_message"].lower()


def test_zero_line_is_rejected():
    result = commit_journal_entry(
        description="zero line",
        lines=[
            {"account": "Kas", "debit": 0, "credit": 0},
            {"account": "Pendapatan Usaha", "debit": 0, "credit": 0},
        ],
    )
    assert result["status"] == "error"


def test_negative_amount_is_rejected():
    result = commit_journal_entry(
        description="negative",
        lines=[
            {"account": "Kas", "debit": -100, "credit": 0},
            {"account": "Pendapatan Usaha", "debit": 0, "credit": -100},
        ],
    )
    assert result["status"] == "error"
    assert "negative" in result["error_message"].lower()


def test_empty_account_is_rejected():
    result = commit_journal_entry(
        description="blank account",
        lines=[
            {"account": "   ", "debit": 100, "credit": 0},
            {"account": "Kas", "debit": 0, "credit": 100},
        ],
    )
    assert result["status"] == "error"


def test_missing_description_is_rejected():
    result = commit_journal_entry(
        description="",
        lines=[
            {"account": "Kas", "debit": 100, "credit": 0},
            {"account": "Pendapatan Usaha", "debit": 0, "credit": 100},
        ],
    )
    assert result["status"] == "error"
    assert "description" in result["error_message"].lower()


def test_malformed_line_shape_is_rejected():
    result = commit_journal_entry(
        description="bad shape",
        lines=[
            {"description": "no account here", "amount": 100},
            {"account": "Kas", "debit": 0, "credit": 100},
        ],
    )
    assert result["status"] == "error"
    assert "malformed" in result["error_message"].lower()


def test_validate_raises_for_unbalanced():
    with pytest.raises(JournalEntryError):
        validate_journal_entry(
            [
                {"account": "Kas", "debit": 10, "credit": 0},
                {"account": "Utang Usaha", "debit": 0, "credit": 9},
            ]
        )


def test_rounding_to_cents_is_tolerated():
    # 0.1 + 0.2 float noise must not break a genuinely balanced posting.
    result = commit_journal_entry(
        description="float noise",
        lines=[
            {"account": "Kas", "debit": 0.1, "credit": 0},
            {"account": "Kas Kecil", "debit": 0.2, "credit": 0},
            {"account": "Pendapatan Usaha", "debit": 0, "credit": 0.3},
        ],
    )
    assert result["status"] == "success"


def test_root_agent_is_wired_up():
    assert root_agent.name == "agent_keuangan"
    assert commit_journal_entry in [
        getattr(tool, "func", tool) for tool in root_agent.tools
    ]
