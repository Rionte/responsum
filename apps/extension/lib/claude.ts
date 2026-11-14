import type { ZodType } from "zod";
import { MODEL_BALANCED, MODEL_FAST, parseWithRetry } from "@responsum/shared";

const API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

interface ClaudeResponse {
  content: { type: string; text?: string }[];
}

// Raw text call; returns the concatenated text blocks of the reply
export async function callClaudeText(
  system: string,
  user: string,
  apiKey: string,
  model = MODEL_BALANCED,
  maxTokens = 2000
): Promise<string> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": ANTHROPIC_VERSION,
      // Anthropic's documented header that enables CORS for direct browser calls
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }]
    })
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Claude API error ${res.status}: ${truncate(body, 300)}`);
  }
  const data = (await res.json()) as ClaudeResponse;
  const text = data.content
    .filter((block) => block.type === "text")
    .map((block) => block.text ?? "")
    .join("")
    .trim();
  if (!text) throw new Error("Claude returned an empty reply");
  return text;
}

// JSON call: parses with the schema and retries once, feeding the validation error back
export async function callClaudeJson<T>(
  schema: ZodType<T>,
  system: string,
  user: string,
  apiKey: string,
  model = MODEL_BALANCED,
  maxTokens = 2000
): Promise<T> {
  return parseWithRetry(schema, (retryUser) => callClaudeText(system, retryUser, apiKey, model, maxTokens), user);
}

// Tiny call used by the options page test-key button
export async function testApiKey(apiKey: string): Promise<boolean> {
  const reply = await callClaudeText("Reply with exactly: OK", "ping", apiKey, MODEL_FAST, 16);
  return reply.toUpperCase().includes("OK");
}

function truncate(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max)}...`;
}
