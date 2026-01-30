"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { TextareaField } from "@/components/form";
import { GeneratePlaybookFormValues } from "@/features/playbooks/domain";
import {
  ContextsSection,
  LessonDetailsSection,
  ModesSection,
  NotesSection,
} from "./sections";

/**
 * Fields-only component used inside an outer <Form>.
 * Avoids nested forms and keeps form wiring (resolver/defaults/submit) at the page level.
 */
export function GeneratePlaybookForm() {
  useFormContext<GeneratePlaybookFormValues>();
  return (
    <>
      <LessonDetailsSection<GeneratePlaybookFormValues> />
      <TextareaField<GeneratePlaybookFormValues>
        name="instructions"
        placeholder="Add instructions or more details here: Describe the lesson topic, expected group size, or specific requirements."
        label="Instructions"
        isOptional
      />
      <ContextsSection<GeneratePlaybookFormValues> />
      <ModesSection<GeneratePlaybookFormValues> />
    </>
  );
}
