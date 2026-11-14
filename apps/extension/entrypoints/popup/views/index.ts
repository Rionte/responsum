import type { ViewRenderer } from "../types";
import { renderCaptureView } from "./capture";

export const views: Record<string, ViewRenderer> = {
  capture: renderCaptureView
};
