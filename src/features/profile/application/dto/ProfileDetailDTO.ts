export type ProfileDetailDTO = {
  id: string;
  firstName: string;
  lastName: string | null;
  initials: string;
  displayName: string;
  avatarUrl: string | null;
  courses: string[];
  onboardingCompletedAt: Date | null;
};
