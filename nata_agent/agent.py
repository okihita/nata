"""Agent Keuangan — Slice A: receipt photo -> SAK EMKM journal entry.

The model proposes; the code enforces. Gemini (multimodal) reads a receipt and
proposes double-entry lines, but nothing reaches the ledger until the
deterministic guardrail in :func:`commit_journal_entry` has proven the posting
balances (``Assets = Liabilities + Equity``).
"""

from __future__ import annotations

import os
from typing import Any

from pydantic import BaseModel, Field, ValidationError

from google.adk.agents.llm_agent import Agent

# Model id is configuration, not code: pin/update it via NATA_MODEL without a
# code change. Default is the project's agreed starting model (see AGENTS.md).
# NOTE: Gemini on this project is only reachable through the *global* Vertex AI
# endpoint (asia-southeast2 returns FAILED_PRECONDITION for Gemini models), so
# GOOGLE_CLOUD_LOCATION must be "global" for live calls to succeed.
MODEL = os.environ.get("NATA_MODEL", "gemini-3.8-flash")


class JournalEntryError(ValueError):
    """Raised when a proposed journal entry is not a valid double-entry posting."""


class JournalLine(BaseModel):
    """A single debit *or* credit line of a journal entry (amounts in IDR)."""

    account: str = Field(
        ...,
        description=(
            "SAK EMKM account name, e.g. 'Kas', 'Beban Perlengkapan', "
            "'Peralatan', 'Utang Usaha', 'Pendapatan Usaha'."
        ),
    )
    debit: float = Field(
        0.0,
        description="Debit amount in IDR (>= 0). Leave 0 when this line is a credit.",
    )
    credit: float = Field(
        0.0,
        description="Credit amount in IDR (>= 0). Leave 0 when this line is a debit.",
    )


def _coerce_lines(lines: Any) -> list[JournalLine]:
    """Accept pydantic models, dicts, or a mix, and validate their shape."""
    if not isinstance(lines, (list, tuple)):
        raise JournalEntryError(
            "lines must be a list of {account, debit, credit} objects, "
            f"got {type(lines).__name__}."
        )
    coerced: list[JournalLine] = []
    for index, raw in enumerate(lines):
        if isinstance(raw, JournalLine):
            coerced.append(raw)
            continue
        if isinstance(raw, dict):
            try:
                coerced.append(JournalLine(**raw))
            except ValidationError as exc:
                raise JournalEntryError(
                    f"line #{index + 1} is malformed: {exc.errors()}"
                ) from exc
            continue
        raise JournalEntryError(
            f"line #{index + 1} must be an object with account/debit/credit, "
            f"got {type(raw).__name__}."
        )
    return coerced


def validate_journal_entry(lines: Any) -> list[JournalLine]:
    """Validate a double-entry posting; raise :class:`JournalEntryError` otherwise.

    Deterministic rules enforced (independent of the LLM):

    1. At least two lines — a single line can never be double-entry.
    2. Every line names a non-empty account.
    3. Amounts are non-negative.
    4. Each line is *either* a debit *or* a credit (exactly one side > 0).
    5. Total debits == total credits (to the cent).

    Rule 5 is the accounting identity ``Assets = Liabilities + Equity``: for any
    balanced double-entry posting the equation holds by construction.
    """
    coerced = _coerce_lines(lines)

    if len(coerced) < 2:
        raise JournalEntryError(
            f"a double-entry posting needs at least 2 lines, got {len(coerced)}. "
            "Every debit must be matched by a credit."
        )

    for index, line in enumerate(coerced):
        position = index + 1
        if not line.account.strip():
            raise JournalEntryError(f"line #{position} has an empty account name.")
        if line.debit < 0 or line.credit < 0:
            raise JournalEntryError(
                f"line #{position} '{line.account}' has a negative amount "
                f"(debit={line.debit}, credit={line.credit}); "
                "amounts must be >= 0."
            )
        if line.debit > 0 and line.credit > 0:
            raise JournalEntryError(
                f"line #{position} '{line.account}' sets both debit "
                f"({line.debit}) and credit ({line.credit}); one line is a debit "
                "or a credit, never both."
            )
        if line.debit == 0 and line.credit == 0:
            raise JournalEntryError(
                f"line #{position} '{line.account}' has zero debit and zero "
                "credit; every line must post a non-zero amount on one side."
            )

    total_debit = round(sum(line.debit for line in coerced), 2)
    total_credit = round(sum(line.credit for line in coerced), 2)

    if round(total_debit - total_credit, 2) != 0:
        raise JournalEntryError(
            "unbalanced journal entry: total debits "
            f"({total_debit:,.2f}) != total credits ({total_credit:,.2f}); "
            f"difference {round(total_debit - total_credit, 2):,.2f} IDR. "
            "Adjust a line so Assets = Liabilities + Equity."
        )

    return coerced


def commit_journal_entry(description: str, lines: list[JournalLine]) -> dict:
    """Validate and commit a double-entry journal entry to the SAK EMKM ledger.

    Call this tool for EVERY receipt — never write the journal entry as free
    text. The entry is committed only if it passes the deterministic guardrail;
    otherwise the tool returns an ``error`` and the entry is rejected.

    Args:
        description (str): Short narrative for the entry, e.g.
            "Pembelian perlengkapan tunai 150.000 (toko ATK)".
        lines (list[JournalLine]): The posting lines. Each line has ``account``,
            ``debit`` (IDR, >= 0) and ``credit`` (IDR, >= 0). Total debits MUST
            equal total credits.

    Returns:
        dict: On success ``{"status": "success", ...}`` with the committed
        entry, totals and a balance assertion. On rejection
        ``{"status": "error", "error_message": ...}`` describing what must be
        fixed — correct the lines and call the tool again.
    """
    if not isinstance(description, str) or not description.strip():
        return {
            "status": "error",
            "error_message": "description is required and must be a non-empty string.",
        }

    try:
        committed = validate_journal_entry(lines)
    except JournalEntryError as exc:
        return {"status": "error", "error_message": str(exc)}

    total = round(sum(line.debit for line in committed), 2)
    return {
        "status": "success",
        "message": (
            f"Journal entry committed: {len(committed)} lines, "
            f"total debit = total credit = {total:,.2f} IDR."
        ),
        "description": description.strip(),
        "lines": [
            {"account": line.account.strip(), "debit": line.debit, "credit": line.credit}
            for line in committed
        ],
        "total_debit": total,
        "total_credit": total,
        "balanced": True,
        "accounting_equation": "Assets = Liabilities + Equity",
    }


_INSTRUCTION = """You are "Agent Keuangan", the bookkeeping agent for an Indonesian
micro/small business. You turn receipt photos into journal entries under SAK EMKM
(Standar Akuntansi Keuangan untuk Entitas Mikro, Kecil, dan Menengah).

Workflow — follow it on every request:
1. Read the receipt image (or the user's text) and extract: merchant, date,
   total amount, and each purchased item with its price.
2. Map the items to SAK EMKM accounts. Typical accounts: Kas, Bank, Peralatan,
   Perlengkapan, Persediaan, Utang Usaha, Modal Pemilik, Pendapatan Usaha,
   Beban Perlengkapan, Beban Sewa, Beban Listrik & Air, Beban Gaji, PPN Masukan.
   A cash purchase of supplies, for example, debits "Beban Perlengkapan" and
   credits "Kas" for the same amount.
3. ALWAYS call the `commit_journal_entry` tool with a clear `description` and the
   full `lines` array. NEVER write the journal entry as free text, and never
   claim an entry is recorded without the tool returning status "success". The
   tool is the only thing that can commit to the ledger.
4. If the tool returns status "error", read the error message, fix the lines
   (usually the totals are unbalanced or a line has both sides set), and call
   the tool again. Do not give up while the entry can still be balanced.
5. After a successful commit, reply with a short summary: the description, the
   lines, and the total amount.

Always answer in English. Keep amounts in Indonesian Rupiah (IDR). Never invent
amounts that are not on the receipt.
"""

root_agent = Agent(
    model=MODEL,
    name="agent_keuangan",
    description=(
        "Agent Keuangan turns a receipt photo into a balanced SAK EMKM "
        "double-entry journal entry."
    ),
    instruction=_INSTRUCTION,
    tools=[commit_journal_entry],
)
