import { ComboboxField, InputField } from "@/components/form";
import { FieldGroup } from "@/components/ui";
import { CreateSessionFormValues } from "@/lib/validation";
import { subjects } from "@/features/playbooks/application/assemblers";

export const SessionDetailsSection = () => {
  return (
    <FieldGroup className="grid grid-cols-1 items-start gap-x-5 gap-y-7 md:grid-cols-2">
      <InputField<CreateSessionFormValues, "title">
        name="title"
        label="Title"
        showsRequired={false}
        placeholder="e.g. Week 1: The Cell Cycle"
        required
      />
      <InputField<CreateSessionFormValues, "topic">
        name="topic"
        label="Topic"
        placeholder="e.g. Cell Division and Mitosis"
      />
      <ComboboxField<CreateSessionFormValues, "subject">
        name="subject"
        label="Subject"
        placeholder="e.g. Biology"
        items={subjects.map((subject) => ({
          value: subject.id,
          label: subject.label,
          icon: subject.icon,
        }))}
        emptyMessage="No subjects found."
        showsOptional
      />
      <InputField<CreateSessionFormValues, "courseName">
        name="courseName"
        label="Course"
        placeholder="e.g. Bio 101"
      />
    </FieldGroup>
  );
};
