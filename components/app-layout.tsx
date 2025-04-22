"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Loader2, Users } from "lucide-react";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import Image from "next/image";
import { Button } from "./ui/button";

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
      <header className="sticky top-0 z-10 border-b bg-background w-full">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div>
            <Image
              src="https://d1yetprhniwywz.cloudfront.net/QMAXSYSTEMS-new-logo.svg"
              alt="QMAX Systems Logo"
              width={220}
              height={200}
              priority
            />
            <nav className="hidden md:flex items-center gap-6 text-sm">
            </nav>
          </div>
          <div>
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
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
      await router.push("/signin");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {isAuthenticated && (
        <Button
          variant="outline"
          onClick={handleSignOut}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing out
            </>
          ) : (
            "Sign out"
          )}
        </Button>
      )}
    </>
  );
}
