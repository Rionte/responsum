import { views } from "./views";
import type { PopupContext } from "./types";

const LABELS: Record<string, string> = {
  capture: "Capture",
  summary: "Summary",
  plan: "Plan",
  library: "Library",
  ask: "Ask"
};

let active = "capture";

function render(): void {
  const root = document.getElementById("app");
  if (!root) return;
  root.innerHTML = "";

  const tabs = document.createElement("nav");
  tabs.className = "tabs";
  for (const name of Object.keys(views)) {
    const tab = document.createElement("button");
    tab.textContent = LABELS[name] ?? name;
    tab.className = active === name ? "tab active" : "tab";
    tab.addEventListener("click", () => {
      active = name;
      render();
    });
    tabs.appendChild(tab);
  }
  root.appendChild(tabs);

  const ctx: PopupContext = {
    navigate: (view) => {
      active = view;
      render();
    },
    refresh: render
  };
  const body = document.createElement("main");
  body.className = "view";
  root.appendChild(body);
  void views[active]?.(body, ctx);
}

export function initApp(): void {
  render();
}