"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  pattern?: string; // Optional pattern for matching
  isActive?: boolean;
}

interface NavMainProps {
  items: NavItem[];
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState<string | null>(pathname);

  return (
    <nav className="grid gap-1 px-2">
      {items.map((item, index) => {
        const isActive = activeItem === item.pattern;
        const Icon = item.icon;

        return (
          <Link
            key={index}
            href={item.url}
            onClick={() => setActiveItem(item.pattern || null)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
