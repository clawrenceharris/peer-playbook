/* Manual playbook creation (fields-only). Wiring (resolver/submit) lives at the page level. */
"use client";

import React from "react";
import { CreatePlaybookFormValues } from "../../domain";
import {
  ContextsSection,
  LessonDetailsSection,
  ManualStrategyBuilderSection,
  ModesSection,
} from "./sections";

export function CreatePlaybookForm() {
  return (
    <>
      <LessonDetailsSection<CreatePlaybookFormValues> />
      <ContextsSection<CreatePlaybookFormValues> />
      <ModesSection<CreatePlaybookFormValues> />
      <ManualStrategyBuilderSection />
    </>
  );
}
