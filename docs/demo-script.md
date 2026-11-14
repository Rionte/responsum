# Demo script (5 minutes)

Owner: Feruza. Record a backup screen recording before rehearsal ends.

1. **The pain (30s):** show a real messy assignment page. "Every student has lost marks misreading this."
2. **Capture and summarize (60s):** right-click, "Capture instructions with Responsum", open the popup, Analyze. Summary card appears with due date, deliverables, grading criteria.
3. **Plan (60s):** Plan tab, Generate plan. Checklist with time estimates; check two steps, progress bar moves.
4. **The differentiator, Copilot in VS Code (120s):** switch windows. Ask "What does the assignment require for the report?" (grounded answer). Then "Review my changes against the assignment." (findings with severities tied to requirements).
5. **Close (30s):** architecture diagram from `docs/architecture.md`; closing line: "We did not just build a summarizer, we built assignment context as a tool the whole dev environment can use."

## Fallbacks

- If the API or network dies: the canned assignment in the library still demos the plan UI, and `store.json` still feeds the MCP tools.
- If Copilot misbehaves: the popup Ask tab shows the same grounded answering.

TODO: fill in the exact click path per machine after rehearsal.
