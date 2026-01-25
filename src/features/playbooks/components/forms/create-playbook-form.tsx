import { ComboboxField, Form, InputField } from '@/components/form'
import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui'
import React from 'react'
import { CreatePlaybookFormValues } from '../../domain'
import { subjects } from '@/lib/constants'

export function CreatePlaybookForm() {
  return (
      <Form>
        <FieldGroup>
              
          <FieldSet className="flex flex-col md:flex-row items-start gap-2 md:gap-4">
        <FieldLegend className="sr-only">Lesson Details</FieldLegend>
        <ComboboxField<CreatePlaybookFormValues>
          name="subject"
          label="Subject"
          placeholder="Subject"
          defaultValue=""
          items={Object.keys(subjects).map((s) => ({
            label: s,
            value: s,
            icon: subjects[s],
          }))}
        />

        <InputField<CreatePlaybookFormValues>
          name="courseName"
          label={"Course"}
          defaultValue=""
          placeholder="Course"
        />

        <InputField<CreatePlaybookFormValues>
          name="topic"
          label={"Topic"}
          placeholder="Topic"
          defaultValue=""
        />
      </FieldSet>

              
              {/* Other fields like warmup activity, workout, closer, modes, contexts, etc */}
          </FieldGroup>
   </Form>
  )
}
