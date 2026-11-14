import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { latestAssignment } from "../store";

export function registerGetCurrentAssignment(server: McpServer): void {
  server.registerTool("get_current_assignment", {
    description:
      "Returns the assignment summary and step-by-step plan captured by the Responsum Chrome extension. Use before writing or reviewing any code for this project."
  }, async () => {
    const current = await latestAssignment();
    const payload = current
      ? { ...current, capturedText: current.capturedText.slice(0, 4000) }
      : { note: "no assignment captured yet" };
    return { content: [{ type: "text", text: JSON.stringify(payload, null, 2) }] };
  });
}
