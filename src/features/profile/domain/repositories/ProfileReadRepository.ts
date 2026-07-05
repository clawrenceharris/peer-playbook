import { ProfileDetailDTO, ProfileCardDTO } from "../../application/dto";

export interface ProfileReadRepository {
  findProfileCardById(id: string): Promise<ProfileCardDTO | null>;
  findProfileDetailById(id: string): Promise<ProfileDetailDTO | null>;
  findProfileDetailByEmail(email: string): Promise<ProfileDetailDTO | null>;
}
