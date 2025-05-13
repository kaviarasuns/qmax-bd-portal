"use client";

import * as React from "react";

import { Building2, FilePlus2, Eye, CheckCircle2 } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const getNavMainByRole = (role?: string) => {
  const defaultNav = [
    {
      title: "Companies",
      url: "/dashboard?page=companies",
      icon: Building2,
      pattern: "/dashboard?page=companies",
    },
  ];

  switch (role) {
    case "executive":
      return [
        ...defaultNav,
        {
          title: "Enter Details",
          url: "/dashboard?page=enterDetails",
          icon: FilePlus2,
          pattern: "/dashboard?page=enterDetails",
        },
      ];
    case "manager":
      return [
        ...defaultNav,
        {
          title: "Approve Submissions",
          url: "/dashboard?page=approveSubmissions",
          icon: CheckCircle2,
          pattern: "/dashboard?page=approveSubmissions",
        },
        {
          title: "View Details",
          url: "/dashboard?page=viewDetails",
          icon: Eye,
          pattern: "/dashboard?page=viewDetails",
        },
      ];
    default:
      return defaultNav;
  }
};

const defaultUserData = {
  name: "Guest",
  email: "",
  avatar: "/q_logo.png",
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userWithRoles = useQuery(api.myFunctions.getCurrentUserWithRoles);
  console.log("userWithRoles", userWithRoles);

  const userRole = userWithRoles?.roles?.[0]?.role;
  const navItems = getNavMainByRole(userRole);
  // Create a user object from userWithRoles data
  const userData = userWithRoles?.user
    ? {
        name: userWithRoles.user.name || "Guest",
        email: userWithRoles.user.email || "",
        avatar: "/q_logo.png", // Fallback to default avatar
      }
    : defaultUserData;

  console.log("userWithRoles", userWithRoles?.user?.email);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Image
          src="https://d1yetprhniwywz.cloudfront.net/QMAXSYSTEMS-new-logo.svg"
          alt="QMAX Systems Logo"
          width={220}
          height={200}
          priority
        />
      </SidebarHeader>
      <SidebarContent className="mt-5">
        <NavMain items={navItems} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
