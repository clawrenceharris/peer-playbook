"use client";

import React from "react";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui";
import { ComboboxField, InputField } from "@/components/form";

export interface LessonDetailsSectionProps {
  subjects: { id: string; label: string; icon: React.ReactNode }[];
}

export function LessonDetailsSection({ subjects }: LessonDetailsSectionProps) {
  return (
    <FieldSet>
      <FieldLegend>Lesson Details</FieldLegend>

      <FieldGroup className="flex flex-col items-start gap-2 md:flex-row">
        <ComboboxField
          name="subject"
          label="Subject"
          placeholder="Subject"
          items={subjects.map((subject) => ({
            value: subject.id,
            label: subject.label,
            icon: subject.icon,
          }))}
          required
          emptyMessage="No subjects found."
        />

        <InputField name="topic" label="Topic" placeholder="Topic" required />
        <InputField
          name="courseName"
          label="Course"
          placeholder="Course"
          required={false}
        />
      </FieldGroup>
    </FieldSet>
  );
}
