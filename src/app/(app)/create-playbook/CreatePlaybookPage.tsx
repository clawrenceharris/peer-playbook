"use client";
import React, { useMemo, useState } from "react";
import {
  useGeneratePlaybook,
  usePlaybookContexts,
} from "@/features/playbooks/hooks";
import { useRouter } from "next/navigation";
import { AIGeneratingState } from "@/components/states";
import { CardAction, CardFooter, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import { GeneratePlaybookForm, UpdatePlaybookForm } from "@/features/playbooks/components";
import { Form } from "@/components/form";
import { GeneratePlaybookFormValues, generatePlaybookSchema } from "@/features/playbooks/domain";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Pencil } from "lucide-react";
import Image from "next/image";
import { assets } from "@/lib/constants";
export default function CreatePlaybookPage() {
  const { mutateAsync: generatePlaybook, isPending: isGenerating } =
    useGeneratePlaybook();
  const router = useRouter();
  const [mode, setMode] = useState<"ai-generate" | "user-create" | null>(null);

  if (!mode) {
    
  }
  return (
    <Tabs defaultValue="generate" className="gradient-background h-full flex flex-col overflow-hidden flex-1 w-full">
      <header className="header justify-start">
        <Button variant="outline" size="icon" onClick={router.back}>
          <ChevronLeft className="size-6" />
        </Button>
        <h1>Create a new playbook</h1>
          
      </header>
      <div className="container max-w-5xl flex-row gap-4">
        <TabsList  className="rounded-2xl bg-card shadow-md h-auto flex-col px-3 gap-4">
            <TabsTrigger className="data-[state=active]:bg-primary-400/15 w-full data-[state=active]:border-primary-400/20 border-2 border-border not:[data-[state=active]]:order-border data-[state=active]:text-primary-400 rounded-xl max-h-20" value="upload">
            <Image src={assets.paperClip}  alt="Book" width={25} height={25} />

              Upload a document</TabsTrigger>

            <TabsTrigger className="data-[state=active]:bg-primary-400/15  w-full data-[state=active]:border-primary-400/20 border-2 border-border data-[state=active]:text-primary-400 rounded-xl max-h-20" value="generate">
            <Image src={assets.sparkle}  alt="Sparkles" width={30} height={30} />

              Generate with AI</TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-primary-400/15  w-full data-[state=active]:border-primary-400/20 border-2  border-border data-[state=active]:text-primary-400 rounded-xl max-h-20" value="create">
            <Image src={assets.pencil}  alt="Pencil" width={25} height={25} />
              Start from scratch</TabsTrigger>
      </TabsList>
        <TabsContent value={"create"} className="w-full">
            <UpdatePlaybookForm/>
      </TabsContent>
      <TabsContent value={"generate"} className="w-full ">
        <Card className=" h-full w-full overflow-y-auto">
          {isGenerating ? (
            <AIGeneratingState />
          ) : (
            <>
              <CardHeader className="border-b py-4 bg-white">
                <CardTitle className="text-center">
                  <h1>Generate a Playbook</h1>
                </CardTitle>
                <CardDescription className="text-muted-foreground text-center">
                  Describe your lesson below to build a Playbook composed of SI
                  strategies.
                </CardDescription>
              </CardHeader>
              <CardContent >
              <Form<GeneratePlaybookFormValues>
                  
                  id="form-generate-playbook"
                  resolver={zodResolver(generatePlaybookSchema)}
                  isLoading={isGenerating}
                  onSubmit={generatePlaybook}
                  onSuccess={(_, res) => router.push(res.playbookId)}
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
