import type { PopupContext } from "../types";
import {
  deleteAssignment,
  getCurrentAssignment,
  listAssignments,
  setCurrentAssignment
} from "../../../lib/storage";
import { renderLibraryList } from "../../../components/LibraryList";

export async function renderLibraryView(
  container: HTMLElement,
  ctx: PopupContext
): Promise<void> {
  const assignments = await listAssignments();
  const current = await getCurrentAssignment();
  container.innerHTML = `
    <h1>Library</h1>
    ${renderLibraryList(assignments, current?.id)}
    <div class="row"><button id="export-plan" class="ghost">Copy current plan as Markdown</button></div>
    <p id="library-status" class="status" aria-live="polite"></p>`;
  const status = container.querySelector("#library-status") as HTMLElement;

  container.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
    const id = target.dataset?.id;
    if (!id) return;
    if (target.matches(".open")) {
      await setCurrentAssignment(id);
      ctx.navigate("summary");
    } else if (target.matches(".delete")) {
      await deleteAssignment(id);
      ctx.refresh();
    }
  });

  container.querySelector("#export-plan")?.addEventListener("click", async () => {
    if (!current?.plan?.length) {
      status.textContent = "The current assignment has no plan yet.";
      return;
    }
    const lines = current.plan.map(
      (step) =>
        `- [${step.done ? "x" : " "}] ${step.title} (~${step.estimatedMinutes} min): ${step.description}`
    );
    await navigator.clipboard.writeText(`# ${current.title}\n\n${lines.join("\n")}\n`);
    status.textContent = "Plan copied to clipboard.";
  });
}
