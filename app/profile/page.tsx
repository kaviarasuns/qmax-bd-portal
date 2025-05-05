"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProfilePage() {
  const { signOut, signIn } = useAuthActions();
  const currentUser = useQuery(api.myFunctions.getCurrentUserWithRoles);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    if (!currentUser?.user?.email) {
      setError("Unable to verify current user. Please try signing in again.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      // First verify current password
      const verifyFormData = new FormData();
      verifyFormData.set("email", currentUser.user.email);
      verifyFormData.set("password", currentPassword);
      verifyFormData.set("flow", "signIn");

      try {
        // Store current auth state
        const currentAuthState = await signIn("password", verifyFormData);
        if (!currentAuthState) {
          throw new Error("Failed to verify current password");
        }

        // Sign out
        await signOut();

        // Update password
        const updateFormData = new FormData();
        updateFormData.set("email", currentUser.user.email);
        updateFormData.set("password", newPassword);
        updateFormData.set("flow", "signIn");

        await signIn("password", updateFormData);

        setSuccess(true);
        e.currentTarget.reset();

        // Redirect after successful password change
        setTimeout(() => {
          router.push("/signin");
        }, 2000);
      } catch (verifyError) {
        console.error("Verification error:", verifyError);
        setError("Current password is incorrect");
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error("Update error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update password. Please try again.",
      );

      // Ensure user is signed out if update fails
      try {
        await signOut();
      } catch (signOutError) {
        console.error(
          "Error signing out after failed password update:",
          signOutError,
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="text-2xl font-bold mb-8">Profile Settings</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">Change Password</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="currentPassword"
            >
              Current Password
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="newPassword"
            >
              New Password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              minLength={8}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="confirmPassword"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border-2 border-red-500/50 rounded-md p-3">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border-2 border-green-500/50 rounded-md p-3">
              <p className="text-green-600 dark:text-green-400 text-sm">
                Password changed successfully. Redirecting to sign in...
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || success}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Password...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
