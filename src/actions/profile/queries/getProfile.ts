"use server";

import { ActionResult, toActionError } from "@/shared/action";
import { makeProfileReadService } from "@/composition/profile";
import { fail, ok } from "@/shared/application";
import {
  ProfileDetailDTO,
  ProfileCardDTO,
  ProfileDTO,
} from "@/features/profile/application/dto";

export async function getProfile(
  userId: string,
): Promise<ActionResult<ProfileDTO | null>> {
  const service = makeProfileReadService();
  const result = await service.getProfile(userId);
  if (!result.success) return fail(toActionError(result.error));

  return ok(result.data);
}

export async function getProfileDetail(
  userId: string,
): Promise<ActionResult<ProfileDetailDTO | null>> {
  const result = await makeProfileReadService().getProfileDetailById(userId);
  if (!result.success) return fail(toActionError(result.error));
  return ok(result.data);
}

export async function getProfileCard(
  userId: string,
): Promise<ActionResult<ProfileCardDTO | null>> {
  const service = makeProfileReadService();
  const result = await service.getProfileCard(userId);
  if (!result.success) return fail(toActionError(result.error));

  return ok(result.data);
}

export async function getProfileDetailByEmail(
  username: string,
): Promise<ActionResult<ProfileDetailDTO | null>> {
  const result =
    await makeProfileReadService().getProfileDetailByEmail(username);
  if (!result.success) return fail(toActionError(result.error));
  return ok(result.data);
}
