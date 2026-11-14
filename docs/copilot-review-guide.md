# Copilot review guide

## Prerequisites

- VS Code 1.99 or newer (MCP support for Copilot agent mode shipped in the March 2025 release).
- `npm install` at the repo root (the MCP server runs from source via tsx).
- Copilot Chat open in agent mode; VS Code prompts for the Anthropic API key on first tool use.

## Tools available from the responsum server

| Tool | Purpose |
|---|---|
| `get_current_assignment` | Read the summary and plan captured by the Chrome extension |
| `list_assignments` | List captured assignments with id, title, due date, capture time |
| `ask_assignment_question` | Grounded Q&A over the captured instructions |
| `review_code` | Review a code file or diff against the assignment requirements |

## Review workflow

1. Open Copilot Chat and switch to agent mode.
2. Say: "Review my uncommitted changes against the assignment. Use responsum tools."
3. Copilot calls `get_current_assignment`, reads the diff, calls `review_code`, and reports findings classified BLOCKING / SHOULD_FIX / NIT, each with a minimal concrete fix.
4. For questions, ask directly ("What does the assignment require for the report?"); Copilot routes it to `ask_assignment_question`.

## Demo prompts that always work

- "Use responsum to get the assignment, then list what the grading criteria require."
- "Review src/example.ts against the assignment requirements."
- "What constraints does the assignment mention about sources?"

Repo conventions Copilot auto-reads live in `.github/copilot-instructions.md`.
