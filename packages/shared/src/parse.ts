import type { ZodType } from "zod";

// Models often wrap JSON in prose or markdown fences; extract the JSON payload
export function extractJsonPayload(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = (fenced?.[1] ?? text).trim();
  const start = candidate.search(/[[{]/);
  if (start === -1) return "";
  const end = Math.max(candidate.lastIndexOf("}"), candidate.lastIndexOf("]"));
  if (end <= start) return "";
  return candidate.slice(start, end + 1);
}

// Strict parse of a model reply; throws with the underlying JSON position error
export function parseModelJson(text: string): unknown {
  const payload = extractJsonPayload(text);
  if (!payload) throw new Error("reply contains no JSON");
  return JSON.parse(payload);
}

// Best-effort repair for a JSON array cut off or corrupted mid-item: keep the complete leading objects
function salvageTruncatedArray(payload: string): unknown | null {
  if (!payload.startsWith("[")) return null;
  let cut = payload.lastIndexOf("}");
  while (cut !== -1) {
    try {
      const parsed = JSON.parse(`${payload.slice(0, cut + 1)}]`);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // step back one object boundary and try again
    }
    cut = payload.lastIndexOf("}", cut - 1);
  }
  return null;
}

// Shared contract: parse, retry once with the validation error fed back, then salvage
export async function parseWithRetry<T>(
  schema: ZodType<T>,
  call: (user: string) => Promise<string>,
  user: string
): Promise<T> {
  const first = await call(user);
  const firstAttempt = attempt(schema, first);
  if (firstAttempt.ok) return firstAttempt.value;

  const retryUser = `${user}\n\nYour previous reply was not valid JSON for the requested shape: ${firstAttempt.error}. Reply again with ONLY the corrected JSON, complete and compact. Usual causes: the reply was cut off by the length limit, or a double quote inside a string value was not escaped; escape inner quotes with a backslash and output fewer or shorter items if needed.`;
  const second = await call(retryUser);
  const secondAttempt = attempt(schema, second);
  if (secondAttempt.ok) return secondAttempt.value;

  // Last resort before failing the feature: keep the complete leading items of a broken array
  for (const raw of [second, first]) {
    const salvaged = salvageTruncatedArray(extractJsonPayload(raw));
    if (salvaged === null) continue;
    const validated = schema.safeParse(salvaged);
    if (validated.success) return validated.data;
  }
  throw new Error(`Model kept returning invalid JSON: ${secondAttempt.error}`);
}

function attempt<T>(schema: ZodType<T>, text: string): { ok: true; value: T } | { ok: false; error: string } {
  try {
    return { ok: true, value: schema.parse(parseModelJson(text)) };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
