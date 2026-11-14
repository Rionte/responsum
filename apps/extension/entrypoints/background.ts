import { browser } from "wxt/browser";
import { handlers } from "../lib/handlers";

export default defineBackground(() => {
  browser.runtime.onMessage.addListener(
    (
      msg: { type?: string; payload?: unknown } | undefined,
      _sender,
      sendResponse
    ) => {
      const type = msg?.type;
      if (!type) return false;
      const handler = handlers[type];
      if (!handler) return false;
      handler(msg.payload)
        .then((data) => sendResponse({ ok: true, data }))
        .catch((err: unknown) =>
          sendResponse({ ok: false, error: err instanceof Error ? err.message : String(err) })
        );
      return true;
    }
  );
});