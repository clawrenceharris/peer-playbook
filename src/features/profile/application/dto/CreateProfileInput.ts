export type CreateProfileInput = {
  userId: string;
  firstName: string;
  lastName: string | null;
  courses: string[];
  avatarFile?: File | null;
  email: string;
  role: "si_leader" | "student" | "coordinator";
};
