import { getCurrentAssignment } from "../../../lib/storage";
import { renderSummaryCard } from "../../../components/SummaryCard";
import { esc } from "../../../lib/dom";

export async function renderSummaryView(container: HTMLElement): Promise<void> {
  const assignment = await getCurrentAssignment();
  if (!assignment?.summary) {
    container.innerHTML = `<p class="empty">No summary yet. Capture instructions and analyze them first.</p>`;
    return;
  }
  container.innerHTML = `
    <h1>${esc(assignment.title)}</h1>
    ${renderSummaryCard(assignment.summary)}`;
}
