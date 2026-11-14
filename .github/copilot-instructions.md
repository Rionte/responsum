# Responsum repo conventions for GitHub Copilot

- TypeScript strict mode everywhere; no `any`. Import shared types and zod schemas from `@responsum/shared`.
- Layout: `apps/extension` (WXT, MV3), `apps/sync-server` (Express, 127.0.0.1:8787), `apps/mcp-server` (MCP over stdio), `packages/shared` (contracts).
- Before writing or reviewing any code for this project, call the `get_current_assignment` MCP tool from the responsum server to read the actual assignment requirements, and judge code against them.
- Code reviews must classify findings as BLOCKING, SHOULD_FIX, or NIT, and each finding's fix must state the minimal concrete change (exact lines, types, or names).
- Comments are single-line only.
- Never commit secrets: the Claude API key lives in the extension options page (chrome.storage.local) or in `.env` (gitignored), and VS Code prompts for it via `.vscode/mcp.json` inputs.
- Servers run from source with tsx; there is no server build step. The extension builds with `wxt build`.
