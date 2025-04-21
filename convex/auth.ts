import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
  callbacks: {
    async redirect({ redirectTo }) {
      // If no specific redirectTo is provided, default to dashboard
      return redirectTo || "/dashboard";
    },
  },
});
