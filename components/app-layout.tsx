"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users } from "lucide-react";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Get the user role from localStorage
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-semibold">
              Company Management Portal
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link
                href="/dashboard"
                className={`transition-colors hover:text-foreground/80 ${
                  pathname === "/dashboard"
                    ? "text-foreground font-medium"
                    : "text-foreground/60"
                }`}
              >
                Dashboard
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {userRole && (
              <span className="text-sm text-muted-foreground mr-2">
                Logged in as{" "}
                <span className="font-medium capitalize">{userRole}</span>
              </span>
            )}
            <SignOutButton />
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-gray-50 md:block">
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-4 text-sm font-medium">
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-foreground ${
                    pathname === "/dashboard"
                      ? "bg-gray-100 text-foreground"
                      : "text-foreground/60"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                {userRole === "manager" && (
                  <>
                    <Link
                      href="/dashboard?tab=approved"
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-foreground ${
                        pathname === "/dashboard" &&
                        pathname.includes("approved")
                          ? "bg-gray-100 text-foreground"
                          : "text-foreground/60"
                      }`}
                    >
                      <Users className="h-4 w-4" />
                      Approved Companies
                    </Link>
                    <Link
                      href="/dashboard?tab=rejected"
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-foreground ${
                        pathname === "/dashboard" &&
                        pathname.includes("rejected")
                          ? "bg-gray-100 text-foreground"
                          : "text-foreground/60"
                      }`}
                    >
                      <Users className="h-4 w-4" />
                      Rejected Companies
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </div>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();
  return (
    <>
      {isAuthenticated && (
        <button
          className="bg-slate-200 dark:bg-slate-800 text-foreground rounded-md px-2 py-1"
          onClick={() =>
            void signOut().then(() => {
              router.push("/signin");
            })
          }
        >
          Sign out
        </button>
      )}
    </>
  );
}
