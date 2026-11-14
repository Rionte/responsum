import { browser } from "wxt/browser";

export const MSG_EXTRACT_REQUEST = "responsum:extract-request";
export const MSG_CAPTURE_PAGE = "responsum:capture-page";
export const MSG_ANALYZE = "responsum:analyze";
export const MSG_GENERATE_PLAN = "responsum:generate-plan";
export const MSG_ASK = "responsum:ask";

export interface ExtractResult {
  title: string;
  url: string;
  text: string;
}

export interface BackgroundResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

export type BackgroundHandler = (payload: unknown) => Promise<unknown>;

export async function sendToBackground<T>(
  type: string,
  payload?: unknown
): Promise<BackgroundResponse<T>> {
  const response = (await browser.runtime.sendMessage({ type, payload })) as
    | BackgroundResponse<T>
    | undefined;
  if (!response) return { ok: false, error: "No response from the background worker." };
  return response;
}