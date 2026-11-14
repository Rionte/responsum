import { testApiKey } from "../../lib/claude";
import {
  getApiKey,
  getModelChoice,
  saveApiKey,
  saveModelChoice,
  type ModelChoice
} from "../../lib/storage";
import "../popup/style.css";

const keyInput = document.getElementById("api-key") as HTMLInputElement;
const modelSelect = document.getElementById("model") as HTMLSelectElement;
const saveButton = document.getElementById("save") as HTMLButtonElement;
const testButton = document.getElementById("test") as HTMLButtonElement;
const status = document.getElementById("status") as HTMLElement;

async function load(): Promise<void> {
  const [key, model] = await Promise.all([getApiKey(), getModelChoice()]);
  if (key) keyInput.value = key;
  modelSelect.value = model;
}

saveButton.addEventListener("click", async () => {
  const key = keyInput.value.trim();
  if (!key) {
    status.textContent = "Enter an API key first.";
    return;
  }
  await saveApiKey(key);
  await saveModelChoice(modelSelect.value as ModelChoice);
  status.textContent = "Saved.";
});

testButton.addEventListener("click", async () => {
  const key = keyInput.value.trim();
  if (!key) {
    status.textContent = "Enter an API key first.";
    return;
  }
  status.textContent = "Testing key...";
  try {
    const ok = await testApiKey(key);
    status.textContent = ok ? "Key works." : "Key test returned an unexpected reply.";
  } catch (err) {
    status.textContent = `Key test failed: ${err instanceof Error ? err.message : String(err)}`;
  }
});

void load();