"use client";

import React from "react";
import { FieldLegend, FieldSet } from "@/components/ui";
import { ComboboxField, InputField } from "@/components/form";
import { subjects } from "@/lib/constants";

export interface LessonDetailsSectionProps {
  courseIsOptional?: boolean;
  topicIsOptional?: boolean;
}

export function LessonDetailsSection({
  courseIsOptional,
  topicIsOptional,
}: LessonDetailsSectionProps) {
  return (
    <FieldSet className="flex flex-col md:flex-row items-start gap-2 md:gap-4">
      <FieldLegend className="sr-only">Lesson Details</FieldLegend>

      <ComboboxField
        name="subject"
        label="Subject"
        placeholder="Subject"
        items={Object.keys(subjects).map((s) => ({
          label: s,
          value: s,
          icon: subjects[s],
        }))}
      />

      <InputField
        name="courseName"
        label="Course"
        placeholder="Course"
        isOptional={courseIsOptional}
      />

      <InputField
        name="topic"
        label="Topic"
        placeholder="Topic"
        isOptional={topicIsOptional}
      />
    </FieldSet>
  );
}
