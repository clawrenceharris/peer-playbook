export type ProfileCardDTO = {
  id: string;
  displayName: string;
  initials: string;
  avatarUrl: string | null;
};

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

export type ProfileDTO = {
  id: string;
  firstName: string;
  lastName: string | null;
  displayName: string;
  avatarUrl: string | null;
  onboardingCompletedAt: Date | null;
};
