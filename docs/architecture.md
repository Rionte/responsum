# Architecture

Two local processes share one JSON file, so the extension and Copilot stay decoupled.

```
+--------------------------+         +------------------------------+
|    Chrome Extension      |  HTTP   |      Local sync server       |
|    (MV3, TypeScript)     | ------> |  Express on 127.0.0.1:8787   |
|  content script: capture |  POST   |  REST + data/store.json      |
|  service worker: Claude  |         +---------------+--------------+
|  popup + options UI      |                         | reads the same file
+------------+-------------+                         v
             | fetch (direct, CORS)          +------------------------------+
             v                               |        MCP server (stdio)    |
+--------------------------+    stdio        |  Node + @modelcontextprotocol|
|   Anthropic Messages API | <---------------+  tools: get_current_...      |
|   api.anthropic.com      |                 |  ask, list, review_code      |
+--------------------------+                 +---------------+--------------+
                                                             | stdio
                                                             v
                                              VS Code Copilot Chat (agent mode)
```


## Data flow

1. The student clicks "Capture instructions" (context menu or popup) on the assignment page.
2. The content script extracts text: user selection first, page-text heuristics second, manual paste as fallback.
3. The service worker calls Claude with the summarizer prompt, validates the JSON reply with zod, and stores the assignment in `chrome.storage.local`.
4. The popup renders the summary card; "Generate plan" runs the planner prompt and renders a checkable checklist with time estimates.
5. The extension POSTs the assignment to the sync server, which persists it to `data/store.json`.
6. VS Code spawns the MCP server declared in `.vscode/mcp.json`; its tools read the same `store.json`.
7. Copilot calls `ask_assignment_question` or `review_code`, which call Claude with the assignment context and return grounded answers or structured findings.

## Why two processes

The MCP server is spawned by VS Code over stdio and lives only while VS Code needs it. The extension needs the sync server independent of VS Code. Sharing `data/store.json` keeps them decoupled with zero infrastructure.
