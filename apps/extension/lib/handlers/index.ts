import { MSG_ANALYZE, MSG_ASK, MSG_GENERATE_PLAN, type BackgroundHandler } from "../../lib/messaging";
import { summarizeDraft } from "./summarize";
import { generatePlan } from "./plan";
import { askQuestion } from "./ask";

// Background message registry: each feature branch registers its handlers here
export const handlers: Record<string, BackgroundHandler> = {
  [MSG_ANALYZE]: () => summarizeDraft(),
  [MSG_GENERATE_PLAN]: () => generatePlan(),
  [MSG_ASK]: (payload) => askQuestion(payload)
};
