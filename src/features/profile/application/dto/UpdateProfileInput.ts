import { UpdateProfileFormValues } from "@/lib/validation";

export type UpdateProfileInput = {
  id: string;
} & UpdateProfileFormValues;
