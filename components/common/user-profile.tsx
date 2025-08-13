"use client";

import type React from "react";
import { useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { imageUrl, cn } from "@/lib/utils";
import { useLogout } from "@/lib/mutations";
import { ASSETS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Modal, useGlobalStore, useModalStore } from "@/lib/stores";
import { useGetMe, useGetFavoriteIds, useGetConfig } from "@/lib/queries";
import Skeleton from "react-loading-skeleton";

export default function UserProfile() {
  const t = useTranslations();
  useGetConfig();
  const { user } = useGlobalStore();
  const { openModal } = useModalStore();
  const { isLoading } = useGetMe();
  useGetFavoriteIds();
  const logout = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    {
      icon: ASSETS["box-black.svg"],
      label: t("navigation.dashboard.sales"),
      href: "/user-dashboard/sales/publications",
      notifications: 1,
      className: "bg-[#f3f3f3]",
    },
    {
      icon: ASSETS["shopping-cart-black.svg"],
      label: t("navigation.dashboard.shopping"),
      href: "/user-dashboard/shopping/orders",
      notifications: 1,
      className: "bg-[#f3f3f3]",
    },
    {
      icon: ASSETS["message-black.svg"],
      label: t("navigation.dashboard.messages"),
      href: "/user-dashboard/messages",
      notifications: 2,
      className: "bg-[#f3f3f3]",
    },
    {
      icon: ASSETS["user-2.svg"],
      label: t("navigation.dashboard.my-profile"),
      href: "/user-dashboard/profile",
    },
    {
      icon: ASSETS["user-3.svg"],
      label: t("navigation.dashboard.following"),
      href: "/user-dashboard/following",
    },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="hidden sm:flex items-center gap-3">
        <Skeleton circle width={44} height={44} />
        <Skeleton width={100} height={44} />
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() =>
          user
            ? setIsOpen((prev) => !prev)
            : openModal({ modal: Modal.LoginSignup })
        }
      >
        <Button
          variant="ghost"
          className="hidden p-0 md:flex hover:bg-transparent items-center justify-start gap-3"
        >
          <Image
            src={
              user
                ? imageUrl(user.avatarUrl) || ASSETS["user-1.svg"]
                : ASSETS["placeholder-profile-pic.png"]
            }
            alt="User"
            width={40}
            height={40}
            className={`rounded-full object-cover object-center h-10 w-10`}
            priority
          />
          <div className="hidden lg:block text-sm leading-tight text-start">
            <span>
              {user
                ? t("common.hello") +
                  ", " +
                  user.firstName +
                  " " +
                  user.lastName
                : t("common.login-register")}
            </span>
            <br />
            <span className="text-xs text-gray-500">
              {t("common.orders-and-account")}
            </span>
          </div>
        </Button>
      </div>
      {isOpen && (
        <div className="absolute right-0 mt-2 min-w-[380px] space-y-2 bg-white rounded-lg shadow-shadow-1 p-5 z-50 ">
          <div className="md:hidden text-sm leading-tight text-start">
            <span>
              {user
                ? t("common.hello") +
                  ", " +
                  user.firstName +
                  " " +
                  user.lastName
                : t("common.login-register")}
            </span>
            <br />
            <span className="text-xs text-gray-500">
              {t("common.orders-and-account")}
            </span>
          </div>
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center text-lg font-semibold leading-[0.9] justify-between px-4 py-2 cursor-pointer rounded-full hover:opacity-90",
                item.className,
              )}
              onClick={() => setIsOpen(false)}
            >
              <span className="flex items-center gap-2">
                <Image
                  src={item.icon || "/placeholder.svg"}
                  alt={item.label}
                  width={24}
                  height={24}
                />
                <span className="-mb-1">{item.label}</span>
              </span>
              {item.notifications && (
                <span className="-mb-1 bg-white w-9 h-9 rounded-full flex items-center justify-center text-sm">
                  {item.notifications}
                </span>
              )}
            </Link>
          ))}
          <button
            className="flex items-center font-semibold gap-2 text-lg leading-[0.9]  text-gray-500 my-2 px-4 py-2 cursor-pointer w-full hover:bg-gray-50 rounded-full"
            onClick={() => {
              setIsOpen(false);
              logout.mutate();
            }}
          >
            <Image
              src={ASSETS["logout-black.svg"] || "/placeholder.svg"}
              alt="Logout"
              width={24}
              height={24}
            />
            <span className="-mb-1">{t("navigation.dashboard.logout")}</span>
          </button>
        </div>
      )}
    </div>
  );
}
