import { browser } from "wxt/browser";
import { MSG_CAPTURE_PAGE, MSG_EXTRACT_REQUEST, type ExtractResult } from "../lib/messaging";
import { handlers } from "../lib/handlers";
import { saveDraft, setCaptureBadge } from "../lib/storage";
import { extractInstructionsInPage } from "../lib/extract";

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
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
  });

  browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.removeAll(() => {
      browser.contextMenus.create({
        id: "responsum-capture",
        title: "Capture instructions with Responsum",
        contexts: ["page", "selection"]
      });
    });
  });

  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId !== "responsum-capture" || !tab?.id) return;
    const extracted = await captureFromTab(tab.id);
    await saveDraft({
      capturedText: extracted.text,
      title: extracted.title,
      sourceUrl: extracted.url
    });
    await setCaptureBadge();
  });

  handlers[MSG_CAPTURE_PAGE] = async () => {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error("No active tab to capture from.");
    const extracted = await captureFromTab(tab.id);
    await saveDraft({
      capturedText: extracted.text,
      title: extracted.title,
      sourceUrl: extracted.url
    });
    await setCaptureBadge();
    return { title: extracted.title, url: extracted.url, length: extracted.text.length };
  };
});

async function captureFromTab(tabId: number): Promise<ExtractResult> {
  try {
    const response = (await browser.tabs.sendMessage(tabId, {
      type: MSG_EXTRACT_REQUEST
    })) as ExtractResult | undefined;
    if (response?.text) return response;
  } catch {
    // The content script may not be available on a page loaded before installation.
  }

  const [injection] = await browser.scripting.executeScript({
    target: { tabId },
    func: extractInstructionsInPage
  });
  const result = injection?.result as ExtractResult | undefined;
  if (!result?.text) {
    throw new Error("Could not read this page. Copy and paste the instructions instead.");
  }
  return result;
}