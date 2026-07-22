import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  CreatePlaybookFromScratchFormValues,
  createPlaybookFromScratchSchema,
} from "@/lib/validation";
import { useMutation } from "@tanstack/react-query";
import { createPlaybookAction } from "@/actions/playbook";
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
  const { mutateAsync: createPlaybook, isPending: isLoading } = useMutation({
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
    throwOnError: true,
    onSuccess: (playbook) => {
      router.push(`/playbooks/${playbook.id}`);
    },
  });

  return { form, createPlaybook, isLoading };
}
