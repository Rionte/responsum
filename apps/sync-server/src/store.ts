import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Assignment } from "@responsum/shared";

const DATA_DIR = path.join(import.meta.dirname, "data");
const STORE_PATH = path.join(DATA_DIR, "store.json");
const TMP_PATH = `${STORE_PATH}.tmp`;

export async function loadStore(): Promise<Assignment[]> {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Assignment[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return []; // missing or corrupt file starts an empty store
  }
}

// Atomic write: dump to a tmp file, then rename over the real one
export async function saveStore(assignments: Assignment[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(TMP_PATH, JSON.stringify(assignments, null, 2), "utf8");
  await rename(TMP_PATH, STORE_PATH);
}
