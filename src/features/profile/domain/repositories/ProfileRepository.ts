import { CreateProfileCommand, UpdateProfileCommand } from "../types";
import { UpdateProfileResult } from "../../application/dto";

export interface ProfileRepository {
  createProfile(data: CreateProfileCommand): Promise<UpdateProfileResult>;
  updateProfile(
    id: string,
    data: UpdateProfileCommand,
  ): Promise<UpdateProfileResult>;
  deleteProfile(id: string): Promise<void>;
  existsById(userId: string): Promise<boolean>;
}
