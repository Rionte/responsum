import { getCurrentAssignment } from "../../../lib/storage";
import { esc } from "../../../lib/dom";

export async function renderPlanView(container: HTMLElement): Promise<void> {
  const assignment = await getCurrentAssignment();
  if (!assignment?.plan?.length) {
    container.innerHTML = `<p class="empty">The current assignment has no plan yet.</p>`;
    return;
  }
  container.innerHTML = `
    <h1>${esc(assignment.title)} plan</h1>
    <ol class="plan">${assignment.plan
      .map(
        (step) => `
          <li class="${step.done ? "done" : ""}">
            <label>
              <input type="checkbox" ${step.done ? "checked" : ""} disabled />
              <span class="step-title">${esc(step.title)}</span>
              <span class="eta">~${step.estimatedMinutes} min</span>
            </label>
            <p class="step-desc">${esc(step.description)}</p>
          </li>`
      )
      .join("")}</ol>`;
}
