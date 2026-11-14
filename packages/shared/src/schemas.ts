import { z } from "zod";
import type { Assignment, AssignmentSummary, PlanStep, ReviewFinding } from "./types";

// Annotating each schema with its hand-written interface keeps the two from drifting
export const assignmentSummarySchema: z.ZodType<AssignmentSummary> = z.object({
  course: z.string().nullable(),
  dueDate: z.string().nullable(),
  deliverables: z.array(z.string()),
  requirements: z.array(z.string()),
  gradingCriteria: z.array(z.string()),
  constraints: z.array(z.string()),
  keyPoints: z.array(z.string())
});

export const planStepSchema: z.ZodType<PlanStep> = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  estimatedMinutes: z.number().nonnegative(),
  dependsOn: z.array(z.number()),
  tips: z.array(z.string()),
  done: z.boolean()
});

// Planner output is an array of steps
export const planSchema: z.ZodType<PlanStep[]> = z.array(planStepSchema);

export const reviewFindingSchema: z.ZodType<ReviewFinding> = z.object({
  severity: z.enum(["BLOCKING", "SHOULD_FIX", "NIT"]),
  file: z.string(),
  line: z.number().nullable(),
  issue: z.string(),
  fix: z.string()
});

export const assignmentSchema: z.ZodType<Assignment> = z.object({
  id: z.string(),
  title: z.string(),
  sourceUrl: z.string(),
  capturedAt: z.string(),
  capturedText: z.string(),
  summary: assignmentSummarySchema.optional(),
  plan: z.array(planStepSchema).optional()
});
