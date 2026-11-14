# responsum

HackDedouverte 2026 project: a Chrome extension that captures assignment instructions, summarizes them with Claude, drafts a step-by-step plan, and feeds that context to VS Code Copilot through an MCP server.

- Full project plan: `../responsum-project-plan.md` (Desktop)
- Branch order and owners: `../responsum-branch-order.md` (Desktop)
- Docs: `docs/architecture.md`, `docs/prompts.md`, `docs/copilot-review-guide.md`, `docs/demo-script.md`

## Structure


## Quickstart

1. Install Node 20.11+, then run `npm install` at the repo root (this also generates the WXT editor types).
2. Extension: `npm run dev:extension`, open `chrome://extensions`, enable Developer mode, click Load unpacked, select `apps/extension/.output/chrome-mv3`.
3. Enter the team Claude API key on the extension options page.
4. Sync server: `npm run dev:sync`, then verify http://127.0.0.1:8787/health responds.
5. MCP server: open this repo in VS Code 1.99+, open Copilot Chat in agent mode. The server declared in `.vscode/mcp.json` runs from source through tsx; VS Code prompts for the API key on first use.
6. Capture an assignment (popup or right-click menu), analyze it, generate the plan, then ask Copilot questions or request a review.

## Conventions

- TypeScript strict everywhere; shared contracts (types, zod schemas, prompts) live in `packages/shared` and are imported as `@responsum/shared`.
- Branches: `feature/<name>`, `fix/<symptom>`, `chore/<name>`, `docs/<name>`; squash-merge PRs into `main`.
- Comments are single-line only. The key never gets committed; `.env` is gitignored.
