import { MSG_ANALYZE, type BackgroundHandler } from "../../lib/messaging";
import { summarizeDraft } from "./summarize";

// Background message registry: each feature branch registers its handlers here
export const handlers: Record<string, BackgroundHandler> = {
  [MSG_ANALYZE]: () => summarizeDraft()
};
