"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { ASSETS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useLogout } from "@/lib/mutations";

interface IDashboardNavigationProps {
  onNavigation: () => void;
  className?: string;
}

export default function DashboardNavigation({
  onNavigation,
  className,
}: IDashboardNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const logout = useLogout();
  const menuItems = [
    {
      icon: ASSETS["box-black.svg"],
      label: t("navigation.dashboard.sales"),
      notifications: 1,
      className: "bg-[#f4f4f4]",
      type: "dropdown",
      href: "",
      subItems: [
        {
          icon: ASSETS["box-black.svg"],
          label: t("navigation.dashboard.your-publications"),
          href: "/user-dashboard/sales/publications",
        },
        {
          icon: ASSETS["wallet-black.svg"],
          label: t("navigation.dashboard.orders"),
          href: "/user-dashboard/sales/orders",
        },
        {
          icon: ASSETS["bar-graph-black.svg"],
          label: t("navigation.dashboard.seller-panel"),
          href: "/user-dashboard/sales/seller-panel",
        },
        {
          icon: ASSETS["crown-black.svg"],
          label: t("navigation.dashboard.my-subscription"),
          href: "/user-dashboard/sales/subscription",
        },
      ],
    },
    {
      icon: ASSETS["shopping-cart-black.svg"],
      label: t("navigation.dashboard.shopping"),
      notifications: 1,
      className: "bg-[#f4f4f4]",
      type: "dropdown",
      href: "",
      subItems: [
        {
          icon: ASSETS["shopping-cart-black.svg"],
          label: t("navigation.dashboard.my-orders"),
          href: "/user-dashboard/shopping/orders",
        },
        {
          icon: ASSETS["offer-black.svg"],
          label: t("navigation.dashboard.my-offers"),
          href: "/user-dashboard/shopping/offers",
        },
        {
          icon: ASSETS["history-black.svg"],
          label: t("navigation.dashboard.record"),
          href: "/user-dashboard/shopping/history",
        },
        {
          icon: ASSETS["heart-black.svg"],
          label: t("navigation.dashboard.favorites"),
          href: "/user-dashboard/shopping/favorites",
        },
        {
          icon: ASSETS["directions-black.svg"],
          label: t("navigation.dashboard.addresses"),
          href: "/user-dashboard/shopping/addresses",
        },
        {
          icon: ASSETS["star-black.svg"],
          label: t("navigation.dashboard.reviews"),
          href: "/user-dashboard/shopping/reviews",
        },
      ],
    },
    {
      icon: ASSETS["message-black.svg"],
      label: t("navigation.dashboard.messages"),
      type: "link",
      href: "/user-dashboard/messages",
      notifications: 2,
      className: "bg-[#f4f4f4]",
    },
    {
      icon: ASSETS["user-2.svg"],
      label: t("navigation.dashboard.my-profile"),
      type: "link",
      href: "/user-dashboard/profile",
    },
    {
      icon: ASSETS["chat-black.svg"],
      label: t("navigation.dashboard.support"),
      type: "link",
      href: "/",
    },
    {
      icon: ASSETS["user-3.svg"],
      label: t("navigation.dashboard.following"),
      type: "link",
      href: "/user-dashboard/following",
    },
  ];
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  function toggleExpand(label: string) {
    setExpandedItem(expandedItem === label ? null : label);
  }

  function onMenuItemClick(args: {
    type: string;
    label: string;
    href: string;
  }) {
    if (args.type === "link") {
      onNavigation();
      router.push(args.href);
    } else if (args.type === "dropdown") {
      toggleExpand(args.label);
    }
  }

  async function onLogoutClick() {
    try {
      await logout.mutateAsync();
      onNavigation();
    } catch {}
  }

  return (
    <nav className={cn("space-y-3", className)}>
      {menuItems.map((item) => (
        <div key={item.label} className="space-y-2">
          <div
            className={cn(
              "text-lg font-semibold leading-[0.9] px-4 py-3 rounded-full hover:opacity-90 cursor-pointer",
              item.className || "hover:bg-gray-50",
              pathname === item.href && "bg-gray-100",
            )}
          >
            <Link
              href={item.href}
              className="flex items-center justify-between gap-3 flex-1"
              onClick={(e) => {
                e.preventDefault();
                onMenuItemClick({
                  type: item.type,
                  href: item.href,
                  label: item.label,
                });
              }}
            >
              <div className="flex items-center gap-3">
                <Image
                  src={item.icon || "/placeholder.svg"}
                  alt={item.label}
                  width={24}
                  height={24}
                />
                <span className="-mb-1">{item.label}</span>
              </div>
              <div className="flex items-center gap-3">
                {item.subItems && (
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 transition-transform",
                      expandedItem === item.label && "transform rotate-180",
                    )}
                    onClick={() => toggleExpand(item.label)}
                  />
                )}
                {item.notifications && (
                  <span className="bg-white w-7 h-7 rounded-full flex items-center justify-center text-sm">
                    {item.notifications}
                  </span>
                )}
              </div>
            </Link>
          </div>
          {/* Sub Items */}
          {item.subItems && expandedItem === item.label && (
            <div className="ml-12 space-y-2">
              {item.subItems.map((subItem) => (
                <Link
                  key={subItem.label}
                  href={subItem.href}
                  onClick={(e) => {
                    e.preventDefault();
                    onMenuItemClick({
                      type: "link",
                      href: subItem.href,
                      label: subItem.label,
                    });
                  }}
                  className={cn(
                    "flex items-center text-base gap-3 px-4 py-2 rounded-full hover:bg-gray-50",
                    pathname === subItem.href && "bg-gray-100",
                  )}
                >
                  <Image
                    src={subItem.icon || "/placeholder.svg"}
                    alt={subItem.label}
                    width={18}
                    height={18}
                  />
                  <span>{subItem.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
      <button
        className="flex items-center font-semibold gap-3 text-lg leading-[0.9] text-gray-500 w-full px-4 py-3 hover:bg-gray-50 rounded-full"
        onClick={onLogoutClick}
      >
        <Image
          src={ASSETS["logout-black.svg"] || "/placeholder.svg"}
          alt="Logout"
          width={24}
          height={24}
        />
        <span className="-mb-1">{t("navigation.dashboard.logout")}</span>
      </button>
    </nav>
  );
}
