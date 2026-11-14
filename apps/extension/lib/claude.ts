import { MODEL_BALANCED } from "@responsum/shared";

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

export async function testApiKey(apiKey: string): Promise<boolean> {
  const response = await fetch(CLAUDE_API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: MODEL_BALANCED,
      max_tokens: 1,
      messages: [{ role: "user", content: "Reply with OK." }]
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `API returned status ${response.status}`);
  }
  return true;
}