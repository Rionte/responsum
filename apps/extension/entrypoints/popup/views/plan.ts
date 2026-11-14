import type { PopupContext } from "../types";
import { MSG_GENERATE_PLAN, sendToBackground } from "../../../lib/messaging";
import { getCurrentAssignment, saveAssignment } from "../../../lib/storage";
import { renderPlanChecklist } from "../../../components/PlanChecklist";
import { renderProgressBar } from "../../../components/ProgressBar";
import { esc } from "../../../lib/dom";

export async function renderPlanView(container: HTMLElement, ctx: PopupContext): Promise<void> {
  const assignment = await getCurrentAssignment();
  if (!assignment?.summary) {
    container.innerHTML = `<p class="empty">Analyze instructions first, then come back to plan.</p>`;
    return;
  }

  if (!assignment.plan?.length) {
    container.innerHTML = `
      <h1>${esc(assignment.title)}</h1>
      <p class="empty">No plan yet. Let Claude break the assignment into steps.</p>
      <div class="row"><button id="generate" class="primary">Generate plan</button></div>
      <p id="plan-status" class="status"></p>`;
    const button = container.querySelector("#generate") as HTMLButtonElement;
    const status = container.querySelector("#plan-status") as HTMLElement;
    button.addEventListener("click", async () => {
      button.disabled = true;
      button.textContent = "Planning...";
      const res = await sendToBackground<{ assignmentId: string }>(MSG_GENERATE_PLAN);
      if (!res.ok) {
        button.disabled = false;
        button.textContent = "Generate plan";
        status.textContent = res.error ?? "Planning failed.";
        return;
      }
      ctx.refresh();
    });
    return;
  }

  const steps = assignment.plan;
  const done = steps.filter((step) => step.done).length;
  container.innerHTML = `
    <h1>${esc(assignment.title)}</h1>
    ${renderProgressBar(done, steps.length)}
    ${renderPlanChecklist(steps)}`;

  container.addEventListener("change", async (event) => {
    const target = event.target as HTMLInputElement;
    if (target.type !== "checkbox" || !target.dataset.step) return;
    const id = Number(target.dataset.step);
    const next = steps.map((step) => (step.id === id ? { ...step, done: target.checked } : step));
    await saveAssignment({ ...assignment, plan: next });
    ctx.refresh();
  });
}
