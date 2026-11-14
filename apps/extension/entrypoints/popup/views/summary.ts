import { getCurrentAssignment } from "../../../lib/storage";
import { esc } from "../../../lib/dom";
import type { PopupContext } from "../types";

export async function renderSummaryView(
  container: HTMLElement,
  ctx: PopupContext
): Promise<void> {
  const assignment = await getCurrentAssignment();
  if (!assignment) {
    container.innerHTML = `<p class="empty">Nothing captured yet.</p>`;
    return;
  }
  container.innerHTML = `
    <h1>${esc(assignment.title)}</h1>
    <p class="hint">${esc(assignment.sourceUrl)}</p>
    <div class="card"><p class="answer">${esc(assignment.capturedText)}</p></div>
    <div class="row"><button id="view-plan" class="primary">View plan</button></div>`;
  container.querySelector("#view-plan")?.addEventListener("click", () => {
    ctx.navigate("plan");
  });
}
