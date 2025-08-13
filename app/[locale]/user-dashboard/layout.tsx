"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import DashboardNavigation from "@/components/common/dashboard-navigation";
import { routing } from "@/i18n/routing";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const getBreadcrumb = () => {
    const path = pathname.split("/").filter(Boolean);
    // clearing locales
    if (routing.locales.includes(path[0] as any)) path.shift();
    if (path[0] === "user-dashboard") path.shift();
    const breadcrumb = path.map((segment, index) => {
      const href = `/${path.slice(0, index + 1).join("/")}`;
      return {
        href,
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
      };
    });
    return [{ href: "/", label: "Inicio" }, ...breadcrumb];
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* <div className="flex flex-col md:flex-row min-h-screen"> */}
      <div className="relative md:grid md:grid-cols-[280px_1fr] lg:grid-cols-[300px_1fr] xl:grid-cols-[360px_1fr] min-h-screen">
        {/* Back button for mobile */}
        <div className="sm:hidden absolute left-2 cursor-pointer">
          <ChevronLeft onClick={() => router.back()} />
        </div>

        {/* Sidebar */}
        <aside className="w-full sm:h-auto min-w-[280px] lg:max-w-[300px] xl:max-w-[360px] md:pt-6 px-6 md:px-0 md:py-8 lg:px-6">
          {/* Breadcrumb */}
          {/*<div className="hidden md:block text-sm text-[#424242] mb-8">
            {getBreadcrumb().map((item, index) => (
              <span key={item.href}>
                {index > 0 && <span className="mx-2">|</span>}
                <Link href={item.href}>{item.label}</Link>
              </span>
            ))}
          </div>*/}

          <DashboardNavigation
            className="space-y-2 hidden md:block"
            onNavigation={() => {}}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full sm:p-8 h-full">{children}</main>
      </div>
    </div>
  );
}
