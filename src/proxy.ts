import { NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

/**
 * Delegates all matched requests to the Supabase session guard. Keeping the
 * matcher here makes it easier to see which route groups participate in the
 * authenticated app shell.
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}
export const config = {
  matcher: [
    "/",
    "/home",
    "/sign-up",
    "/login",
    "/playbooks/:path*",
    "/my-library/:path*",
    "/sessions/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
