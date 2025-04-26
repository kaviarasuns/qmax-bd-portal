"use client";

import * as React from "react";
import { Bot, GalleryVerticalEnd, SquareTerminal } from "lucide-react";

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

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/q_logo.png",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      pattern: "/dashboard", // Exact match for dashboard
    },
    {
      title: "Detailed Info",
      url: "/dashboard?page=details",
      icon: Bot,
      pattern: "/dashboard?page=details", // Match dashboard with query param
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userWithRoles = useQuery(api.myFunctions.getCurrentUserWithRoles);

  // Create a user object from userWithRoles data
  const userData = userWithRoles?.user
    ? {
        name: userWithRoles.user.name || "Guest",
        email: userWithRoles.user.email || "",
        avatar: "/q_logo.png", // Fallback to default avatar
      }
    : data.user;

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
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
