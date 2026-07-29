import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Server Actions, Route Handlers, and Server Components should use this.
 * Auth/session state still comes from Supabase even when the underlying data
 * read or write path has been migrated to Prisma.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  return createClient(cookieStore);
}

/**
 * Builds a request-scoped Supabase SSR client. In Server Components the
 * `setAll` callback can no-op, which is acceptable because middleware is
 * responsible for refreshing cookies on navigation requests.
 */
export const createClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
  return createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
};