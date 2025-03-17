import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  // Add /dashboard to public routes temporarily during development
  publicRoutes: ["/", "/login", "/sign-up", "/temp-login", "/dashboard"],
  async beforeAuth(req) {
    // Execute any code before authentication runs
    return;
  },
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}; 