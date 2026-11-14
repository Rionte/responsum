import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ReviewFinding } from "@responsum/shared";
import { MODEL_BALANCED, parseWithRetry, REVIEWER_SYSTEM_PROMPT, reviewFindingSchema } from "@responsum/shared";
import { callClaudeText } from "../claude";
import { latestAssignment } from "../store";

const findingsSchema = z.array(reviewFindingSchema);

export function registerReviewCode(server: McpServer): void {
  server.registerTool("review_code", {
    description:
      "Reviews a code file or diff against the captured assignment requirements and returns findings with severity BLOCKING, SHOULD_FIX, or NIT plus a minimal concrete fix each.",
    inputSchema: {
      code: z.string(),
      filePath: z.string().optional(),
      focus: z.string().optional()
    }
  }, async ({ code, filePath, focus }) => {
    const current = await latestAssignment();
    const requirements = current?.summary
      ? `Assignment: ${current.title}\nRequirements: ${JSON.stringify(current.summary.requirements)}\nGrading criteria: ${JSON.stringify(current.summary.gradingCriteria)}\nDeliverables: ${JSON.stringify(current.summary.deliverables)}`
      : "No assignment captured yet; review for general quality only.";
    const user = `${requirements}\n${focus ? `Review focus: ${focus}\n` : ""}File: ${filePath ?? "unspecified"}\n\nCode to review:\n${code}`;
    const findings = await parseWithRetry(
      findingsSchema,
      (retryUser) => callClaudeText(REVIEWER_SYSTEM_PROMPT, retryUser, MODEL_BALANCED, 2000),
      user
    );
    return { content: [{ type: "text", text: formatFindings(findings) }] };
  });
}

function formatFindings(findings: ReviewFinding[]): string {
  if (!findings.length) return "No findings. The code satisfies the assignment requirements as far as I can tell.";
  return findings
    .map((f) => `[${f.severity}] ${f.file}${f.line != null ? `:${f.line}` : ""}\nIssue: ${f.issue}\nFix: ${f.fix}`)
    .join("\n\n");
}
