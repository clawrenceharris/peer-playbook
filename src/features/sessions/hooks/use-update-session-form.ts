import {
  UpdateSessionFormValues,
  updateSessionSchema,
} from "@/lib/validation/session.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SessionCardDTO } from "../application/dto";
import { useUpdateSession } from "./";

export const useUpdateSessionForm = ({
  session,
}: {
  session: SessionCardDTO;
}) => {
  const { mutate: updateSession, isPending } = useUpdateSession();
  const form = useForm<UpdateSessionFormValues>({
    resolver: zodResolver(updateSessionSchema),
    defaultValues: {
      title: session?.title ?? "",
      topic: session?.topic ?? "",
      courseName: session?.courseName || "",
      scheduledStart: session?.scheduledStart
        ? session.scheduledStart.slice(0, 16)
        : "",
      mode:
        (session?.mode as "in-person" | "virtual" | "hybrid" | undefined) ??
        "virtual",
    },
  });

  return { form, updateSession, isLoading: isPending };
};
