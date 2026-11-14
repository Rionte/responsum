import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { listAssignments } from "../store";

export function registerListAssignments(server: McpServer): void {
  server.registerTool("list_assignments", {
    description:
      "Lists the assignments captured by the Responsum Chrome extension with id, title, due date, and capture time."
  }, async () => {
    const assignments = await listAssignments();
    const payload = assignments.map((a) => ({
      id: a.id,
      title: a.title,
      dueDate: a.summary?.dueDate ?? null,
      capturedAt: a.capturedAt
    }));
    return { content: [{ type: "text", text: JSON.stringify(payload, null, 2) }] };
  });
}
