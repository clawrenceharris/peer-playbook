export type ProfileDetailRecord = {
  id: string;
  first_name: string;
  last_name: string | null;
  avatar_url: string | null;
  courses: string[] | null;
  role: string | null;
  created_at: Date;
  onboarding_completed_at: Date | null;
  updated_at: Date | null;
};

export type ProfileCardRecord = Pick<
  ProfileDetailRecord,
  "id" | "first_name" | "last_name" | "avatar_url"
>;

export const profileDetailProjection = {} as ProfileDetailRecord;
export const profileCardProjection = {} as ProfileCardRecord;
