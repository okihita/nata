"""Cascade topology tests.

These guard the wiring of the four-agent cascade, and specifically the failure
mode found live on 2026-10-17: the Perizinan screen asked the cascade *root*
(Agent Keuangan) to classify a KBLI code. That agent does not own
`classify_kbli`, so the model reported the tool as unavailable and then invented
a code from memory.

The guardrail held — no unverified code reached the UI — but the feature never
worked. These tests assert the shape that makes it work: each agent owns exactly
the tool it is asked to call, and the entry points that expose those tools exist.
"""

from __future__ import annotations

import pytest

from nata_agent import root_agent


def _tool_names(agent) -> set[str]:
    return {t.__name__ for t in (agent.tools or [])}


def _agent_by_name(agent, name: str):
    """Depth-first search for a sub-agent by name."""
    if agent.name == name:
        return agent
    for sub in getattr(agent, "sub_agents", []) or []:
        found = _agent_by_name(sub, name)
        if found is not None:
            return found
    return None


# ── The cascade shape ───────────────────────────────────────────────────────


def test_root_is_agent_keuangan():
    assert root_agent.name == "agent_keuangan"
    assert "commit_journal_entry" in _tool_names(root_agent)


def test_cascade_reaches_all_three_agents():
    for name in ("agent_keuangan", "agent_fiskal", "agent_regulasi"):
        assert _agent_by_name(root_agent, name) is not None, f"{name} missing from cascade"


def test_each_agent_owns_exactly_its_own_tool():
    """The bug: an agent asked for a tool it does not own will confide in memory."""
    expected = {
        "agent_keuangan": {"commit_journal_entry"},
        "agent_fiskal": {"compute_pph_final"},
        "agent_regulasi": {"classify_kbli"},
    }
    for name, tools in expected.items():
        agent = _agent_by_name(root_agent, name)
        assert agent is not None
        assert _tool_names(agent) == tools, (
            f"{name} should own exactly {tools}, has {_tool_names(agent)}"
        )


def test_no_agent_owns_a_tool_that_belongs_to_another():
    """Tools must not be shared: that is what made the wrong agent answer."""
    owners: dict[str, str] = {}
    def walk(agent):
        for t in agent.tools or []:
            owners.setdefault(t.__name__, agent.name)
        for sub in getattr(agent, "sub_agents", []) or []:
            walk(sub)
    walk(root_agent)
    assert owners == {
        "commit_journal_entry": "agent_keuangan",
        "compute_pph_final": "agent_fiskal",
        "classify_kbli": "agent_regulasi",
    }


def test_cascade_is_one_way():
    """Every downstream agent is barred from bouncing back up."""
    for name in ("agent_fiskal", "agent_regulasi"):
        agent = _agent_by_name(root_agent, name)
        assert agent is not None
        assert agent.disallow_transfer_to_parent is True


def test_fiskal_chains_to_regulasi():
    fiskal = _agent_by_name(root_agent, "agent_fiskal")
    assert fiskal is not None
    assert [s.name for s in fiskal.sub_agents] == ["agent_regulasi"]


def test_regulasi_is_a_leaf():
    regulasi = _agent_by_name(root_agent, "agent_regulasi")
    assert regulasi is not None
    assert not getattr(regulasi, "sub_agents", None)


# ── Entry points ────────────────────────────────────────────────────────────


def test_regulasi_is_also_served_as_its_own_app():
    """The screen needs an entry point that actually exposes classify_kbli."""
    from nata_regulasi import root_agent as regulasi_app

    assert regulasi_app.name == "agent_regulasi"
    assert "classify_kbli" in _tool_names(regulasi_app)


def test_standalone_app_shares_the_single_definition():
    """Re-export, not a copy — the two entry points cannot drift."""
    from nata_regulasi import root_agent as regulasi_app

    assert regulasi_app is _agent_by_name(root_agent, "agent_regulasi")


# ── Instructions carry the anti-hallucination rule ──────────────────────────


def test_regulasi_instruction_forbids_inventing_codes():
    """The instruction must tell the model not to guess a code from memory.

    This is the written half of the fix for the hallucination found live on
    2026-10-17: with no tool available the model invented one, so the prompt
    states outright that codes may only come from the tool.
    """
    regulasi = _agent_by_name(root_agent, "agent_regulasi")
    assert regulasi is not None
    text = regulasi.instruction.lower()
    assert "never invent" in text
    assert "memory" in text
    assert "classify_kbli" in text


def test_regulasi_instruction_requires_verify_step():
    regulasi = _agent_by_name(root_agent, "agent_regulasi")
    assert regulasi is not None
    text = regulasi.instruction.lower()
    # It must tell the model to verify the chosen code, not just search.
    assert "verifikasi" in text or "verify" in text
