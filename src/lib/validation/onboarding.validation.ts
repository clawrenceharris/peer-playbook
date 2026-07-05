import { z } from "zod";
import {
  ONBOARDING_SLIDES,
  roleToProfileRole,
} from "@/features/onboarding/config";

const roleOptionIds = Object.keys(roleToProfileRole) as [
  keyof typeof roleToProfileRole,
  ...(keyof typeof roleToProfileRole)[],
];

export const onboardingFormSchema = z.object({
  role: z.enum(roleOptionIds),
  courses: z.array(z.string()),
  school: z.string().optional(),
  dataConsentAccepted: z.boolean().refine((value) => value === true, {
    message: "You must accept to continue.",
  }),
});

export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;

export const onboardingDefaultValues: OnboardingFormValues = {
  role: "si_leader",
  courses: [],
  school: "",
  dataConsentAccepted: false,
};

export function getSlideFieldKeys(
  slideIndex: number,
): (keyof OnboardingFormValues)[] {
  const slide = ONBOARDING_SLIDES[slideIndex];
  if (!slide?.fields?.length) return [];
  return slide.fields.map(
    (field) => field.fieldKey as keyof OnboardingFormValues,
  );
}

export function buildStepSchema(slideIndex: number) {
  const slide = ONBOARDING_SLIDES[slideIndex];
  if (!slide?.fields?.length) {
    return z.object({});
  }

  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of slide.fields) {
    switch (field.type) {
      case "text":
        shape[field.fieldKey] = field.required
          ? z.string().min(1, `${field.label} is required`)
          : z.string().optional();
        break;
      case "single-choice":
        shape[field.fieldKey] = field.required
          ? z.string().min(1, `${field.label} is required`)
          : z.string().optional();
        break;
      case "multi-choice": {
        let schema = z.array(z.string());
        if (field.min && field.min > 0) {
          schema = schema.min(
            field.min,
            `Select at least ${field.min} option${field.min > 1 ? "s" : ""}`,
          );
        }
        if (field.max) {
          schema = schema.max(
            field.max,
            `Select at most ${field.max} option${field.max > 1 ? "s" : ""}`,
          );
        }
        shape[field.fieldKey] = field.required
          ? schema.min(1, `${field.label} is required`)
          : schema;
        break;
      }
      case "consent":
        shape[field.fieldKey] = field.required
          ? z.boolean().refine((value) => value === true, {
              message: "You must accept to continue.",
            })
          : z.boolean().optional();
        break;
    }
  }

  return z.object(shape);
}
