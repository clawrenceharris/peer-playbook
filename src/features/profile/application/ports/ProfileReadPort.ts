import { ProfileCardDTO, ProfileDetailDTO, ProfileSummaryDTO } from "../dto";

export interface ProfileReadPort {
  findProfileById(userId: string): Promise<ProfileSummaryDTO | null>;
  findProfileCardById(id: string): Promise<ProfileCardDTO | null>;
  findProfileDetailById(id: string): Promise<ProfileDetailDTO | null>;
  findProfileDetailByEmail(email: string): Promise<ProfileDetailDTO | null>;
}
