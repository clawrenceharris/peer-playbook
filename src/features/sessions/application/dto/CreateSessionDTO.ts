import { CreateSessionFormValues } from "@/lib/validation";

export type CreateSessionInput = {
  instructorId: string;
} & CreateSessionFormValues;

export type CreateSessionResult = {
  id: string;
};
