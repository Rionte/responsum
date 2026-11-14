import type { Assignment } from "@responsum/shared";
import {
  assignmentSummarySchema,
  MODEL_BALANCED,
  MODEL_FAST,
  SUMMARIZER_SYSTEM_PROMPT
} from "@responsum/shared";
import { callClaudeJson } from "../claude";
import { clearDraft, getApiKey, getDraft, getModelChoice, saveAssignment } from "../storage";
import { pushAssignment } from "../sync";

export async function summarizeDraft(): Promise<{ assignmentId: string }> {
  const apiKey = await getApiKey();
  if (!apiKey) throw new Error("No API key set. Add it on the options page.");

  const draft = await getDraft();
  if (!draft || !draft.capturedText.trim()) throw new Error("No instructions captured yet.");

  const model = (await getModelChoice()) === "fast" ? MODEL_FAST : MODEL_BALANCED;
  const summary = await callClaudeJson(
    assignmentSummarySchema,
    SUMMARIZER_SYSTEM_PROMPT,
    draft.capturedText,
    apiKey,
    model
  );

  const assignment: Assignment = {
    id: crypto.randomUUID(),
    title: draft.title ?? "Assignment",
    sourceUrl: draft.sourceUrl ?? "",
    capturedAt: new Date().toISOString(),
    capturedText: draft.capturedText,
    summary
  };
  await saveAssignment(assignment);
  await clearDraft();
  void pushAssignment(assignment);
  return { assignmentId: assignment.id };
}
