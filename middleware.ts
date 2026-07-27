import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Localize public pages only — skip /admin, /api, Next internals and files
  matcher: ["/((?!admin|api|_next|_vercel|.*\\..*).*)"],
};
