import type { Assignment } from "@responsum/shared";
import { esc } from "../lib/dom";

export function renderLibraryList(assignments: Assignment[], currentId?: string): string {
  if (!assignments.length) return `<p class="empty">Nothing captured yet.</p>`;
  return `<ul class="library">${assignments
    .map((assignment) => {
      const total = assignment.plan?.length ?? 0;
      const done = assignment.plan?.filter((step) => step.done).length ?? 0;
      const progress = total ? `${done}/${total} steps` : "no plan";
      const due = assignment.summary?.dueDate
        ? `due ${esc(assignment.summary.dueDate)}`
        : "no due date";
      return `<li class="${assignment.id === currentId ? "current" : ""}">
        <button class="open" data-id="${esc(assignment.id)}">${esc(assignment.title)}</button>
        <span class="meta">${due} - ${progress}</span>
        <button class="delete" data-id="${esc(assignment.id)}" title="Delete">x</button>
      </li>`;
    })
    .join("")}</ul>`;
}