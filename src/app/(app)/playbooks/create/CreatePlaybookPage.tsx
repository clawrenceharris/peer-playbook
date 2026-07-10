"use client";
import React, { useEffect, useState } from "react";
import {
  useCreatePlaybook,
  useGeneratePlaybook,
} from "@/features/playbooks/presentation/hooks";
import { useRouter } from "next/navigation";
import { AIGeneratingState, LoadingState } from "@/components/states";
import {
  ScrollArea,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";

import { Button, FieldDescription, FieldTitle } from "@/components/ui";

import { Form, TextareaField } from "@/components/form";
import {
  CreatePlaybookFormValues,
  GeneratePlaybookFormValues,
  createPlaybookSchema,
  generatePlaybookSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import { assets } from "@/lib/constants";
import { useForm } from "react-hook-form";
import { GetPlaybookCreationPageOutput } from "@/features/playbooks/application/dto";
import {
  ContextsSection,
  LessonDetailsSection,
  ManualStrategyBuilderSection,
  ModesSection,
} from "@/features/playbooks/presentation/components/forms/sections";
import { InstructionalModelDTO } from "@/features/reference-data/instructional-models/application/dto/InstructionalModelDTO";
import { ContentLayout } from "@/components/sidebar";
import { cn } from "@/lib/utils";

type CreatePlaybookPageProps = {
  page: GetPlaybookCreationPageOutput;
};

type ScratchStep = "basics" | "structure" | "strategies";

const scratchSteps: {
  id: ScratchStep;
  label: string;
  description: string;
}[] = [
  {
    id: "basics",
    label: "Basics",
    description: "Lesson details and session context",
  },
  {
    id: "structure",
    label: "Playbook Structure",
    description: "Choose a template and shape phases",
  },
  {
    id: "strategies",
    label: "Strategies",
    description: "Add teaching moves by phase",
  },
];

function mapLegacyPhase(intentKey: string): "warmup" | "workout" | "closer" {
  if (intentKey === "activate") return "warmup";
  if (intentKey === "reflect") return "closer";
  return "workout";
}

function buildTemplatePhases(
  model: InstructionalModelDTO | undefined,
): CreatePlaybookFormValues["phases"] {
  if (!model || model.phases.length === 0) {
    return [];
  }

  return model.phases.map((phase, position) => ({
    title: phase.label,
    intentKey: phase.intentKey,
    templatePhaseKey: phase.key,
    legacyPhase: mapLegacyPhase(phase.intentKey),
    position,
    strategies: [],
  }));
}

export default function CreatePlaybookPage({ page }: CreatePlaybookPageProps) {
  const { subjects = [], contexts = [], instructionalModels = [] } = page;
  const defaultInstructionalModel = instructionalModels[0];
  const { mutateAsync: generatePlaybook, isPending: isGenerating } =
    useGeneratePlaybook();
  const { mutateAsync: createPlaybook, isPending: isCreating } =
    useCreatePlaybook();
  const [scratchStep, setScratchStep] = useState<ScratchStep>("basics");
  const createPlaybookForm = useForm<CreatePlaybookFormValues>({
    resolver: zodResolver(createPlaybookSchema),
    defaultValues: {
      subject: "",
      courseName: "",
      topic: "",
      contexts: [],
      modes: [],
      instructionalModelId: defaultInstructionalModel?.id,
      phases: buildTemplatePhases(defaultInstructionalModel),
      warmup: [],
      workout: [],
      closer: [],
    },
  });
  const { watch } = createPlaybookForm;
  const generatePlaybookForm = useForm<GeneratePlaybookFormValues>({
    resolver: zodResolver(generatePlaybookSchema),
    defaultValues: {
      subject: "",
      courseName: "",
      topic: "",
      instructions: "",
      contexts: [],
      modes: [],
    },
  });
  const router = useRouter();
  const scratchStepIndex = scratchSteps.findIndex(
    (step) => step.id === scratchStep,
  );
  const isFirstScratchStep = scratchStepIndex === 0;
  const isLastScratchStep = scratchStepIndex === scratchSteps.length - 1;

  async function goToNextScratchStep() {
    if (scratchStep === "basics") {
      const isValid = await createPlaybookForm.trigger(["subject", "topic"]);
      if (!isValid) return;
    }
    if (scratchStep === "structure") {
      const isValid = await createPlaybookForm.trigger("phases");
      if (!isValid) return;
    }

    setScratchStep(scratchSteps[scratchStepIndex + 1]?.id ?? scratchStep);
  }

  function goToPreviousScratchStep() {
    setScratchStep(scratchSteps[scratchStepIndex - 1]?.id ?? scratchStep);
  }

  async function handleNextScratchStep(values: CreatePlaybookFormValues) {
    if (!isLastScratchStep) {
      goToNextScratchStep();
      return;
    }
    const phases = (values.phases ?? []).map((phase, position) => ({
      ...phase,
      position,
      title: phase.title.trim(),
      strategies: phase.strategies ?? [],
    }));
    const playbook = await createPlaybook({
      ...values,
      phases,
      warmup: [],
      workout: [],
      closer: [],
    });
    router.push(`/playbooks/${playbook.id}`);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = watch((_, { name }) => {
      if (name && createPlaybookForm.formState.errors[name]) {
        createPlaybookForm.clearErrors(name);
      }
    });
    return () => subscription.unsubscribe();
  }, [createPlaybookForm, watch]);
  return (
    <ContentLayout title="Create Playbook" showUserNav={false} canGoBack={true}>
      <Tabs defaultValue="generate" className="h-full w-full flex-1">
        <div className="relative flex min-h-full flex-col gap-4 lg:flex-row">
          <TabsList
            asChild
            className="bg-card sticky top-4 h-full w-full flex-row justify-baseline gap-4 rounded-2xl border px-3 py-2 lg:w-auto lg:flex-col"
          >
            <div className="flex h-full flex-row lg:flex-col">
              <TabsTrigger
                className="data-[state=active]:bg-primary-400/15 data-[state=active]:border-primary-400/20 border-border not:[data-[state=active]]:order-border data-[state=active]:text-primary-400 hover:bg-muted w-full flex-1 rounded-md border-0 lg:min-h-20"
                value="upload"
              >
                <Image
                  src={assets.paperClip}
                  alt="Book"
                  width={25}
                  height={25}
                />
                Upload a document
              </TabsTrigger>

              <TabsTrigger
                className="data-[state=active]:bg-primary-400/15 data-[state=active]:border-primary-400/20 border-border not:[data-[state=active]]:order-border data-[state=active]:text-primary-400 hover:bg-muted w-full flex-1 rounded-md border-0 lg:min-h-20"
                value="generate"
              >
                <Image
                  src={assets.sparkle}
                  alt="Sparkles"
                  width={30}
                  height={30}
                />
                Generate with AI
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-primary-400/15 data-[state=active]:border-primary-400/20 border-border not:[data-[state=active]]:order-border data-[state=active]:text-primary-400 hover:bg-muted w-full flex-1 rounded-md border-0 lg:min-h-20"
                value="build"
              >
                <Image
                  src={assets.puzzle}
                  alt="Puzzle"
                  width={25}
                  height={25}
                />
                Playbook Builder
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-primary-400/15 data-[state=active]:border-primary-400/20 border-border not:[data-[state=active]]:order-border data-[state=active]:text-primary-400 hover:bg-muted w-full flex-1 rounded-md border-0 lg:min-h-20"
                value="scratch"
              >
                <Image
                  src={assets.pencil}
                  alt="Pencil"
                  width={25}
                  height={25}
                />
                Start from scratch
              </TabsTrigger>
            </div>
          </TabsList>
          <TabsContent
            value={"build"}
            className="bg-surface flex h-full min-h-0 w-full flex-1 rounded-2xl border"
          >
            <ScrollArea className="h-full w-full flex-1">
              <Form<CreatePlaybookFormValues>
                id="form-build-playbook"
                form={createPlaybookForm}
                isLoading={isCreating}
                title="Create a Playbook from scratch"
                className="p-5"
                titleClassName="text-lg"
                description="Already have a lesson in mind? Build it from the ground up and customize it to your needs."
                onSubmitClick={() =>
                  handleNextScratchStep(createPlaybookForm.getValues())
                }
                submitButtonClassName="max-w-47 ml-auto"
                submitText={isLastScratchStep ? "Create Playbook" : "Continue"}
                showsCancelButton={!isFirstScratchStep}
                onCancel={goToPreviousScratchStep}
                cancelText="Back"
              >
                <nav
                  aria-label="Create playbook progress"
                  className="bg-muted grid gap-3 overflow-hidden rounded-lg md:grid-cols-3"
                >
                  {scratchSteps.map((step) => {
                    const isActive = step.id === scratchStep;
                    return (
                      <button
                        key={step.id}
                        type="button"
                        aria-current={isActive ? "step" : undefined}
                        className={`rounded-md p-3 text-left ${
                          isActive
                            ? "bg-primary/30 text-primary"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => setScratchStep(step.id)}
                      >
                        <span className="flex items-center gap-2 text-sm font-semibold">
                          {step.label}
                        </span>
                      </button>
                    );
                  })}
                </nav>

                <section
                  aria-labelledby={`scratch-step-${scratchStep}`}
                  className="grid gap-5"
                >
                  <div>
                    <FieldTitle
                      id={`scratch-step-${scratchStep}`}
                      className="font-heading text-xl font-bold"
                    >
                      {scratchSteps[scratchStepIndex]?.label}
                    </FieldTitle>
                    <FieldDescription>
                      {scratchSteps[scratchStepIndex]?.description}
                    </FieldDescription>
                  </div>

                  {scratchStep === "basics" && (
                    <>
                      <LessonDetailsSection subjects={subjects} />
                      <ModesSection />
                    </>
                  )}

                  {scratchStep === "structure" && (
                    <ManualStrategyBuilderSection
                      instructionalModels={instructionalModels}
                      mode="structure"
                    />
                  )}

                  {scratchStep === "strategies" && (
                    <ManualStrategyBuilderSection
                      instructionalModels={instructionalModels}
                      mode="strategies"
                    />
                  )}
                </section>
              </Form>
            </ScrollArea>
          </TabsContent>
          <TabsContent
            value={"generate"}
            className="bg-surface flex h-full min-h-0 w-full flex-1 rounded-2xl border"
          >
            {isGenerating ? (
              <div className="centered">
                <AIGeneratingState />
              </div>
            ) : (
              <ScrollArea className="h-full w-full">
                <Form<GeneratePlaybookFormValues>
                  form={generatePlaybookForm}
                  title="Generate a Playbook with AI"
                  description="Describe your lesson below to build a Playbook composed of SI strategies."
                  id="form-generate-playbook"
                  isLoading={isGenerating}
                  className="p-5"
                  titleClassName="text-lg"
                  handleSubmit={generatePlaybook}
                  submitText="Generate Playbook"
                  submitButtonClassName="bg-gradient-to-r from-primary-400 max-w-47 ml-auto to-secondary-500 hover:from-primary-400/90 hover:to-secondary-500/90 text-white border-0 shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-200 p-6"
                  showsCancelButton={false}
                >
                  <LessonDetailsSection subjects={subjects} />
                  <TextareaField
                    name="instructions"
                    placeholder="Add instructions or more details here: Describe the lesson topic, expected group size, or specific requirements."
                    label="Instructions"
                    required={false}
                  />
                  <ContextsSection contexts={contexts} />
                  <ModesSection />
                </Form>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent
            value={"scratch"}
            className="bg-surface flex h-full min-h-0 w-full flex-1 rounded-2xl border"
          >
            <ScrollArea className="h-full w-full">
              <Form<CreatePlaybookFormValues>
                form={createPlaybookForm}
                title="Create a Playbook from scratch"
                description="Skip the set up and jump right into the playbook editor."
                id="form-create-playbook-from-scratch"
                isLoading={isCreating}
                className="p-5"
                titleClassName="text-lg"
                submitButtonClassName="max-w-47 ml-auto"
                handleSubmit={handleNextScratchStep}
                submitText="Create Playbook"
                showsCancelButton={false}
              >
                <LessonDetailsSection subjects={subjects} />
              </Form>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </ContentLayout>
  );
}
