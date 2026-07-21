import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlaybookCardDTO } from "@/features/playbooks/application/dto";
import { createSessionAction } from "@/actions/session/commands";
import { CreateSessionFormValues, createSessionSchema } from "@/lib/validation";
import { useUser } from "@/components/providers";
import { useUserPlaybooks } from "@/features/playbooks/presentation/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { sessionKeys } from "@/features/sessions/domain";
import { playbookKeys } from "@/lib/queries/keys";

function getCurrentLocalDateTime() {
  const now = new Date();
  const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return localNow.toISOString().slice(0, 16);
}

type CreateSessionProps = {
  playbook: PlaybookCardDTO | null;
  onSuccess: () => void;
};
export function useCreateSessionForm({
  playbook,
  onSuccess,
}: CreateSessionProps) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { data: userPlaybooks = [] } = useUserPlaybooks(user.id);
  const playbooks = playbook
    ? [playbook, ...userPlaybooks.filter(({ id }) => id !== playbook.id)]
    : userPlaybooks;
  const form = useForm<CreateSessionFormValues>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: {
      playbookId: playbook?.id,
      topic: playbook?.topic || "",
      courseName: playbook?.courseName || "",
      description: "",
      subject: playbook?.subject || "",
      mode: "in-person",
      scheduledStart: getCurrentLocalDateTime(),
      title: playbook?.title || "",
    },
  });

  const selectPlaybook = (playbookId: string | null) => {
    const selectedPlaybook = playbooks.find(({ id }) => id === playbookId);
    if (!selectedPlaybook) {
      form.setValue("playbookId", "", { shouldDirty: true });
      form.setValue("title", "", { shouldDirty: true });
      form.setValue("subject", "", {
        shouldDirty: true,
      });
      form.setValue("topic", "", { shouldDirty: true });
      form.setValue("courseName", "", {
        shouldDirty: true,
      });
      return;
    }

    form.setValue("playbookId", selectedPlaybook.id, { shouldDirty: true });
    form.setValue("title", selectedPlaybook.title, { shouldDirty: true });
    form.setValue("subject", selectedPlaybook.subject ?? "", {
      shouldDirty: true,
    });
    form.setValue("topic", selectedPlaybook.topic, { shouldDirty: true });
    form.setValue("courseName", selectedPlaybook.courseName ?? "", {
      shouldDirty: true,
    });
  };

  const { mutate: createSession, isPending } = useMutation({
    mutationFn: async (data: CreateSessionFormValues) => {
      const result = await createSessionAction({
        instructorId: user.id,
        playbookId: data.playbookId,
        courseName: data.courseName,
        topic: data.topic,
        title: data.title,
        subject: data.subject,
        scheduledStart: data.scheduledStart,
        mode: data.mode,
      });
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: sessionKeys.all }),
        queryClient.invalidateQueries({ queryKey: playbookKeys.all }),
      ]);
      onSuccess();
    },
    throwOnError: true,
  });

  return {
    form,
    createSession,
    playbooks,
    selectPlaybook,
    isLoading: isPending,
  };
}
