/* Manual playbook creation (fields-only). Wiring (resolver/submit) lives at the page level. */
"use client";

import React from "react";
import {
  ContextsSection,
  LessonDetailsSection,
  ManualStrategyBuilderSection,
  ModesSection,
} from "./sections";

export function CreatePlaybookForm() {
  return (
    <>
      <LessonDetailsSection />
      <ContextsSection />
      <ModesSection />
      <ManualStrategyBuilderSection />
    </>
  );
}
