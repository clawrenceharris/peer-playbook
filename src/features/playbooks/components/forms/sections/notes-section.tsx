"use client";

import React from "react";
import { TextareaField } from "@/components/form";
import type { FieldValues } from "react-hook-form";

export function NotesSection<T extends FieldValues>() {
  return (
    <TextareaField<T>
      name={"notes" as any}
      label="Notes"
      isOptional
      placeholder="Add any notes for this playbook (optional)."
    />
  );
}

