"use server";

import { ActionResult, toActionError } from "@/shared/action";
import {
  makeGetProfileByIdUseCase,
  makeGetProfileCardByIdUseCase,
  makeGetProfileDetailByEmailUseCase,
  makeGetProfileDetailByIdUseCase,
} from "@/composition/profile";
import { fail, ok } from "@/shared/application";
import {
  ProfileDetailDTO,
  ProfileCardDTO,
  ProfileSummaryDTO,
} from "@/features/profile/application/dto";

export async function getProfile(
  userId: string,
): Promise<ActionResult<ProfileSummaryDTO | null>> {
  const result = await makeGetProfileByIdUseCase().execute(userId);
  if (!result.success) return fail(toActionError(result.error));

  return ok(result.data);
}

export async function getProfileDetail(
  userId: string,
): Promise<ActionResult<ProfileDetailDTO | null>> {
  const result = await makeGetProfileDetailByIdUseCase().execute(userId);
  if (!result.success) return fail(toActionError(result.error));
  return ok(result.data);
}

export async function getProfileCard(
  userId: string,
): Promise<ActionResult<ProfileCardDTO | null>> {
  const result = await makeGetProfileCardByIdUseCase().execute(userId);
  if (!result.success) return fail(toActionError(result.error));

  return ok(result.data);
}

export async function getProfileDetailByEmail(
  username: string,
): Promise<ActionResult<ProfileDetailDTO | null>> {
  const result =
    await makeGetProfileDetailByEmailUseCase().execute(username);
  if (!result.success) return fail(toActionError(result.error));
  return ok(result.data);
}
