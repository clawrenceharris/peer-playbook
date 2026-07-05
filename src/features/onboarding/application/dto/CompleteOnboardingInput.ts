export type CompleteOnboardingInput = {
  userId: string;
  school: string | null;
  courses: string[];
  role: "si_leader" | "student" | "coordinator";
  dataConsentAccepted: boolean;
};

export type CompleteOnboardingResult = {
  userId: string;
  onboardingCompletedAt: Date;
};
