import { Router } from "express";
import { assignmentSchema } from "@responsum/shared";
import { loadStore, saveStore } from "./store";

export const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "responsum-sync" });
});

// Upsert by id; the extension pushes the full assignment after every change
router.post("/assignments", async (req, res) => {
  const parsed = assignmentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid assignment payload", details: parsed.error.issues });
    return;
  }
  const assignments = await loadStore();
  const next = [...assignments.filter((a) => a.id !== parsed.data.id), parsed.data];
  next.sort((a, b) => b.capturedAt.localeCompare(a.capturedAt));
  await saveStore(next);
  res.status(201).json({ ok: true, id: parsed.data.id });
});

// Metadata only, so the library UI stays light
router.get("/assignments", async (_req, res) => {
  const assignments = await loadStore();
  res.json(
    assignments.map((a) => ({
      id: a.id,
      title: a.title,
      sourceUrl: a.sourceUrl,
      capturedAt: a.capturedAt,
      dueDate: a.summary?.dueDate ?? null,
      planSteps: a.plan?.length ?? 0,
      planDone: a.plan?.filter((step) => step.done).length ?? 0
    }))
  );
});

// The MCP tools read the same file, but this endpoint helps debugging
router.get("/assignments/current", async (_req, res) => {
  const assignments = await loadStore();
  res.json(assignments[0] ?? null);
});

router.delete("/assignments/:id", async (req, res) => {
  const assignments = await loadStore();
  const next = assignments.filter((a) => a.id !== req.params.id);
  if (next.length === assignments.length) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  await saveStore(next);
  res.json({ ok: true });
});
