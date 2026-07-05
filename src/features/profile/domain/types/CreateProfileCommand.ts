export type CreateProfileCommand = {
  email: string;
  firstName: string;
  lastName: string | null;
  courses: string[];
  role: "si_leader" | "student" | "coordinator";
  avatarUrl: string | null;
  userId: string;
};
