"use client";

import { useUIStore } from "@/store/uiStore";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed, mobileSidebarOpen, closeMobileSidebar } =
    useUIStore();

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-dark-0">
      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
        />
      )}

      <Sidebar />
      <TopBar />
      <main
        className={cn(
          "pt-16 min-h-screen transition-all duration-300 ease-spring",
          "pl-0 md:pl-16",
          !sidebarCollapsed && "md:pl-[200px]"
        )}
      >
        <div className="p-4 sm:p-6 pb-28">{children}</div>
      </main>
    </div>
  );
}
