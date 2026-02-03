"use client";

import { TextareaField } from "@/components/form";
import React from "react";

export function NotesSection() {
  return (
    <TextareaField
      name="notes"
      label="Notes"
      isOptional
      placeholder="Add any notes for this playbook (optional)."
    />
  );
}
