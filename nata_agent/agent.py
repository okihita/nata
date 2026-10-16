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
from google.adk.tools import ToolContext

from .tax import compute_pph_final
from .regulasi import classify_kbli

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


def commit_journal_entry(
    description: str,
    lines: list[JournalLine],
    tool_context: ToolContext = None,
) -> dict:
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

    # Record the committed posting in session state so Agent Fiskal can assess
    # the tax on the same journal (the cascade reads state, not a side channel).
    committed_lines = [
        {"account": line.account.strip(), "debit": line.debit, "credit": line.credit}
        for line in committed
    ]
    if tool_context is not None and getattr(tool_context, "state", None) is not None:
        ledger = list(tool_context.state.get("ledger_entries") or [])
        ledger.append(
            {
                "date": _today_iso(),
                "description": description.strip(),
                "lines": committed_lines,
            }
        )
        tool_context.state["ledger_entries"] = ledger

    return {
        "status": "success",
        "message": (
            f"Journal entry committed: {len(committed)} lines, "
            f"total debit = total credit = {total:,.2f} IDR."
        ),
        "description": description.strip(),
        "lines": committed_lines,
        "total_debit": total,
        "total_credit": total,
        "balanced": True,
        "accounting_equation": "Assets = Liabilities + Equity",
    }


def _today_iso() -> str:
    from datetime import date

    return date.today().isoformat()


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
5. After a successful commit, you MUST hand the posted entry to "Agent Fiskal"
   (the tax agent) so the PPh Final is computed on it. Do that by calling
   `transfer_to_agent` with `agent_name` = "agent_fiskal". Do not compute tax
   yourself and do not answer the tax question yourself. Fiskal will in turn
   hand the case to Agent Regulasi for the KBLI licensing classification — you
   do not need to contact Regulasi yourself.
6. When transferred, output only the transfer function call — no accompanying
   text.

Always answer in English. Keep amounts in Indonesian Rupiah (IDR). Never invent
amounts that are not on the receipt.
"""

_TAX_INSTRUCTION = """You are "Agent Fiskal", the Indonesian tax-compliance agent
for a micro/small business. Agent Keuangan has just posted a journal entry to the
ledger and handed it to you; your job is the tax follow-through.

Workflow — follow it on every request:
1. Call the `compute_pph_final` tool EXACTLY ONCE. It returns the turnover, the
   tax payable and the Pasal/Ayat citations. NEVER compute tax yourself and
   never invent a figure.
   - If the request states a specific turnover figure (peredaran bruto, in
     rupiah), pass it to the tool as the `turnover` argument (a number, no
     separators), and pass `taxpayer` ("orang_pribadi" or "badan") when a
     taxpayer type is named.
   - Otherwise omit `turnover`: the tool then reads the journal that Agent
     Keuangan committed in this session.
2. If the tool returns status "error" (for example, no ledger entries yet),
   report the error plainly and stop — there is nothing to assess.
3. Report the result in plain Indonesian for the shop owner, and for EVERY
   figure quote its Pasal/Ayat citation verbatim from the tool's `citations`
   array (for example: "Tarif 0,5% — Pasal 56 ayat (2)"). Name the article and
   quote its text; do not paraphrase the law.
4. State clearly when the Rp 500.000.000 individual exemption (Pasal 60 ayat (2))
   makes the tax Rp 0, and how much of that band has been used.
5. After reporting the tax, hand the case to "Agent Regulasi" so the business's
   KBLI 2020 licensing code is classified. Do that by calling `transfer_to_agent`
   with `agent_name` = "agent_regulasi". Report the tax FIRST, then transfer —
   do not mention licensing yourself, that is Regulasi's job.
6. Do not call any other tool.

Answer in Indonesian. Amounts are Indonesian Rupiah (IDR).
"""

_REGULASI_INSTRUCTION = """You are "Agent Regulasi", the Indonesian business-licensing
agent for a micro/small business. Agent Fiskal has just finished the tax
assessment and handed the case to you; your job is the *perizinan* follow-through —
mapping what the business actually does to its official KBLI 2020 code.

Workflow — follow it on every request:
1. Work out what the business actually does, in plain words, from the receipt(s)
   and the journal in this session (for example: "warung kopi, pembeli makan di
   tempat"), or from the description given in the request.
2. Call the `classify_kbli` tool with that `description`. It returns real
   candidates from the official KBLI 2020 catalogue (1.790 codes). NEVER invent
   a KBLI code and never guess one from memory.
3. Pick the single best candidate, then call `classify_kbli` AGAIN with that
   `code` to verify it. Only a `status: "success"` result is a verified code.
   If it returns "error", take another candidate and verify that instead.
4. Report the verified code with its official title quoted exactly as the tool
   returned it. State the code and name (for example: "56102 — Rumah/Warung
   Makan").
5. Be honest about what is NOT known: the tool returns `risk_level: null`
   because KBLI does not carry the risk tier. Say plainly that the risk level
   (Rendah/Menengah/Tinggi) and the licensing steps must be confirmed at
   OSS-RBA, and that Nata does not guess them. Never invent a licence name,
   cost, or processing time.
6. Do not transfer anywhere. Do not call any other tool.

Answer in Indonesian, in plain language a shop owner understands. Amounts are
Indonesian Rupiah (IDR).
"""

agent_regulasi = Agent(
    model=MODEL,
    name="agent_regulasi",
    description=(
        "Agent Regulasi maps a micro/small business's activities to its exact "
        "KBLI 2020 code and grounds it in the official catalogue."
    ),
    instruction=_REGULASI_INSTRUCTION,
    tools=[classify_kbli],
    # One-way hop: licensing is the last stop, it never bounces back up.
    disallow_transfer_to_parent=True,
)

agent_fiskal = Agent(
    model=MODEL,
    name="agent_fiskal",
    description=(
        "Agent Fiskal computes the PPh Final UMKM 0,5% liability under PP 55/2022 "
        "and grounds every figure in its exact Pasal/Ayat citation."
    ),
    instruction=_TAX_INSTRUCTION,
    tools=[compute_pph_final],
    # Chains onward to Regulasi: the cascade is one-way, never back to the parent.
    sub_agents=[agent_regulasi],
    disallow_transfer_to_parent=True,
)

root_agent = Agent(
    model=MODEL,
    name="agent_keuangan",
    description=(
        "Agent Keuangan turns a receipt photo into a balanced SAK EMKM "
        "double-entry journal entry, then hands off to Agent Fiskal for tax."
    ),
    instruction=_INSTRUCTION,
    tools=[commit_journal_entry],
    sub_agents=[agent_fiskal],
)
