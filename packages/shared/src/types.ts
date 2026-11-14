// Data models agreed at kickoff; changing this file requires an all-hands ping

export interface CaptureDraft {
  capturedText: string;
  title: string | null; // page title when captured from a tab, null when pasted
  sourceUrl: string | null;
}

export interface Assignment {
  id: string; // uuid v4
  title: string;
  sourceUrl: string;
  capturedAt: string; // ISO timestamp
  capturedText: string; // raw extracted instructions
  summary?: AssignmentSummary;
  plan?: PlanStep[];
}

export interface AssignmentSummary {
  course: string | null;
  dueDate: string | null; // ISO date or null when not stated
  deliverables: string[];
  requirements: string[];
  gradingCriteria: string[];
  constraints: string[];
  keyPoints: string[];
}

export interface PlanStep {
  id: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  dependsOn: number[]; // ids of steps that must come first
  tips: string[];
  done: boolean;
}

export interface ReviewFinding {
  severity: "BLOCKING" | "SHOULD_FIX" | "NIT";
  file: string;
  line: number | null;
  issue: string;
  fix: string; // the minimal concrete change
}
