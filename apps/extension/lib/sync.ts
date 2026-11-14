import type { Assignment } from "@responsum/shared";

const SYNC_BASE_URL = "http://localhost:8787";

export async function pushAssignment(assignment: Assignment): Promise<void> {
  try {
    const res = await fetch(`${SYNC_BASE_URL}/assignments`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(assignment)
    });
    if (!res.ok) console.warn(`Responsum sync failed with status ${res.status}`);
  } catch (err) {
    console.warn("Responsum sync server unreachable", err);
  }
}