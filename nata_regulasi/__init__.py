"""Agent Regulasi as a standalone ADK app.

The cascade entry point (`nata_agent`) resolves to *Agent Keuangan*, which owns
`commit_journal_entry` and nothing else. Asking that agent to classify a KBLI
code fails two ways: it does not have `classify_kbli`, and — given no tool — the
model will happily invent a code from memory.

This package exposes Agent Regulasi on its own so the Perizinan screen can talk
to the agent that actually owns the tool. There is exactly one definition of the
agent (in `nata_agent.agent`); this module only re-exports it as its own root, so
the two entry points can never drift apart.

`adk api_server` serves every app package under the agents directory, so both
`nata_agent` and `nata_regulasi` appear in `/list-apps`.
"""

from nata_agent.agent import agent_regulasi as root_agent

__all__ = ["root_agent"]
