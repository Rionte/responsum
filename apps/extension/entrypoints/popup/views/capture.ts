import { clearDraft, getDraft, saveDraft } from "../../../lib/storage";

export async function renderCaptureView(
  container: HTMLElement
): Promise<void> {
  container.innerHTML = `
    <h1>Responsum</h1>
    <p class="hint">Paste assignment instructions here. Page capture and analysis arrive with the next branches.</p>
    <textarea id="draft-text" placeholder="Paste the assignment instructions here"></textarea>
    <div class="row">
      <button id="save-draft" class="primary">Save draft</button>
      <button id="clear-draft" class="ghost">Clear</button>
    </div>
    <p id="capture-status" class="status"></p>`;
  const textarea = container.querySelector("#draft-text") as HTMLTextAreaElement;
  const status = container.querySelector("#capture-status") as HTMLElement;
  const draft = await getDraft();
  if (draft) textarea.value = draft.capturedText;

  container.querySelector("#save-draft")?.addEventListener("click", async () => {
    const text = textarea.value.trim();
    if (!text) {
      status.textContent = "Paste some instructions first.";
      return;
    }
    await saveDraft({ capturedText: text, title: null, sourceUrl: null });
    status.textContent = "Draft saved.";
  });

  container.querySelector("#clear-draft")?.addEventListener("click", async () => {
    await clearDraft();
    textarea.value = "";
    status.textContent = "";
  });
}
