import { MODEL_FAST, QA_SYSTEM_PROMPT } from "@responsum/shared";
import { callClaudeText } from "../claude";
import { getApiKey, getCurrentAssignment } from "../storage";

export async function askQuestion(payload: unknown): Promise<{ answer: string }> {
  const question = ((payload as { question?: string } | undefined)?.question ?? "").trim();
  if (!question) throw new Error("Type a question first.");

  const apiKey = await getApiKey();
  if (!apiKey) throw new Error("No API key set. Add it on the options page.");

  const assignment = await getCurrentAssignment();
  if (!assignment) throw new Error("Capture and analyze an assignment first.");

  const context = [
    `Summary: ${JSON.stringify(assignment.summary ?? null)}`,
    `Plan: ${JSON.stringify(assignment.plan ?? null)}`,
    `Instructions (truncated): ${assignment.capturedText.slice(0, 6000)}`
  ].join("\n\n");
  const answer = await callClaudeText(
    QA_SYSTEM_PROMPT,
    `${context}\n\nQuestion: ${question}`,
    apiKey,
    MODEL_FAST,
    500
  );
  return { answer };
}
