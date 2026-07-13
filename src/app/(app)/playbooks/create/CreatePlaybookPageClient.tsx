"use client";
import React, { useEffect, useState } from "react";
import {
  useCreatePlaybook,
  useGeneratePlaybook,
} from "@/features/playbooks/presentation/hooks";
import { useRouter } from "next/navigation";
import { AIGeneratingState } from "@/components/states";
import {
  Button,
  FieldContent,
  FieldLegend,
  FieldSet,
  ScrollArea,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";

import { FieldDescription } from "@/components/ui";

import { Form, TextareaField } from "@/components/form";
import {
  BuildPlaybookFormValues,
  GeneratePlaybookFormValues,
  buildPlaybookSchema,
  generatePlaybookSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useModals } from "@/hooks";
import { useUser } from "@/components/providers";
import { cn } from "@/lib/utils";

type CreatePlaybookPageProps = {
  page: GetPlaybookCreationPageOutput;
};

type BuildStep = "basics" | "structure" | "strategies";

const buildSteps: {
  id: BuildStep;
  label: string;
  description: string;
  title: string;
}[] = [
  {
    id: "basics",
    label: "Basics",
    title: "Define your lesson",
    description: "Lesson details and session context",
  },
  {
    id: "structure",
    label: "Playbook Structure",
    title: "Choose a structure",
    description: "Pick a template, then adjust the phases.",
  },
  {
    id: "strategies",
    label: "Strategies",
    title: "Add learning activities",
    description: "Add learning activities to each phase",
  },
];

function mapLegacyPhase(intentKey: string): "warmup" | "workout" | "closer" {
  if (intentKey === "activate") return "warmup";
  if (intentKey === "reflect") return "closer";
  return "workout";
}

function buildTemplatePhases(
  model: InstructionalModelDTO | undefined,
): BuildPlaybookFormValues["phases"] {
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

export default function CreatePlaybookPageClient({
  page,
}: CreatePlaybookPageProps) {
  const { contexts = [], instructionalModels = [] } = page;
  const defaultInstructionalModel = instructionalModels[0];
  const { mutateAsync: generatePlaybook, isPending: isGenerating } =
    useGeneratePlaybook();
  const { mutateAsync: createPlaybook, isPending: isCreating } =
    useCreatePlaybook();
  const { user } = useUser();
  const {
    modals: { "playbook:create": createPlaybookModal },
  } = useModals();
  const [buildStep, setBuildStep] = useState<BuildStep>("basics");
  const createPlaybookForm = useForm<BuildPlaybookFormValues>({
    resolver: zodResolver(buildPlaybookSchema),
    defaultValues: {
      subject: "",
      courseName: "",
      topic: "",
      title: "",
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
      title: "",
      instructions: "",
      contexts: [],
      modes: [],
    },
  });
  const router = useRouter();
  const buildStepIndex = buildSteps.findIndex((step) => step.id === buildStep);
  const isFirstBuildStep = buildStepIndex === 0;
  const isLastBuildStep = buildStepIndex === buildSteps.length - 1;

  async function goToNextBuildStep() {
    if (buildStep === "basics") {
      const isValid = await createPlaybookForm.trigger(["subject", "topic"]);
      if (!isValid) return;
    }
    if (buildStep === "structure") {
      const isValid = await createPlaybookForm.trigger("phases");
      if (!isValid) return;
    }

    setBuildStep(buildSteps[buildStepIndex + 1]?.id ?? buildStep);
  }

  function goToPreviousBuildStep() {
    setBuildStep(buildSteps[buildStepIndex - 1]?.id ?? buildStep);
  }

  async function handleNextBuildStep(values: BuildPlaybookFormValues) {
    if (!isLastBuildStep) {
      goToNextBuildStep();
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

  async function handleGeneratePlaybook(values: GeneratePlaybookFormValues) {
    const playbook = await generatePlaybook(values);
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

  function handleScratchClick() {
    createPlaybookModal.open({
      userId: user.id,
    });
  }
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
              <Button
                onClick={handleScratchClick}
                className="border-border hover:text-foreground hover:bg-muted w-full flex-1 rounded-md border-0 lg:min-h-20"
              >
                <Image
                  src={assets.pencil}
                  alt="Pencil"
                  width={25}
                  height={25}
                />
                Start from scratch
              </Button>
            </div>
          </TabsList>
          <TabsContent
            value="build"
            className="bg-surface flex h-full min-h-0 w-full flex-1 rounded-2xl border"
          >
            <ScrollArea className="h-full w-full flex-1">
              <Form<BuildPlaybookFormValues>
                id="form-build-playbook"
                form={createPlaybookForm}
                isLoading={isCreating}
                className="p-5"
                titleClassName="text-lg"
                onSubmitClick={() =>
                  handleNextBuildStep(createPlaybookForm.getValues())
                }
                submitButtonClassName="max-w-47 ml-auto"
                submitText={isLastBuildStep ? "Create Playbook" : "Continue"}
                showsCancelButton={!isFirstBuildStep}
                onCancel={goToPreviousBuildStep}
                cancelText="Back"
              >
                <div className="flex flex-col gap-2">
                  <h1 className="text-lg font-bold">Build your playbook</h1>
                  <p className="text-muted-foreground text-sm">
                    Already have a lesson in mind? Set the basics, choose a
                    structure, then add strategies.
                  </p>
                </div>
                <nav
                  aria-label="Create playbook progress"
                  className="relative rounded-lg"
                >
                  {/* vertical line */}
                  <div className="absolute top-[13px] left-0 h-px w-full bg-slate-200" />
                  <div className="grid w-full grid-cols-3 justify-items-center">
                    {buildSteps.map((step) => {
                      const isActive = step.id === buildStep;
                      return (
                        <div
                          key={step.id}
                          className="relative flex flex-col items-center"
                        >
                          {/* dot */}
                          <div
                            className={cn(
                              "bg-primary relative z-10 mt-1 size-[20px] shrink-0 rounded-full ring-[6px] ring-white",
                              buildSteps.indexOf(step) < buildStepIndex ||
                                isActive
                                ? "bg-primary-400"
                                : "bg-slate-200",
                            )}
                          />

                          {/* content */}
                          <div className="mt-3 min-w-0 flex-1">
                            <div className="mt-1 flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h3 className="truncate text-base font-bold text-[#171341]">
                                  {step.label}
                                </h3>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </nav>

                <FieldSet
                  aria-labelledby={`build-step-${buildStep}`}
                  className="grid gap-5"
                >
                  <FieldContent>
                    <FieldLegend
                      id={`build-step-${buildStep}`}
                      className="font-heading text-xl font-bold"
                    >
                      {buildSteps[buildStepIndex]?.title}
                    </FieldLegend>
                    <FieldDescription>
                      {buildSteps[buildStepIndex]?.description}
                    </FieldDescription>
                  </FieldContent>

                  {buildStep === "basics" && (
                    <>
                      <LessonDetailsSection />
                      <ModesSection />
                    </>
                  )}

                  {buildStep === "structure" && (
                    <ManualStrategyBuilderSection
                      instructionalModels={instructionalModels}
                      mode="structure"
                    />
                  )}

                  {buildStep === "strategies" && (
                    <ManualStrategyBuilderSection
                      instructionalModels={instructionalModels}
                      mode="strategies"
                    />
                  )}
                </FieldSet>
              </Form>
            </ScrollArea>
          </TabsContent>
          <TabsContent
            value="generate"
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
                  description="Describe your lesson below and let AI generate a playbook for you."
                  id="form-generate-playbook"
                  isLoading={isGenerating}
                  className="p-5"
                  titleClassName="text-lg"
                  handleSubmit={handleGeneratePlaybook}
                  submitText="Generate Playbook"
                  submitButtonClassName="bg-gradient-to-r from-primary-400 max-w-47 ml-auto to-secondary-500 hover:from-primary-400/90 hover:to-secondary-500/90 text-white border-0 shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-200 p-6"
                  showsCancelButton={false}
                >
                  <LessonDetailsSection />
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
        </div>
      </Tabs>
    </ContentLayout>
  );
}
