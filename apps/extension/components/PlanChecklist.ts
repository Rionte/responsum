import type { PlanStep } from "@responsum/shared";
import { esc } from "../lib/dom";

export function renderPlanChecklist(steps: PlanStep[]): string {
  return `<ol class="plan">${steps
    .map((step) => {
      const depends = step.dependsOn.length ? `<p class="depends">After step ${step.dependsOn.join(", ")}</p>` : "";
      const tips = step.tips.length
        ? `<ul class="tips">${step.tips.map((tip) => `<li>${esc(tip)}</li>`).join("")}</ul>`
        : "";
      return `<li class="${step.done ? "done" : ""}">
        <label>
          <input type="checkbox" data-step="${step.id}" ${step.done ? "checked" : ""} />
          <span class="step-title">${esc(step.title)}</span>
          <span class="eta">~${step.estimatedMinutes} min</span>
        </label>
        <p class="step-desc">${esc(step.description)}</p>
        ${depends}${tips}
      </li>`;
    })
    .join("")}</ol>`;
}
