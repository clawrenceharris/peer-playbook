import { ProfileCardDTO, ProfileDetailDTO, ProfileDTO } from "../dto";

export interface ProfileReadPort {
  findProfileById(userId: string): Promise<ProfileDTO | null>;
  findProfileCardById(id: string): Promise<ProfileCardDTO | null>;
  findProfileDetailById(id: string): Promise<ProfileDetailDTO | null>;
  findProfileDetailByEmail(email: string): Promise<ProfileDetailDTO | null>;
}
