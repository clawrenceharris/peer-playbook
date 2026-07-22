"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Progress, ScrollArea } from "@/components/ui";
import { PeerPlaybookGuide } from "./peer-playbook-guide";
import { OnboardingSlideShell } from "./onboarding-slide-shell";
import { OnboardingFieldRenderer } from "./onboarding-field-renderer";
import { useCompleteOnboarding, useOnboardingFlow } from "../hooks";
import type { OnboardingFormValues } from "@/lib/validation";
import { Form } from "@/components/form";
import { getUserErrorMessage } from "@/shared/utils";

type OnboardingFlowProps = {
  userId: string;
};

export function OnboardingFlow({ userId }: OnboardingFlowProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const { form, slides, totalSteps, validateCurrentStep } = useOnboardingFlow();
  const slide = slides[currentStep];
  const isLastStep = currentStep === totalSteps - 1;
  const progressValue = ((currentStep + 1) / totalSteps) * 100;

  const { completeOnboarding, isLoading } = useCompleteOnboarding({
    userId,
    onSuccess: () => {
      router.push("/home");
      router.refresh();
    },
    onError: (message) => {
      form.setError("root", { message });
    },
  });

  const goBack = () => {
    form.clearErrors();
    setCurrentStep((step) => Math.max(0, step - 1));
  };

  const goNext = async (skipped = false) => {
    try {
      form.clearErrors("root");

      if (!skipped) {
        const isValid = await validateCurrentStep(currentStep);
        if (!isValid) return;
      } else {
        const fieldKeys = slide.fields?.map((field) => field.fieldKey) ?? [];
        for (const key of fieldKeys) {
          form.clearErrors(key as keyof OnboardingFormValues);
        }
      }

      if (isLastStep) {
        return await completeOnboarding(form.getValues());
      }
      setCurrentStep((step) => step + 1);
    } catch (error) {
      form.setError("root", { message: getUserErrorMessage(error) });
    }
  };

  return (
    <>
      <Progress value={progressValue} className="h-2" />

      <div className="flex h-full w-full flex-1 grid-cols-1 gap-6 px-3 md:grid md:grid-cols-2">
        <Form
          enableBeforeUnloadProtection={false}
          isLoading={isLoading}
          submitText={isLastStep ? "Finish" : "Next"}
          showsCancelButton
          cancelText="Back"
          disabled={false}
          form={form}
          onCancel={goBack}
          onSubmitClick={() => goNext(false)}
        >
          <div className="flex h-full w-full flex-col gap-6">
            <OnboardingSlideShell slide={slide} onSkip={() => goNext(true)} />
            <div className="faded-col max-h-60 flex-1">
              <ScrollArea className="h-full min-h-0">
                <div className="flex h-full min-h-0 flex-col px-3 py-5">
                  <OnboardingFieldRenderer fields={slide.fields ?? []} />
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="lg:hidden">
            <PeerPlaybookGuide message={slide.message ?? ""} />
          </div>
        </Form>
        <div className="hidden lg:block">
          <PeerPlaybookGuide message={slide.message ?? ""} />
        </div>
      </div>
    </>
  );
}
