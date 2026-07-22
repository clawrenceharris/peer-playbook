import { InputField, SelectField } from "@/components/form";
import { Button, FieldGroup, FieldLegend, FieldSet } from "@/components/ui";
import { CreateSessionFormValues } from "@/lib/validation";
import { PlaybookCardDTO } from "@/features/playbooks/application/dto";
import { SessionDetailsSection } from "./sections/SessionDetailsSection";
import { DatePicker } from "@/components/ui/date-picker";
import { RotateCcw } from "lucide-react";
import { useController, useFormContext } from "react-hook-form";

type CreateSessionFormProps = {
  playbooks?: PlaybookCardDTO[];
  onPlaybookSelect?: (playbookId: string | null) => void;
  showPlaybookSelector?: boolean;
};

export const CreateSessionForm = ({
  playbooks = [],
  onPlaybookSelect = () => undefined,
  showPlaybookSelector = false,
}: CreateSessionFormProps) => {
  const { control } = useFormContext<CreateSessionFormValues>();
  const { field } = useController({ control, name: "playbookId" });
  function handlePlaybookSelect(playbookId: string | null) {
    field.onChange(playbookId);
    onPlaybookSelect(playbookId);
  }
  return (
    <FieldGroup>
      <FieldSet>
        <FieldLegend>Session Details</FieldLegend>
        {showPlaybookSelector ? (
          <div className="flex items-end gap-2">
            <SelectField<CreateSessionFormValues, "playbookId">
              name="playbookId"
              label="Playbook"
              required={false}
              value={field.value as string}
              placeholder="No playbook selected"
              onValueSelect={handlePlaybookSelect}
              items={playbooks.map((playbook) => ({
                value: playbook.id,
                label: playbook.title,
                description: [playbook.subject, playbook.topic]
                  .filter(Boolean)
                  .join(" - "),
              }))}
            />
            <Button
              type="button"
              onClick={() => handlePlaybookSelect(null)}
              variant="outline"
              size="icon-sm"
              disabled={!field.value}
            >
              <RotateCcw />
            </Button>
          </div>
        ) : null}

        <SessionDetailsSection />
      </FieldSet>

      <FieldSet>
        <FieldLegend>Scheduling</FieldLegend>
        <div className="flex flex-col items-start gap-4 sm:flex-row">
          <InputField<CreateSessionFormValues, "scheduledStart">
            name="scheduledStart"
            type="datetime-local"
            label="Start date"
            required
            showsRequired={false}
            renderInput={({ field, fieldState }) => (
              <DatePicker
                invalid={fieldState.invalid}
                date={new Date(field.value)}
                setDate={(date) =>
                  field.onChange(
                    date ? new Date(date).toISOString() : undefined,
                  )
                }
              />
            )}
          />

          <SelectField<CreateSessionFormValues, "mode">
            name="mode"
            required={false}
            label="Delivery mode"
            items={[
              { value: "in-person", label: "In-Person" },
              { value: "virtual", label: "Virtual" },
              { value: "hybrid", label: "Hybrid" },
            ]}
          />
        </div>
      </FieldSet>
    </FieldGroup>
  );
};
