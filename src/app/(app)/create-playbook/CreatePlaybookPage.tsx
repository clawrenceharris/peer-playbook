"use client";
import React from "react";
import {
  useCreatePlaybook,
  useGeneratePlaybook,
} from "@/features/playbooks/hooks";
import { useRouter } from "next/navigation";
import { AIGeneratingState } from "@/components/states";
import {
  CardAction,
  CardFooter,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import {
  CreatePlaybookForm,
  GeneratePlaybookForm,
} from "@/features/playbooks/components";
import { Form } from "@/components/form";
import {
  CreatePlaybookFormValues,
  GeneratePlaybookFormValues,
  createPlaybookSchema,
  generatePlaybookSchema,
} from "@/features/playbooks/domain";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { assets } from "@/lib/constants";
import { useModal } from "@/components/providers";
import { useForm } from "react-hook-form";
export default function CreatePlaybookPage() {
  const { mutateAsync: generatePlaybook, isPending: isGenerating } =
    useGeneratePlaybook();
  const { mutateAsync: createPlaybook, isPending: isCreating } =
    useCreatePlaybook();
  const form = useForm<CreatePlaybookFormValues>({
    resolver: zodResolver(createPlaybookSchema),
    defaultValues: {
      subject: "",
      courseName: "",
      topic: "",
    },
  });
  const router = useRouter();
  const { closeModal } = useModal();
  async function handleCreatePlaybook(res: any) {
    await createPlaybook(res);
    router.push(`/library/playbooks/${res.id}`);
  }
  return (
    <Tabs
      defaultValue="generate"
      className="gradient-background flex h-full w-full flex-1 flex-col overflow-hidden"
    >
      <header className="header justify-start">
        <Button variant="outline" size="icon" onClick={router.back}>
          <ChevronLeft className="size-6" />
        </Button>
        <h1>Create a new playbook</h1>
      </header>
      <div className="container max-w-5xl flex-row gap-4">
        <TabsList
          asChild
          className="bg-card h-full flex-col justify-baseline gap-4 rounded-2xl px-3 py-5 shadow-md"
        >
          <div className="flex h-full max-h-120 flex-col">
            <TabsTrigger
              className="data-[state=active]:bg-primary-400/15 data-[state=active]:border-primary-400/20 border-border not:[data-[state=active]]:order-border data-[state=active]:text-primary-400 max-h-20 w-full flex-1 rounded-xl border-2"
              value="upload"
            >
              <Image src={assets.paperClip} alt="Book" width={25} height={25} />
              Upload a document
            </TabsTrigger>

            <TabsTrigger
              className="data-[state=active]:bg-primary-400/15 data-[state=active]:border-primary-400/20 border-border data-[state=active]:text-primary-400 max-h-20 w-full flex-1 rounded-xl border-2"
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
              className="data-[state=active]:bg-primary-400/15 data-[state=active]:border-primary-400/20 border-border data-[state=active]:text-primary-400 max-h-20 w-full flex-1 rounded-xl border-2"
              value="create"
            >
              <Image src={assets.pencil} alt="Pencil" width={25} height={25} />
              Start from scratch
            </TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value={"create"} className="w-full">
          <Card className="h-full w-full overflow-y-auto">
            {isCreating ? (
              <AIGeneratingState />
            ) : (
              <>
                <CardHeader className="border-b bg-white py-4">
                  <CardTitle className="text-center">
                    <h1>Create a Playbook</h1>
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-center">
                    Start from scratch by adding strategies to each phase.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form<CreatePlaybookFormValues>
                    id="form-create-playbook"
                    form={form}
                    isLoading={isCreating}

                    handleSubmit={handleCreatePlaybook}
                    enableBeforeUnloadProtection={false}
                    submitText="Create Playbook"
                    showsCancelButton={false}
                    showsSubmitButton={false}
                  >
                    <CreatePlaybookForm />
                  </Form>
                </CardContent>
              </>
            )}
            {!isCreating && (
              <CardFooter>
                <CardAction>
                  <Button
                    variant="secondary"
                    form="form-create-playbook"
                    type="submit"
                  >
                    Create Playbook
                  </Button>
                </CardAction>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        <TabsContent value={"generate"} className="w-full">
          <Card className="h-full w-full overflow-y-auto">
            {isGenerating ? (
              <AIGeneratingState />
            ) : (
              <>
                <CardHeader className="border-b bg-white py-4">
                  <CardTitle className="text-center">
                    <h1>Generate a Playbook</h1>
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-center">
                    Describe your lesson below to build a Playbook composed of
                    SI strategies.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form<GeneratePlaybookFormValues>
                    form={form}
                    id="form-generate-playbook"
                    isLoading={isGenerating}
                    handleSubmit={generatePlaybook}
                    enableBeforeUnloadProtection={false}
                    submitText="Create Playbook"
                    submitButtonClassName="bg-gradient-to-r from-primary-400 to-secondary-500 hover:from-primary-400/90 hover:to-secondary-500/90 text-white border-0 shadow-md hover:-translate-y-2 hover:shadow-lg transition-all duration-200 p-6"
                    showsCancelButton={false}
                    showsSubmitButton={false}
                  >
                    <GeneratePlaybookForm />
                  </Form>
                </CardContent>
              </>
            )}
            {!isGenerating && (
              <CardFooter>
                <CardAction>
                  <Button
                    variant="secondary"
                    form="form-generate-playbook"
                    type="submit"
                  >
                    Generate Playbook!
                  </Button>
                </CardAction>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </div>
    </Tabs>
  );
}
