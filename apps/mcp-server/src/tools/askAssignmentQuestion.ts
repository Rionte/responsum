import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { MODEL_FAST, QA_SYSTEM_PROMPT } from "@responsum/shared";
import { callClaudeText } from "../claude";
import { latestAssignment } from "../store";

export function registerAskAssignmentQuestion(server: McpServer): void {
  server.registerTool("ask_assignment_question", {
    description:
      "Answers a question about the assignment using only the captured summary, plan, and instructions.",
    inputSchema: { question: z.string() }
  }, async ({ question }) => {
    const current = await latestAssignment();
    if (!current) {
      return { content: [{ type: "text", text: "No assignment captured yet. Capture one with the Chrome extension first." }] };
    }
    const context = [
      `Summary: ${JSON.stringify(current.summary ?? null)}`,
      `Plan: ${JSON.stringify(current.plan ?? null)}`,
      `Instructions (truncated): ${current.capturedText.slice(0, 6000)}`
    ].join("\n\n");
    const answer = await callClaudeText(QA_SYSTEM_PROMPT, `${context}\n\nQuestion: ${question}`, MODEL_FAST, 500);
    return { content: [{ type: "text", text: answer }] };
  });
}
