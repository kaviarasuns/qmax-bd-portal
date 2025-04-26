"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { ExecutiveDashboardContent } from "@/components/executive-dashboard";
import { ManagerDashboardContent } from "@/components/manager-dashboard";
import ProspectSubmissionForm from "@/components/prospect-submission-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const { isAuthenticated } = useConvexAuth();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");

  // Fetch user role from Convex
  const role = useQuery(api.myFunctions.getUserRole);

  useEffect(() => {
    if (role !== undefined) {
      setUserRole(role);
    }
  }, [role]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {isAuthenticated && page === "details" ? (
            <ProspectSubmissionForm />
          ) : isAuthenticated && userRole === "executive" ? (
            <ExecutiveDashboardContent />
          ) : userRole === "manager" ? (
            <ManagerDashboardContent />
          ) : null}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
