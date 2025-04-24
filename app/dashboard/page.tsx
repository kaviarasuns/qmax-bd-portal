"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/app-layout";
import { ExecutiveDashboardContent } from "@/components/executive-dashboard";
import { ManagerDashboardContent } from "@/components/manager-dashboard";
import { useConvexAuth, useQuery } from "convex/react";
import { ManagerDashboardSkeleton } from "@/components/DashboardSkeleton";
import { api } from "@/convex/_generated/api";

export default function Dashboard() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [contentLoading, setContentLoading] = useState(true);

  // Fetch user role from Convex
  const role = useQuery(api.myFunctions.getUserRole);

  useEffect(() => {
    // Only fetch data when authentication is confirmed
    if (!isLoading) {
      if (isAuthenticated) {
        // Role is now fetched using the Convex query
        if (role !== undefined) {
          console.log("User role:", role);
          setUserRole(role);
          setContentLoading(false);
        }
      }
      // else {
      //   // Redirect to login if not authenticated
      //   router.push("/signin");
      // }
    }
  }, [isLoading, isAuthenticated, router, role]);

  // Show loading state while checking authentication
  if (isLoading || (isAuthenticated && contentLoading)) {
    return <ManagerDashboardSkeleton />;
  }

  return (
    <AppLayout>
      {isAuthenticated && userRole === "executive" ? (
        <ExecutiveDashboardContent />
      ) : userRole === "manager" ? (
        <ManagerDashboardContent />
      ) : null}
    </AppLayout>
  );
}
