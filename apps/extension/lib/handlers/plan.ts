import { MODEL_BALANCED, MODEL_FAST, planSchema, PLANNER_SYSTEM_PROMPT } from "@responsum/shared";
import { callClaudeJson } from "../claude";
import { getApiKey, getCurrentAssignment, getModelChoice, saveAssignment } from "../storage";
import { pushAssignment } from "../sync";

export async function generatePlan(): Promise<{ assignmentId: string }> {
  const apiKey = await getApiKey();
  if (!apiKey) throw new Error("No API key set. Add it on the options page.");

  const assignment = await getCurrentAssignment();
  if (!assignment?.summary) throw new Error("Analyze the instructions before generating a plan.");

  const model = (await getModelChoice()) === "fast" ? MODEL_FAST : MODEL_BALANCED;
  const user = `Assignment summary JSON:\n${JSON.stringify(assignment.summary, null, 2)}\n\nRaw instructions:\n${assignment.capturedText}`;
  const plan = await callClaudeJson(planSchema, PLANNER_SYSTEM_PROMPT, user, apiKey, model, 4000);

  const updated = { ...assignment, plan: plan.map((step) => ({ ...step, done: false })) };
  await saveAssignment(updated);
  void pushAssignment(updated);
  return { assignmentId: updated.id };
}
