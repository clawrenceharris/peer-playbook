import { NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}
export const config = {
  matcher: [
    "/home",
    "/sign-up",
    "/login",
    "/playbooks/:path*",
    "/my-library/:path*",
    "/sessions/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
