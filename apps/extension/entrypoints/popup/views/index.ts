import type { ViewRenderer } from "../types";
import { renderCaptureView } from "./capture";
import { renderSummaryView } from "./summary";

export const views: Record<string, ViewRenderer> = {
  capture: renderCaptureView,
  summary: renderSummaryView
};
