import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  BuildPlaybookFormValues,
  CreatePlaybookFromScratchFormValues,
  createPlaybookFromScratchSchema,
  playbookDetailsSchema,
} from "@/lib/validation";
import { buildPlaybookSchema } from "@/lib/validation";
import { useMutation } from "@tanstack/react-query";
import { createPlaybookAction } from "@/actions/playbook";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
type UseCreatePlaybookFormProps = {
  userId: string;
};

export function useCreatePlaybookForm({ userId }: UseCreatePlaybookFormProps) {
  const router = useRouter();
  const form = useForm<CreatePlaybookFromScratchFormValues>({
    resolver: zodResolver(createPlaybookFromScratchSchema),
    defaultValues: {
      title: "",
      subject: "",
      courseName: "",
      topic: "",
    },
  });
  const createPlaybookMutation = useMutation({
    mutationFn: async (data: CreatePlaybookFromScratchFormValues) => {
      const result = await createPlaybookAction({
        ...data,
        contexts: [],
        modes: [],
        instructionalModelId: "",
        phases: [],
        warmup: [],
        workout: [],
        closer: [],
        userId,
      });
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    onSuccess: (playbook) => {
      router.push(`/playbooks/${playbook.id}`);
    },
  });

  const createPlaybook = useCallback(
    async (data: CreatePlaybookFromScratchFormValues) => {
      return await createPlaybookMutation.mutateAsync(data);
    },
    [createPlaybookMutation],
  );
  return { form, createPlaybook, isLoading: createPlaybookMutation.isPending };
}
