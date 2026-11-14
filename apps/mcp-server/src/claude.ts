import Anthropic from "@anthropic-ai/sdk";
import type { ZodType } from "zod";
import { MODEL_BALANCED, parseWithRetry } from "@responsum/shared";

const anthropic = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment

export async function callClaudeText(system: string, user: string, model: string, maxTokens = 1000): Promise<string> {
  const message = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: user }]
  });
  const text = message.content
    .filter((block) => block.type === "text")
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("")
    .trim();
  if (!text) throw new Error("Claude returned an empty reply");
  return text;
}

export async function callClaudeJson<T>(
  schema: ZodType<T>,
  system: string,
  user: string,
  model = MODEL_BALANCED,
  maxTokens = 2000
): Promise<T> {
  return parseWithRetry(schema, (retryUser) => callClaudeText(system, retryUser, model, maxTokens), user);
}
