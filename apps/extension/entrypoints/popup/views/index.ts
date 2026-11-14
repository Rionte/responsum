import type { ViewRenderer } from "../types";
import { renderCaptureView } from "./capture";
import { renderSummaryView } from "./summary";
import { renderPlanView } from "./plan";

export const views: Record<string, ViewRenderer> = {
  capture: renderCaptureView,
  summary: renderSummaryView,
  plan: renderPlanView
};
