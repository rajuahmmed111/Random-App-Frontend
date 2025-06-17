"use client";

import { Button } from "@/src/components/ui/button";
import { User, LogOut } from "lucide-react";
import { ThemeToggle } from "@/src/components/theme-toggle";
import type { UserType } from "@/src/lib/types";
import { NotificationDropdown } from "./notification-dropdown";
import Link from "next/link";

interface RoadmapHeaderProps {
  user: UserType;
  onLogout: () => void;
}

export function RoadmapHeader({ user, onLogout }: RoadmapHeaderProps) {
  return (
    <header className="bg-card border-b border-border px-4 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Product Roadmap
          </h1>
          <p className="text-sm text-muted-foreground">
            Collaborate on our product future
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/*Notification Dropdown */}
          <NotificationDropdown userId={user.id} />

          {/* Features Page Link */}
          <Link href="/features">
            <Button variant="ghost" size="sm">
              Features
            </Button>
          </Link>

          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-muted">
            <User className="w-4 h-4" />
            <span className="text-sm font-medium">{user.username}</span>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
