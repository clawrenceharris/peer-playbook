"use client";

import { useState } from "react";
import { Dialog, DialogContent, FieldGroup } from "@/components/ui";
import { Form, TextareaField } from "@/components/form";
import { AppError } from "@/types/errors";
import { submitBugReport } from "@/lib/bugs/bug-reporter";
import { CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/features/auth/hooks";

const bugReportSchema = z.object({
  description: z
    .string()
    .min(10, "Please provide at least 10 characters describing the issue")
    .max(1000, "Description must be less than 1000 characters"),
  stepsToReproduce: z
    .string()
    .min(10, "Please provide steps to reproduce (at least 10 characters)")
    .max(1000, "Steps must be less than 1000 characters"),
});

type BugReportFormInput = z.infer<typeof bugReportSchema>;

interface BugReportModalProps {
  error: AppError;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context?: string;
}

export function BugReportModal({
  error,
  open,
  onOpenChange,
  context,
}: BugReportModalProps) {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: BugReportFormInput) => {
    setIsSubmitting(true);
    try {
      const result = await submitBugReport(error, {
        userDescription: data.description,
        stepsToReproduce: data.stepsToReproduce,
        userId: user?.id,
      });

      if (result.success) {
        setSubmitted(true);
      } else {
        console.error("Failed to submit bug report:", result.error);
        // Could show an error toast here, but since this is a bug report,
        // we don't want to create another error cycle
      }
    } catch (err) {
      console.error("Error submitting bug report:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title="Report Bug"
        description="Help us fix this issue by providing details about what happened."
      >
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="mb-4 size-12 text-green-500" />
            <h3 className="mb-2 text-lg font-semibold">Thank you!</h3>
            <p className="text-muted-foreground text-sm">
              Your bug report has been submitted. We&apos;ll review it soon.
            </p>
          </div>
        ) : (
          <Form<BugReportFormInput>
            resolver={zodResolver(bugReportSchema)}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
            showsCancelButton={true}
            submitText="Submit"
            cancelText="Cancel"
            onCancel={() => onOpenChange(false)}
            defaultValues={{
              description: "",
              stepsToReproduce: "",
            }}
          >
            {() => (
                <FieldGroup>
                  <TextareaField<BugReportFormInput>  defaultValue="" label="What happened?" name="description" placeholder="Describe what you were trying to do when the error occurred..."/>
                  <TextareaField<BugReportFormInput> defaultValue="" label="Steps to Reproduce" name="stepsToReproduce" placeholder="1. Go to...&#10;2. Click on...&#10;3. See error..."/>

               
              </FieldGroup>
            )}
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
