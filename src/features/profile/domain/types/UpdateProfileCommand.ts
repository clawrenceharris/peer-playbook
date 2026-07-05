export type UpdateProfileCommand = {
  school?: string | null;
  firstName?: string;
  lastName?: string | null;
  avatarUrl?: string | null;
  role?: "si_leader" | "student" | "coordinator";
  courses?: string[];
  dataConsentAcceptedAt?: Date | null;
  onboardingCompletedAt?: Date | null;
};
