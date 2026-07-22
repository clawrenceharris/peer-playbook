"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { StreamClient } from "@stream-io/node-sdk";
import { UserRequest } from "@stream-io/video-react-sdk";

/**
 * Upserts the users Playfield profile, including their name and profile image
 */
export async function updateUserProfile({
  user,
  name,
  image,
}: {
  user: UserRequest;
  name: string;
  image: string;
}) {
  const stream = await createStreamClient();
  const supabase = await createServerSupabaseClient();
  const {
    data: { user: authedUser },
  } = await supabase.auth.getUser();

  await stream.upsertUsers([
    {
      id: user.id,
      name: name || user.name,
      role: authedUser?.id ? "admin" : "user",
      image: image || user.image,
    },
  ]);
}

/**
 * Upserts the user's custom data for the give user id
 * @param userId The id belonging to the user to update
 * @param custom The custom data to be upserted
 */
export async function updateUserCustomData({
  userId,
  custom,
}: {
  userId: string;
  custom: object;
}) {
  const stream = await createStreamClient();

  await stream.upsertUsers([
    {
      id: userId,
      custom,
    },
  ]);
}
/**
 * Generates a Stream token for the current request. Unauthenticated callers
 * fall back to a random UUID so the video client can still initialize in flows
 * that have not fully enforced session requirements yet.
 */
export async function getToken() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60;
  const issuedAt = Math.floor(Date.now() / 1000) - 60;
  const stream = await createStreamClient();
  const token = stream.generateUserToken({
    user_id: user?.id || crypto.randomUUID(),
    exp: expirationTime,
    iat: issuedAt,
  });
  return token;
}

export async function createStreamClient() {
  const streamApiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;
  const streamApiSecret = process.env.STREAM_VIDEO_API_SECRET;

  const stream = new StreamClient(streamApiKey!, streamApiSecret!);
  return stream;
}
