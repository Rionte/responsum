import type { ZodType } from "zod";

// Models often wrap JSON in prose or markdown fences; pull out the JSON payload
export function parseModelJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = (fenced?.[1] ?? text).trim();
  const start = candidate.search(/[[{]/);
  if (start === -1) throw new Error("reply contains no JSON");
  const end = Math.max(candidate.lastIndexOf("}"), candidate.lastIndexOf("]"));
  if (end <= start) throw new Error("reply contains no complete JSON");
  return JSON.parse(candidate.slice(start, end + 1));
}

// Shared contract: parse, and on failure retry once feeding the validation error back to the model
export async function parseWithRetry<T>(
  schema: ZodType<T>,
  call: (user: string) => Promise<string>,
  user: string
): Promise<T> {
  const first = await call(user);
  const firstAttempt = attempt(schema, first);
  if (firstAttempt.ok) return firstAttempt.value;
  const retryUser = `${user}\n\nYour previous reply was not valid JSON for the requested shape: ${firstAttempt.error}. Reply again with ONLY the corrected JSON.`;
  const second = await call(retryUser);
  const secondAttempt = attempt(schema, second);
  if (secondAttempt.ok) return secondAttempt.value;
  throw new Error(`Model kept returning invalid JSON: ${secondAttempt.error}`);
}

function attempt<T>(schema: ZodType<T>, text: string): { ok: true; value: T } | { ok: false; error: string } {
  try {
    return { ok: true, value: schema.parse(parseModelJson(text)) };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
