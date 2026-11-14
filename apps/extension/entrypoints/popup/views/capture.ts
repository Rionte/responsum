import type { PopupContext } from "../types";
import { MSG_ANALYZE, MSG_CAPTURE_PAGE, sendToBackground } from "../../../lib/messaging";
import { clearCaptureBadge, clearDraft, getDraft, saveDraft } from "../../../lib/storage";

export async function renderCaptureView(container: HTMLElement, ctx: PopupContext): Promise<void> {
  container.innerHTML = `
    <h1>Responsum</h1>
    <p class="hint">Paste assignment instructions, or capture them from the current page.</p>
    <div class="row">
      <button id="capture-page" class="ghost">Capture this page</button>
      <button id="clear-draft" class="ghost">Clear</button>
    </div>
    <textarea id="draft-text" placeholder="Paste the assignment instructions here"></textarea>
    <div class="row"><button id="analyze" class="primary">Analyze with Claude</button></div>
    <p id="capture-status" class="status" aria-live="polite"></p>`;
  const textarea = container.querySelector("#draft-text") as HTMLTextAreaElement;
  const status = container.querySelector("#capture-status") as HTMLElement;
  const draft = await getDraft();
  if (draft) textarea.value = draft.capturedText;

  container.querySelector("#capture-page")?.addEventListener("click", async () => {
    status.textContent = "Capturing page...";
    const res = await sendToBackground<{ title: string; url: string; length: number }>(
      MSG_CAPTURE_PAGE
    );
    if (!res.ok) {
      status.textContent = res.error ?? "Capture failed.";
      return;
    }
    const updated = await getDraft();
    if (updated) textarea.value = updated.capturedText;
    status.textContent = `Captured ${res.data?.length ?? 0} characters from "${res.data?.title ?? "page"}".`;
  });

  container.querySelector("#clear-draft")?.addEventListener("click", async () => {
    await clearDraft();
    textarea.value = "";
    status.textContent = "";
  });

  container.querySelector("#analyze")?.addEventListener("click", async () => {
    const text = textarea.value.trim();
    if (!text) {
      status.textContent = "Paste or capture some instructions first.";
      return;
    }
    await saveDraft({ capturedText: text, title: null, sourceUrl: null });
    status.textContent = "Analyzing with Claude...";
    const res = await sendToBackground<{ assignmentId: string }>(MSG_ANALYZE);
    if (!res.ok) {
      status.textContent = res.error ?? "Analysis failed.";
      return;
    }
    await clearCaptureBadge();
    ctx.navigate("summary");
  });
}
