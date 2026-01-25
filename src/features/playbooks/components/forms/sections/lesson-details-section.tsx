"use client";

import React from "react";
import { FieldLegend, FieldSet } from "@/components/ui";
import { ComboboxField, InputField } from "@/components/form";
import { subjects } from "@/lib/constants";
import type { FieldValues } from "react-hook-form";

export interface LessonDetailsSectionProps {
  courseIsOptional?: boolean;
  topicIsOptional?: boolean;
}

export function LessonDetailsSection<T extends FieldValues>({
  courseIsOptional,
  topicIsOptional,
}: LessonDetailsSectionProps) {
  return (
    <FieldSet className="flex flex-col md:flex-row items-start gap-2 md:gap-4">
      <FieldLegend className="sr-only">Lesson Details</FieldLegend>

      <ComboboxField<T>
        name={"subject" as any}
        label="Subject"
        placeholder="Subject"
        items={Object.keys(subjects).map((s) => ({
          label: s,
          value: s,
          icon: subjects[s],
        }))}
      />

      <InputField<T>
        name={"courseName" as any}
        label="Course"
        placeholder="Course"
        isOptional={courseIsOptional}
      />

      <InputField<T>
        name={"topic" as any}
        label="Topic"
        placeholder="Topic"
        isOptional={topicIsOptional}
      />
    </FieldSet>
  );
}

