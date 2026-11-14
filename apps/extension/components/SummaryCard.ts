import type { AssignmentSummary } from "@responsum/shared";
import { esc } from "../lib/dom";

export function renderSummaryCard(summary: AssignmentSummary): string {
  const course = summary.course ? esc(summary.course) : "Unknown course";
  const due = summary.dueDate ? esc(summary.dueDate) : "not stated";
  return `
    <section class="card summary-card">
      <h2>${course}</h2>
      <p class="due">Due: ${due}</p>
      ${section("Deliverables", summary.deliverables)}
      ${section("Requirements", summary.requirements)}
      ${section("Grading criteria", summary.gradingCriteria)}
      ${section("Constraints", summary.constraints)}
      ${section("Key points", summary.keyPoints)}
    </section>`;
}

function section(title: string, items: string[]): string {
  if (!items.length) return "";
  return `<h3>${esc(title)}</h3><ul>${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
}
