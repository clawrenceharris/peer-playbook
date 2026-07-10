import { InputField, RadioGroupField } from "@/components/form";
import { FieldGroup } from "@/components/ui";
import { CreateSessionFormValues } from "@/features/sessions/domain";
import { subjects } from "@/features/playbooks/application/assemblers/PlaybookCreationPageAssembler";

import { LessonDetailsSection } from "@/features/playbooks/presentation/components/forms/sections";

export const CreateSessionForm = () => {
  return (
    <FieldGroup>
      <LessonDetailsSection subjects={subjects} />
      <InputField<CreateSessionFormValues, "scheduledStart">
        name="scheduledStart"
        type="datetime-local"
        label="Start Date"
      />

      <RadioGroupField<CreateSessionFormValues, "mode">
        name="mode"
        required={false}
        label="Delivery Mode"
        options={[
          { value: "in-person", label: "In-Person" },
          { value: "virtual", label: "Virtual" },
          { value: "hybrid", label: "Hybrid" },
        ]}
      />
    </FieldGroup>
  );
};
