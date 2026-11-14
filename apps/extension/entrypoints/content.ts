import { browser } from "wxt/browser";
import { MSG_EXTRACT_REQUEST } from "../lib/messaging";
import { extractInstructionsInPage } from "../lib/extract";

export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_idle",
  main() {
    browser.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
      if (msg?.type !== MSG_EXTRACT_REQUEST) return false;
      sendResponse(extractInstructionsInPage());
      return false;
    });
  }
});