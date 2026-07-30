import { UpdateProfileResult } from "../dto";
import { CreateProfileCommand, UpdateProfileCommand } from "../../domain/types";

export interface ProfileWritePort {
  createProfile(data: CreateProfileCommand): Promise<UpdateProfileResult>;
  updateProfile(
    id: string,
    data: UpdateProfileCommand,
  ): Promise<UpdateProfileResult>;
  deleteProfile(id: string): Promise<void>;
  existsById(userId: string): Promise<boolean>;
}
