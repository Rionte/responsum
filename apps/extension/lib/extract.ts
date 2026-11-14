export interface ExtractedPage {
  title: string;
  url: string;
  text: string;
}

export function extractInstructionsInPage(): ExtractedPage {
  const MAX_LENGTH = 20000;
  const selection = window.getSelection()?.toString().trim() ?? "";

  let raw = selection;
  if (selection.length < 40) {
    raw = "";
    const selectors = [
      "main",
      "article",
      "[role=main]",
      "#content",
      ".content",
      ".assignment",
      ".description",
      ".instructions"
    ];
    for (const selector of selectors) {
      const el = document.querySelector(selector);
      const text = el instanceof HTMLElement ? el.innerText : "";
      if (text.trim().length > raw.length) raw = text;
    }
    if (raw.trim().length < 200) raw = document.body?.innerText ?? "";
  }

  const text = raw
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, MAX_LENGTH);
  return { title: document.title, url: location.href, text };
}