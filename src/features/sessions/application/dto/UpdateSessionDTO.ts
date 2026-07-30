import { UpdateSessionFormValues } from "@/lib/validation";

export type UpdateSessionInput = {
  sessionId: string;
} & UpdateSessionFormValues;

export type UpdateSessionResult = {
  instructorId: string;
  sessionId: string;
};
