/* eslint-disable react-hooks/exhaustive-deps */
import { Form, FormLayoutProps } from "@/components/form";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  Input,
} from "@/components/ui";
import { BreakoutRoom, useSessionCall } from "@/components/providers";
import { generateRooms } from "@/utils";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

interface BreakoutCreatorProps extends FormLayoutProps<{ maxSize: number }> {
  onClose: () => void;
  participants: { sessionId: string; userId: string; name: string }[];
}
export function BreakoutCreator({
  participants,
  onClose,
  ...props
}: BreakoutCreatorProps) {
  const { isCreatingRooms, createBreakoutRooms } = useSessionCall();
  const [rooms, setRooms] = useState<BreakoutRoom[]>([]);
  const form = useForm<{ maxSize: number }>();
  const {
    control,
    formState: { defaultValues },
  } = form;
  const handleMaxSizeChange = useCallback(
    (maxSize: number) => {
      const generated = generateRooms(participants, maxSize);
      setRooms(generated);
    },
    [participants],
  );

  useEffect(() => {
    if (!defaultValues?.maxSize) return;
    handleMaxSizeChange(defaultValues.maxSize);
  }, []);
  function handleSubmit() {
    createBreakoutRooms(rooms);
    onClose();
  }
  return (
    <Form<{ maxSize: number }>
      {...props}
      form={form}
      enableBeforeUnloadProtection={false}
      isLoading={isCreatingRooms}
      onCancel={onClose}
      handleSubmit={handleSubmit}
    >
      <div className="bg-muted/30 space-y-4 overflow-hidden rounded-xl border p-4">
        <Controller
          rules={{
            required: true,
          }}
          control={control}
          name="maxSize"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel className="sr-only" htmlFor="maxSize">
                Number of Rooms
              </FieldLabel>
              <FieldContent>
                <Input
                  id="maxSize"

                  type="number"
                  placeholder="Number of Breakout Rooms"
                  aria-invalid={fieldState.invalid}
                  {...field}
                />
                <div className="min-h-[15px]">
                  <FieldError errors={[fieldState.error]} />
                </div>
              </FieldContent>
            </Field>
          )}
        />

        <div className="h-full max-h-50 overflow-y-auto">
          {rooms.length > 0 && (
            <div className="mt-4 space-y-2">
              {rooms.map((r, i) => (
                <div
                  key={r.id}
                  className="flex flex-wrap gap-2 rounded-md border bg-white/40 p-3"
                >
                  <strong className="mb-1 w-full">
                    Room {i + 1} ({r.members.length})
                  </strong>

                  {r.members.map((m) => (
                    <span
                      key={m.sessionId}
                      className="bg-primary/10 rounded-md px-2 py-1 text-xs"
                    >
                      {m.name}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Form>
  );
}
