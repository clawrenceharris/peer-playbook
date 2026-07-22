import {
  ProfileDetailDTO,
  ProfileCardDTO,
  ProfileDTO,
} from "../../application/dto";

export interface ProfileReadRepository {
  findProfileById(userId: string): Promise<ProfileDTO | null>;
  findProfileCardById(id: string): Promise<ProfileCardDTO | null>;
  findProfileDetailById(id: string): Promise<ProfileDetailDTO | null>;
  findProfileDetailByEmail(email: string): Promise<ProfileDetailDTO | null>;
}
