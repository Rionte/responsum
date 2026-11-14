import { defineConfig } from "wxt";

export default defineConfig({
  manifest: {
    name: "Responsum",
    description: "Turns assignment instructions into a summary and a step-by-step plan",
    version: "0.1.0",
    permissions: ["activeTab", "scripting", "storage", "contextMenus"],
    host_permissions: ["https://api.anthropic.com/*", "http://localhost:8787/*"]
  }
});