"use client";

import React from "react";
import { TextareaField } from "@/components/form";
import {
  ContextsSection,
  LessonDetailsSection,
  ModesSection,
} from "./sections";

/**
 * Fields-only component used inside an outer <Form>.
 * Avoids nested forms and keeps form wiring (resolver/defaults/submit) at the page level.
 */
export function GeneratePlaybookForm() {
  return (
    <>
      <LessonDetailsSection />
      <TextareaField
        name="instructions"
        placeholder="Add instructions or more details here: Describe the lesson topic, expected group size, or specific requirements."
        label="Instructions"
        isOptional
      />
      <ContextsSection />
      <ModesSection />
    </>
  );
}
