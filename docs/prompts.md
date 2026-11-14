# Prompt contracts

All prompts live in `packages/shared/src/prompts.ts` so the extension and the MCP server stay in sync. Model IDs are pinned there too (`claude-sonnet-4-5` balanced, `claude-haiku-4-5` fast); re-check the Anthropic models page near the event date.

| Prompt | Model | Input | Output contract | Feature |
|---|---|---|---|---|
| `SUMMARIZER_SYSTEM_PROMPT` | balanced | captured instructions text | JSON `AssignmentSummary` only, no invented facts, `null`/`[]` when silent | summarizer |
| `PLANNER_SYSTEM_PROMPT` | balanced | summary JSON + captured text | JSON array of `PlanStep`, dependency-ordered, ends with a review step | plan-generator |
| `QA_SYSTEM_PROMPT` | fast | question + summary + plan + captured text | Grounded answer naming the field used, or an explicit "not covered" reply | popup Q&A, MCP ask tool |
| `REVIEWER_SYSTEM_PROMPT` | balanced | assignment context + code file/diff | JSON array of `ReviewFinding` with severities BLOCKING / SHOULD_FIX / NIT and a minimal concrete fix each | MCP review tool |

## Reliability pattern (shared by every JSON call)

`parseWithRetry` in `packages/shared/src/parse.ts`: zod-parse the reply, and on failure retry once with the validation error appended to the conversation; on second failure surface a typed error. Both the extension (`lib/claude.ts`) and the MCP server (`apps/mcp-server/src/claude.ts`) go through it.

## Tuning history

Record prompt changes here with the assignment page they were tested on, so the next tweak does not regress the demo.
