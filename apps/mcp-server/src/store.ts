import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Assignment } from "@responsum/shared";

// Reads the same file the sync server writes, so the two processes stay decoupled
const STORE_PATH = path.join(import.meta.dirname, "..", "..", "sync-server", "src", "data", "store.json");

export async function listAssignments(): Promise<Assignment[]> {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Assignment[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function latestAssignment(): Promise<Assignment | undefined> {
  return (await listAssignments())[0];
}
