"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import MobileFooter from "./mobile-footer";
import AdminSidebar from "./admin-sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  
  // Hide the layout if the route is the root path
  if (pathname === "/") {
    return <>{children}</>;
  }
  
  return (
    <div className="flex min-h-screen bg-white dark:bg-black">
      <AdminSidebar />
      <div className="flex-1 bg-white dark:bg-black overflow-y-auto h-screen">
        <div className="mx-auto max-w-md md:max-w-4xl lg:max-w-6xl pb-16 md:pb-0">
          {children}
        </div>
        <div className="md:hidden">
          <MobileFooter />
        </div>
      </div>
    </div>
  );
}
