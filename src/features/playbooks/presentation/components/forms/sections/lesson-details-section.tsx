"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui";
import { ComboboxField, InputField } from "@/components/form";
import { subjects } from "@/features/playbooks/application/assemblers";

export function LessonDetailsSection() {
  return (
    <FieldSet>
      <FieldLegend>Lesson Details</FieldLegend>

      <FieldGroup className="grid grid-cols-1 items-start gap-x-5 gap-y-7 md:grid-cols-2 md:flex-row">
        <InputField
          name="title"
          label="Title"
          autoComplete="create-playbook-lesson-title"
          showsRequired={false}
          placeholder="e.g. 'Week 1: The Cell Cycle'"
          required
        />
        <InputField
          name="topic"
          label="Topic"
          autoComplete="create-playbook-lesson-topic"
          showsRequired={false}
          placeholder="e.g. 'Cell Division and Mitosis'"
          required
        />

        <ComboboxField
          name="subject"
          label="Subject"
          placeholder="e.g. 'Biology'"
          items={subjects.map((subject) => ({
            value: subject.id,
            label: subject.label,
            icon: subject.icon,
          }))}
          autoComplete="create-playbook-subject-name"
          showsOptional
          required={false}
          emptyMessage="No subjects found."
        />

        <InputField
          name="courseName"
          label="Course"
          placeholder="e.g. 'Bio 101'"
          autoComplete="create-playbook-course-name"
          required={false}
        />
      </FieldGroup>
    </FieldSet>
  );
}
