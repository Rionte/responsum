import { browser } from "wxt/browser";
import { MSG_EXTRACT_REQUEST, type ExtractResult } from "../lib/messaging";

export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_idle",
  main() {
    browser.runtime.onMessage.addListener(
      (msg: { type?: string } | undefined, _sender, sendResponse) => {
        if (msg?.type !== MSG_EXTRACT_REQUEST) return false;
        const text = (document.body?.innerText ?? "").trim().slice(0, 20000);
        const result: ExtractResult = { title: document.title, url: location.href, text };
        sendResponse(result);
        return false;
      }
    );
  }
});