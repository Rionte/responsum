import { browser } from "wxt/browser";
import type { Assignment, CaptureDraft } from "@responsum/shared";

const KEY_API_KEY = "apiKey";
const KEY_MODEL = "model";
const KEY_DRAFT = "draft";
const KEY_ASSIGNMENTS = "assignments";
const KEY_CURRENT_ID = "currentId";

export type ModelChoice = "balanced" | "fast";

export async function getApiKey(): Promise<string | undefined> {
  const stored = await browser.storage.local.get(KEY_API_KEY);
  return stored[KEY_API_KEY] as string | undefined;
}

export async function saveApiKey(apiKey: string): Promise<void> {
  await browser.storage.local.set({ [KEY_API_KEY]: apiKey });
}

export async function getModelChoice(): Promise<ModelChoice> {
  const stored = await browser.storage.local.get(KEY_MODEL);
  return stored[KEY_MODEL] === "fast" ? "fast" : "balanced";
}

export async function saveModelChoice(choice: ModelChoice): Promise<void> {
  await browser.storage.local.set({ [KEY_MODEL]: choice });
}

export async function getDraft(): Promise<CaptureDraft | undefined> {
  const stored = await browser.storage.local.get(KEY_DRAFT);
  return stored[KEY_DRAFT] as CaptureDraft | undefined;
}

export async function saveDraft(draft: CaptureDraft): Promise<void> {
  await browser.storage.local.set({ [KEY_DRAFT]: draft });
}

export async function clearDraft(): Promise<void> {
  await browser.storage.local.remove(KEY_DRAFT);
}

export async function listAssignments(): Promise<Assignment[]> {
  const stored = await browser.storage.local.get(KEY_ASSIGNMENTS);
  const list = stored[KEY_ASSIGNMENTS];
  return Array.isArray(list) ? (list as Assignment[]) : [];
}

export async function saveAssignment(assignment: Assignment): Promise<void> {
  const all = await listAssignments();
  const next = [...all.filter((a) => a.id !== assignment.id), assignment];
  next.sort((a, b) => b.capturedAt.localeCompare(a.capturedAt));
  await browser.storage.local.set({ [KEY_ASSIGNMENTS]: next });
}

export async function getCurrentAssignment(): Promise<Assignment | undefined> {
  const [all, stored] = await Promise.all([
    listAssignments(),
    browser.storage.local.get(KEY_CURRENT_ID)
  ]);
  const currentId = stored[KEY_CURRENT_ID] as string | undefined;
  return all.find((a) => a.id === currentId) ?? all[0];
}

export async function setCurrentAssignment(id: string): Promise<void> {
  await browser.storage.local.set({ [KEY_CURRENT_ID]: id });
}

export async function deleteAssignment(id: string): Promise<void> {
  const all = await listAssignments();
  await browser.storage.local.set({ [KEY_ASSIGNMENTS]: all.filter((a) => a.id !== id) });
  const stored = await browser.storage.local.get(KEY_CURRENT_ID);
  if (stored[KEY_CURRENT_ID] === id) await browser.storage.local.remove(KEY_CURRENT_ID);
}

export async function setCaptureBadge(): Promise<void> {
  await browser.action.setBadgeText({ text: "1" });
  await browser.action.setBadgeBackgroundColor({ color: "#4f46e5" });
}

export async function clearCaptureBadge(): Promise<void> {
  await browser.action.setBadgeText({ text: "" });
}