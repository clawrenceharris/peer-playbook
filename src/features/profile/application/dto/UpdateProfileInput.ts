export type UpdateProfileInput = {
  id: string;
  firstName?: string;
  lastName?: string;
  courses?: string[];
  avatarFile?: File | null;
};
