import { TextareaField } from "@/components/form";
import { FieldGroup, Toggle, ToggleGroup } from "@/components/ui";
import { GeneratePlaybookFormValues } from "@/lib/validation";
import { useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
const prompts = [
  "Design a playbook focusing on",
  "By the end of the lesson, students will be able to",
  "Adjust lesson to this number of students:",
  "Adapt the playbook for a virtual learning environment.",
  "The playbook should help students feel confident in",
  "Make sure to touch on the these key concepts:",
];
export function AiInstructionsSection() {
  const { control, watch } = useFormContext<GeneratePlaybookFormValues>();
  const [availablePrompts, setAvailablePrompts] = useState<string[]>(
    prompts.slice(0, 2),
  );
  const { field } = useController({
    control,
    name: "instructions",
  });
  const instructions = watch("instructions");
  useEffect(() => {
    if (!instructions) {
      setAvailablePrompts(prompts.slice(0, 2));
    }
  }, [instructions]);
  function handleToggleChange(pressed: boolean, prompt: string) {
    if (pressed) {
      field.onChange(field.value ? field.value + " " + prompt : prompt);
    }
    setAvailablePrompts(
      prompts
        .filter((p) => !field.value?.includes(p) && p !== prompt)
        .slice(0, 2),
    );
  }
  return (
    <FieldGroup>
      <TextareaField
        name="instructions"
        placeholder="Add further instructions here: Describe the lesson topic, expected group size, or specific requirements."
        label="Instructions"
        required={false}
      />
      <ToggleGroup className="flex-wrap" spacing={2} type="multiple">
        {availablePrompts.map((prompt) => (
          <Toggle
            pressed={false}
            variant="outline"
            onPressedChange={(pressed) => handleToggleChange(pressed, prompt)}
            className="data-[state=on]:text-foreground data-[state=on]:bg-transparent"
            aria-label={`Insert this prompt: "${prompt}"`}
            key={prompt}
          >
            {prompt}
          </Toggle>
        ))}
      </ToggleGroup>
    </FieldGroup>
  );
}
