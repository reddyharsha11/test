"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Trophy,
  Bookmark,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  HelpCircle,
  Code2,
  Gamepad2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/uiStore";
import { useProgressStore } from "@/store/progressStore";

const navItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    id: "nav-dashboard",
  },
  { href: "/modules", icon: BookOpen, label: "Modules", id: "nav-modules" },
  {
    href: "/cheat-sheets",
    icon: FileText,
    label: "Cheat Sheets",
    id: "nav-cheatsheets",
  },
  {
    href: "/quizzes",
    icon: HelpCircle,
    label: "Quizzes",
    id: "nav-quizzes",
  },
  {
    href: "/playground",
    icon: Code2,
    label: "Playground",
    id: "nav-playground",
  },
  {
    href: "/achievements",
    icon: Trophy,
    label: "Achievements",
    id: "nav-achievements",
  },
  {
    href: "/bookmarks",
    icon: Bookmark,
    label: "Bookmarks",
    id: "nav-bookmarks",
  },
  {
    href: "/progress",
    icon: BarChart3,
    label: "Progress",
    id: "nav-progress",
  },
  {
    href: "/settings",
    icon: Settings,
    label: "Settings",
    id: "nav-settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const {
    sidebarCollapsed,
    mobileSidebarOpen,
    toggleSidebar,
    closeMobileSidebar,
  } = useUIStore();
  const { totalXP } = useProgressStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-white dark:bg-surface-dark-50 border-r border-surface-200 dark:border-surface-dark-300 transition-all duration-300 ease-spring",
        // Desktop widths
        "max-md:w-[260px]",
        sidebarCollapsed ? "md:w-16" : "md:w-[200px]",
        // Mobile slide-in
        "max-md:translate-x-0 max-md:shadow-2xl",
        mobileSidebarOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-surface-200 dark:border-surface-dark-300 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div
          className={cn(
            "min-w-0",
            sidebarCollapsed && "md:hidden"
          )}
        >
          <p className="text-sm font-black text-gray-900 dark:text-white leading-none">
            GuideLearn
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
            Always by your side
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              id={item.id}
              onClick={closeMobileSidebar}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group",
                isActive
                  ? "bg-brand-gradient text-white shadow-glow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-surface-100 dark:hover:bg-surface-dark-200 hover:text-gray-900 dark:hover:text-white"
              )}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span
                className={cn(
                  "text-sm font-semibold truncate",
                  sidebarCollapsed && "md:hidden"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Upgrade card */}
      <div
        className={cn(
          sidebarCollapsed && "md:hidden"
        )}
      >
        <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
          Upgrade to Pro
        </p>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
          Unlock advanced content, quizzes and more!
        </p>
        <button className="mt-2.5 w-full py-1.5 px-3 rounded-xl bg-brand-gradient text-white text-xs font-bold hover:shadow-glow-sm transition-all">
          Upgrade Now
        </button>
      </div>

      {/* Collapse toggle — desktop only */}
      <button
        onClick={toggleSidebar}
        className="hidden md:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-surface-dark-100 border border-surface-200 dark:border-surface-dark-300 shadow-card items-center justify-center hover:bg-surface-100 dark:hover:bg-surface-dark-200 transition-colors z-50"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-3 h-3 text-gray-500" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-gray-500" />
        )}
      </button>
    </aside>
  );
}
