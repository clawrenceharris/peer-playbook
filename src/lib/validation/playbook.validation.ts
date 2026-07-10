import { z } from "zod";

// ============================================================
// Shared schema blocks (compose to avoid drift across forms)
// ============================================================

export const lessonDetailsSchema = z.object({
  subject: z.string().min(1, "Please select a subject"),
  courseName: z.string().optional(),
  topic: z.string().min(1, "Please enter a topic"),
});

export const contextsSchema = z.object({
  contexts: z.array(z.string()),
});

export const modesSchema = z.object({
  modes: z.array(z.enum(["in-person", "virtual", "hybrid"])).default([]),
});

export const instructionsSchema = z.object({
  instructions: z.string().optional().default(""),
});

// Strategy references used by manual playbook creation.
// `sourceType` indicates which table the strategy is sourced from.
// - system -> `strategies` (base/system strategies)
// - user   -> `user_strategies` (user-created strategies)
export const strategyRefSchema = z.object({
  sourceType: z.enum(["system", "user"]),
  sourceId: z.string().uuid(),
});

export const phaseIntentKeySchema = z.enum([
  "activate",
  "explore",
  "apply",
  "reflect",
]);

export const playbookPhaseInputSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Phase title is required"),
  intentKey: phaseIntentKeySchema,
  templatePhaseKey: z.string().min(1).optional(),
  legacyPhase: z.enum(["warmup", "workout", "closer"]),
  position: z.number().int().nonnegative(),
  strategies: z.array(strategyRefSchema).default([]),
});

export const manualStrategiesSchema = z.object({
  instructionalModelId: z.string().min(1).optional(),
  warmup: z.array(strategyRefSchema).default([]),
  workout: z.array(strategyRefSchema).default([]),
  closer: z.array(strategyRefSchema).default([]),
  phases: z.array(playbookPhaseInputSchema).default([]),
});

// ============================================================
// Form schemas (composed)
// ============================================================

export const generatePlaybookSchema = lessonDetailsSchema
  .merge(instructionsSchema)
  .merge(contextsSchema)
  .merge(modesSchema);

export const updatePlaybookSchema = z.object({
  // Subject remains required to avoid invalid playbooks.
  subject: z.string().min(1, "Subject is required"),
  courseName: z.string().optional(),
  topic: z.string().min(1, "Topic is required").optional(),
});

export const createPlaybookSchema = z.object({
  ...lessonDetailsSchema.shape,
  ...contextsSchema.shape,
  ...modesSchema.shape,
  ...manualStrategiesSchema.shape,
});

export const playbookStrategySchema = z.object({
  // Update is used for editing metadata; allow partial updates.
  // Subject remains required to avoid invalid playbooks (adjust if you prefer optional).
  steps: z.array(z.string()),
  title: z.string(),
  phase: z.enum(["warmup", "workout", "closer"]).optional(),
  resources: z
    .array(
      z.object({
        type: z.enum(["file", "text", "set", "url", "other"]).optional(),
        data: z.any(),
      }),
    )
    .optional(),
});

export const updatePlaybookStrategySchema = playbookStrategySchema.partial();

// For react-hook-form + zodResolver, prefer input types (defaults make inputs optional).
export type GeneratePlaybookFormValues = z.input<typeof generatePlaybookSchema>;
export type UpdatePlaybookFormValues = z.input<typeof updatePlaybookSchema>;
export type CreatePlaybookFormValues = z.input<typeof createPlaybookSchema>;
export type UpdatePlaybookStrategyFormValues = z.input<
  typeof updatePlaybookStrategySchema
>;
export type PlaybookStrategyFormValues = z.input<typeof playbookStrategySchema>;
export type StrategyRef = z.infer<typeof strategyRefSchema>;
export type PlaybookPhaseFormValues = z.input<typeof playbookPhaseInputSchema>;
export type PhaseIntentKey = z.infer<typeof phaseIntentKeySchema>;
