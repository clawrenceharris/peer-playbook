export type UpdateSessionCommand = {
  title?: string;
  topic?: string | null;
  courseName?: string | null;
  scheduledStart?: string | null;
  mode?: "in-person" | "virtual" | "hybrid" | null;
};
