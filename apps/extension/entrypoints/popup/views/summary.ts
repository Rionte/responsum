import type { PopupContext } from "../types";
import { getCurrentAssignment } from "../../../lib/storage";
import { renderSummaryCard } from "../../../components/SummaryCard";
import { esc } from "../../../lib/dom";

export async function renderSummaryView(container: HTMLElement, ctx: PopupContext): Promise<void> {
  const assignment = await getCurrentAssignment();
  if (!assignment?.summary) {
    container.innerHTML = `<p class="empty">No summary yet. Capture instructions and analyze them first.</p>`;
    return;
  }
  container.innerHTML = `
    <h1>${esc(assignment.title)}</h1>
    ${renderSummaryCard(assignment.summary)}
    <div class="row"><button id="to-plan" class="primary">Go to plan</button></div>`;
  container.querySelector("#to-plan")?.addEventListener("click", () => ctx.navigate("plan"));
}
