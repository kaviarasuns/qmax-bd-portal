"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/app-layout";
import { ExecutiveDashboardContent } from "@/components/executive-dashboard";
import { ManagerDashboardContent } from "@/components/manager-dashboard";
import { useConvexAuth } from "convex/react";
import { ManagerDashboardSkeleton } from "@/components/DashboardSkeleton";

export default function Dashboard() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [contentLoading, setContentLoading] = useState(true);

  useEffect(() => {
    // Only fetch data when authentication is confirmed
    if (!isLoading) {
      if (isAuthenticated) {
        // Fetch user data or other protected content
        setContentLoading(false);
        setUserRole("executive"); // Replace with actual role fetching logic
      }
      // else {
      //   // Redirect to login if not authenticated
      //   router.push("/signin");
      // }
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading state while checking authentication
  if (isLoading || (isAuthenticated && contentLoading)) {
    return <ManagerDashboardSkeleton />;
  }

  return (
    <AppLayout>
      {userRole === "executive" ? (
        <ExecutiveDashboardContent />
      ) : (
        <ManagerDashboardContent />
      )}
    </AppLayout>
  );
}
