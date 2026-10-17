"""PPh Final UMKM engine — the deterministic core behind Agent Fiskal.

The model never does the arithmetic and never invents a citation. This module
(re)computes the tax from the session ledger and attaches *verbatim* statutory
quotes read from the in-repo statute file
(:mod:`nata_agent.statutes.pp-55-2022-pph-final-umkm`).

Grounding is **in-context only**: the statute text lives in the repository and is
read and quoted directly. No Vertex AI Search / Discovery Engine / managed RAG
index is used or wired here — that is a deliberate, later decision by the owner.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Iterable, Mapping

from google.adk.tools import ToolContext

from . import entities

# ── Statutory constants (PP 55/2022) ────────────────────────────────────────

#: Pasal 56 ayat (2) — final rate on gross turnover.
PPH_FINAL_RATE = 0.005
#: Pasal 57 ayat (1) huruf b — turnover ceiling for the scheme.
PPH_TURNOVER_CEILING = 4_800_000_000
#: Pasal 60 ayat (2) — individual-taxpayer zero-tax band (per tax year).
PPH_INDIVIDUAL_EXEMPTION = 500_000_000

#: Taxpayer types recognised by Pasal 57 ayat (1).
TAXPAYER_INDIVIDUAL = "orang_pribadi"
TAXPAYER_ENTITY = "badan"

STATUTE_FILE = Path(__file__).resolve().parent / "statutes" / "pp-55-2022-pph-final-umkm.md"


# ── Citations ───────────────────────────────────────────────────────────────


@dataclass(frozen=True)
class Citation:
    """One grounded statutory reference: article + verbatim quote."""

    article: str
    quote: str
    label: str
    source: str = "PP 55/2022"
    file: str = "nata_agent/statutes/pp-55-2022-pph-final-umkm.md"

    def as_dict(self) -> dict[str, str]:
        return {
            "article": self.article,
            "label": self.label,
            "quote": self.quote,
            "source": self.source,
            "file": self.file,
        }


#: Every quote below must appear verbatim in STATUTE_FILE — enforced by
#: ``tests/test_compute_pph_final.py::test_every_citation_is_verbatim_in_statute``.
CITATIONS: dict[str, Citation] = {
    "pasal_56_ayat_1": Citation(
        article="Pasal 56 ayat (1)",
        label="PPh Final atas peredaran bruto tertentu",
        quote=(
            "Atas penghasilan dari usaha yang diterima atau diperoleh Wajib Pajak "
            "dalam negeri yang memiliki peredaran bruto tertentu, dikenai Pajak "
            "Penghasilan yang bersifat final dalam jangka waktu tertentu."
        ),
    ),
    "pasal_56_ayat_2": Citation(
        article="Pasal 56 ayat (2)",
        label="Tarif final 0,5%",
        quote=(
            "Tarif Pajak Penghasilan yang bersifat final sebagaimana dimaksud pada "
            "ayat (1) sebesar 0,5% (nol koma lima persen)."
        ),
    ),
    "pasal_57_ayat_1_huruf_b": Citation(
        article="Pasal 57 ayat (1) huruf b",
        label="Batas peredaran bruto Rp4.800.000.000",
        quote=(
            "Wajib Pajak badan berbentuk koperasi, persekutuan komanditer, firma, "
            "perseroan terbatas, atau badan usaha milik desa/badan usaha milik desa "
            "bersama, yang menerima atau memperoleh penghasilan dengan peredaran "
            "bruto tidak melebihi Rp4.800.000.000,00 (empat miliar delapan ratus "
            "juta rupiah) dalam 1 (satu) Tahun Pajak."
        ),
    ),
    "pasal_60_ayat_2": Citation(
        article="Pasal 60 ayat (2)",
        label="Pembebasan Rp500.000.000 untuk orang pribadi",
        quote=(
            "Wajib Pajak orang pribadi yang memiliki peredaran bruto tertentu "
            "sebagaimana dimaksud dalam Pasal 57 ayat (1) huruf a, atas bagian "
            "peredaran bruto dari usaha sampai dengan Rp500.000.000,00 (lima ratus "
            "juta rupiah) dalam 1 (satu) Tahun Pajak tidak dikenai Pajak "
            "Penghasilan."
        ),
    ),
    "pasal_60_ayat_3": Citation(
        article="Pasal 60 ayat (3)",
        label="Pembebasan dihitung kumulatif sejak Masa Pajak pertama",
        quote=(
            "Bagian peredaran bruto dari usaha tidak dikenai Pajak Penghasilan "
            "sebagaimana dimaksud pada ayat (2) merupakan jumlah peredaran bruto "
            "dari usaha yang dihitung secara kumulatif sejak Masa Pajak pertama "
            "dalam suatu Tahun Pajak atau bagian Tahun Pajak."
        ),
    ),
    "pasal_60_ayat_5_huruf_b": Citation(
        article="Pasal 60 ayat (5) huruf b",
        label="Cara menghitung PPh terutang orang pribadi",
        quote=(
            "dasar pengenaan pajak sebagaimana dimaksud pada ayat (1) setelah "
            "memperhitungkan bagian peredaran bruto dari usaha sebagaimana dimaksud "
            "pada ayat (2), untuk Wajib Pajak orang pribadi sebagaimana dimaksud "
            "dalam Pasal 57 ayat (1) huruf a."
        ),
    ),
    "pasal_61_ayat_1": Citation(
        article="Pasal 61 ayat (1)",
        label="Tetap final 0,5% pada tahun peredaran bruto melewati Rp4,8 M",
        quote=(
            "Wajib Pajak sebagaimana dimaksud dalam Pasal 57 ayat (1) yang "
            "peredaran brutonya pada Tahun Pajak berjalan telah melebihi "
            "Rp4.800.000.000,00 (empat miliar delapan ratus juta rupiah), atas "
            "penghasilan dari usaha tetap dikenai tarif Pajak Penghasilan "
            "sebagaimana dimaksud dalam Pasal 56 ayat (2) sampai dengan akhir Tahun "
            "Pajak bersangkutan."
        ),
    ),
}


def statute_text() -> str:
    """Read the in-repo statute text (in-context grounding; no managed index)."""
    return STATUTE_FILE.read_text(encoding="utf-8")


def _squash(text: str) -> str:
    """Normalise text for verbatim comparison: drop markdown blockquote
    markers/bold emphasis and collapse all whitespace to single spaces."""
    lines = []
    for raw in text.splitlines():
        line = raw.lstrip()
        if line.startswith(">"):
            line = line[1:]
        lines.append(line.replace("**", ""))
    return " ".join(" ".join(lines).split())


def citation_is_verbatim(quote: str) -> bool:
    """True if ``quote`` appears verbatim in the statute file (ignoring the
    line wrapping of the markdown source)."""
    return _squash(quote) in _squash(statute_text())


def citation(article_key: str) -> dict[str, str]:
    """Return one citation as a plain dict, or raise for an unknown key."""
    try:
        return CITATIONS[article_key].as_dict()
    except KeyError as exc:  # pragma: no cover - defensive
        raise KeyError(f"unknown statute citation {article_key!r}") from exc


# ── Revenue classification (minimal SAK EMKM mapping) ───────────────────────

_REVENUE_NAMES = {
    "pendapatan penjualan",
    "pendapatan usaha",
    "pendapatan jasa",
    "pendapatan lain-lain",
    "penjualan",
    "penjualan bersih",
}
_CONTRA_REVENUE_NAMES = {
    "retur dan diskon penjualan",
    "retur penjualan",
    "diskon penjualan",
    "potongan penjualan",
}


def _normalise(name: str) -> str:
    return " ".join(name.strip().lower().replace("&", " ").split())


def is_revenue_account(account: str) -> bool:
    """True for revenue and contra-revenue accounts (SAK EMKM group 4 / Pendapatan).

    Both contribute ``credit - debit`` to turnover: a normal revenue account has
    a credit balance (adds), a contra-revenue account has a debit balance
    (subtracts). The sign falls out of the posting, so no extra multiplier is
    applied here.
    """
    key = _normalise(account)
    if key in _REVENUE_NAMES or key in _CONTRA_REVENUE_NAMES:
        return True
    if key.startswith("4-") or key.startswith("4."):
        return True
    return "pendapatan" in key or "penjualan" in key


def gross_turnover(
    entries: Iterable[Mapping[str, Any]],
    *,
    exclude_professional_services: bool = False,
) -> int:
    """Compute cumulative gross turnover (peredaran bruto) from ledger entries.

    Turnover is the net of revenue and contra-revenue (returns/discounts), each
    posted as ``credit - debit``. Pasal 60 ayat (4) defines the base as the
    consideration received before sales/cash discounts; the ledger's net revenue
    account mirrors that.
    """
    total = 0.0
    for entry in entries or []:
        for line in entry.get("lines") or []:
            if not is_revenue_account(str(line.get("account", ""))):
                continue
            total += float(line.get("credit") or 0) - float(line.get("debit") or 0)
    if exclude_professional_services:
        # Pasal 56 ayat (3) huruf a excludes individual professional income; the
        # prototype keeps a single revenue stream, so nothing to subtract yet.
        pass
    return int(round(total))


def period_year(entries: Iterable[Mapping[str, Any]], default_year: int | None = None) -> int:
    """Latest tax year present in the ledger (defaults to the current year)."""
    years = [
        int(str(entry.get("date", ""))[:4])
        for entry in (entries or [])
        if str(entry.get("date", ""))[:4].isdigit()
    ]
    if years:
        return max(years)
    if default_year is not None:
        return default_year
    from datetime import date

    return date.today().year


def period_months(entries: Iterable[Mapping[str, Any]]) -> int:
    """Distinct YYYY-MM buckets the figures are drawn from (at least 1)."""
    buckets = {str(e.get("date", ""))[:7] for e in (entries or []) if e.get("date")}
    return max(1, len(buckets))


# ── Assessment ──────────────────────────────────────────────────────────────


def _idr(value: int) -> str:
    """Format an integer as Indonesian-grouped rupiah digits (1.234.567)."""
    return f"{int(round(value)):,}".replace(",", ".")


@dataclass
class TaxAssessment:
    """The full, citable result of one PPh Final assessment."""

    taxpayer: str
    turnover: int
    exemption_applied: int
    taxable_base: int
    rate: float
    payable: int
    exemption_remaining: int
    over_ceiling: bool
    year: int
    months: int
    monthly_estimate: int
    citations: list[dict[str, str]] = field(default_factory=list)

    def as_dict(self) -> dict[str, Any]:
        rate_pct = f"{self.rate * 100:.1f}".replace(".", ",") + "%"
        return {
            "status": "success",
            "taxpayer": self.taxpayer,
            "taxpayer_label": (
                "Wajib Pajak orang pribadi"
                if self.taxpayer == TAXPAYER_INDIVIDUAL
                else "Wajib Pajak badan"
            ),
            "scheme": "PPh Final UMKM — PP 55/2022",
            "turnover": self.turnover,
            "exemption_applied": self.exemption_applied,
            "taxable_base": self.taxable_base,
            "rate": self.rate,
            "rate_percent": rate_pct,
            "payable": self.payable,
            "exemption_remaining": self.exemption_remaining,
            "over_ceiling": self.over_ceiling,
            "year": self.year,
            "months": self.months,
            "monthly_estimate": self.monthly_estimate,
            "citations": self.citations,
            "summary": self._summary(),
        }

    def _summary(self) -> str:
        if self.payable == 0 and self.taxpayer == TAXPAYER_INDIVIDUAL:
            return (
                f"Peredaran bruto Rp{_idr(self.turnover)} masih di dalam pembebasan "
                f"Rp{_idr(PPH_INDIVIDUAL_EXEMPTION)} (Pasal 60 ayat (2)), jadi PPh "
                "Final terutang Rp0."
            )
        rate = f"{self.rate * 100:.1f}".replace(".", ",")
        return (
            f"PPh Final = {rate}% x Rp{_idr(self.taxable_base)} = "
            f"Rp{_idr(self.payable)} (Pasal 56 ayat (2))."
        )


def assess_pph_final(
    turnover: int,
    *,
    taxpayer: str = TAXPAYER_INDIVIDUAL,
    entity: str | None = None,
    year: int | None = None,
    months: int = 1,
) -> TaxAssessment:
    """Deterministic PPh Final assessment — the arithmetic Agent Fiskal reports.

    Individual taxpayers get the cumulative Rp 500.000.000 zero-tax band
    (Pasal 60 ayat (2)–(3)); entity taxpayers are taxed on the full base
    (Pasal 60 ayat (5) huruf a).

    ``entity`` (lihat :mod:`nata_agent.entities`) adalah bentuk usaha yang
    tepat — orang pribadi, PT Perorangan, atau PT/CV. Bila diberi, ia yang
    menentukan pembebasan, dan mengalahkan flag ``taxpayer`` yang kasar. Ini
    penting karena PT Perorangan adalah *badan* (tidak dapat pembebasan),
    sedangkan pemilik orang pribadi dapat — beda yang tidak bisa diungkapkan
    oleh flag dua nilai yang lama.
    """
    turnover = int(turnover)

    if entity is not None:
        exemption_applies = entities.exemption_applies(entity)
        taxpayer = TAXPAYER_INDIVIDUAL if exemption_applies else TAXPAYER_ENTITY
    else:
        if taxpayer not in (TAXPAYER_INDIVIDUAL, TAXPAYER_ENTITY):
            raise ValueError(f"unknown taxpayer type: {taxpayer!r}")
        exemption_applies = taxpayer == TAXPAYER_INDIVIDUAL

    if exemption_applies:
        exemption_applied = min(max(turnover, 0), PPH_INDIVIDUAL_EXEMPTION)
    else:
        exemption_applied = 0

    taxable_base = max(0, turnover - exemption_applied)
    payable = int(round(taxable_base * PPH_FINAL_RATE))
    months = max(1, int(months))

    keys = ["pasal_56_ayat_1", "pasal_56_ayat_2", "pasal_57_ayat_1_huruf_b"]
    if exemption_applies:
        keys += ["pasal_60_ayat_2", "pasal_60_ayat_3", "pasal_60_ayat_5_huruf_b"]
    if turnover > PPH_TURNOVER_CEILING:
        keys.append("pasal_61_ayat_1")
    citations = [CITATIONS[key].as_dict() for key in keys]

    return TaxAssessment(
        taxpayer=taxpayer,
        turnover=turnover,
        exemption_applied=exemption_applied,
        taxable_base=taxable_base,
        rate=PPH_FINAL_RATE,
        payable=payable,
        exemption_remaining=max(0, PPH_INDIVIDUAL_EXEMPTION - exemption_applied)
        if exemption_applies
        else 0,
        over_ceiling=turnover > PPH_TURNOVER_CEILING,
        year=year or 0,
        months=months,
        monthly_estimate=int(round(payable / months)),
        citations=citations,
    )


# ── ADK tool ────────────────────────────────────────────────────────────────


def compute_pph_final(
    tool_context: ToolContext = None,
    taxpayer: str = TAXPAYER_INDIVIDUAL,
    entity: str = "",
    turnover: int | None = None,
) -> dict:
    """Compute the PPh Final UMKM 0,5% liability for the posted ledger.

    Reads the journal that Agent Keuangan committed in this session and returns
    the tax, the Rp 500.000.000 exemption usage and a verbatim Pasal/Ayat
    citation for every figure. The model must call this tool and must not do the
    arithmetic itself.

    Args:
        entity: The precise business form — ``"orang_pribadi"``,
            ``"pt_perorangan"`` or ``"pt_cv"``. Prefer this over ``taxpayer``:
            it decides the Rp 500 million band exactly, which matters because
            PT Perorangan is a *badan* (no band) while an individual owner gets
            it. See :mod:`nata_agent.entities`.
        taxpayer: Coarse fallback when the precise form is unknown —
            ``"orang_pribadi"`` (gets the band, Pasal 60 ayat (2)) or
            ``"badan"`` (no band).
        turnover: Optional explicit gross turnover (peredaran bruto) to assess.
            Pass this only when an explicit figure is given in the request;
            omit it to assess the session ledger that was committed here.

    Returns:
        dict: on success ``{"status": "success", ...}`` with ``payable``,
        ``turnover``, ``exemption_applied``, ``taxable_base``, ``rate``,
        ``citations[]`` and a plain-Indonesian ``summary``. On failure
        ``{"status": "error", "error_message": ...}``.
    """
    entries: list[dict[str, Any]] = []
    if tool_context is not None:
        state = getattr(tool_context, "state", None)
        if state is not None:
            entries = list(state.get("ledger_entries") or [])

    if turnover is not None:
        try:
            assessed_turnover = int(turnover)
        except (TypeError, ValueError):
            return {
                "status": "error",
                "error_message": f"turnover must be a number (rupiah), got {turnover!r}.",
            }
    elif entries:
        assessed_turnover = gross_turnover(entries)
    else:
        return {
            "status": "error",
            "error_message": (
                "No ledger entries in this session yet and no turnover given. "
                "PPh Final is computed from a committed journal or an explicit "
                "turnover, so post the receipt first."
            ),
        }

    year = period_year(entries)
    months = period_months(entries)

    # An unknown entity string is reported rather than silently ignored: falling
    # back to the payer flag would quietly apply the wrong tax treatment.
    entity_key = (entity or "").strip()
    if entity_key and not entities.is_known_entity(entity_key):
        return {
            "status": "error",
            "error_message": (
                f"bentuk usaha {entity!r} tidak dikenal. "
                f"Pilihan: {', '.join(entities.ENTITY_TYPES)}."
            ),
        }

    assessment = assess_pph_final(
        assessed_turnover,
        taxpayer=taxpayer,
        entity=entity_key or None,
        year=year,
        months=months,
    )
    result = assessment.as_dict()
    result["turnover_source"] = "argument" if turnover is not None else "session_ledger"
    if entity_key:
        result["entity"] = entity_key
        result["entity_profile"] = entities.profile_of(entity_key).label

    if tool_context is not None:
        state = getattr(tool_context, "state", None)
        if state is not None:
            state["tax_return"] = result

    return result
