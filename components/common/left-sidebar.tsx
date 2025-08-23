"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { ASSETS } from "@/lib/constants";
import Image from "next/image";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import DashboardNavigation from "@/components/common/dashboard-navigation";
import { Modal, useModalStore, useGlobalStore } from "@/lib/stores";
import { imageUrl } from "@/lib/utils";
import RatingStars from "./rating-stars";
import Skeleton from "react-loading-skeleton";
import { useGetMe } from "@/lib/queries";

export default function LeftSidebar() {
  const t = useTranslations();
  const { user } = useGlobalStore();
  const [isOpen, setIsOpen] = useState(false);
  const { openModal } = useModalStore();
  const { isLoading } = useGetMe();
  return (
    <>
      <Drawer direction="left" open={isOpen} onOpenChange={setIsOpen}>
        {user ? (
          <DrawerTrigger>
            <Image
              src={
                user
                  ? imageUrl(user.avatarUrl)
                  : ASSETS["profile-icon-black.png"]
              }
              alt="User"
              width={40}
              height={40}
              className="md:hidden h-10 w-10 rounded-full"
              priority
            />
          </DrawerTrigger>
        ) : isLoading ? (
          <div className="md:hidden">
            <Skeleton circle width={40} height={40} />
          </div>
        ) : (
          <Image
            src={ASSETS["user-1.svg"]}
            alt="User"
            width={40}
            height={40}
            className="md:hidden w-5 h-5"
            priority
            onClick={() => openModal({ modal: Modal.LoginSignup })}
          />
        )}

        <DrawerContent className=" max-w-[90%] min-[450px]:max-w-[400px] h-full overflow-y-auto border-none rounded-none rounded-r-xl">
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute  w-8 h-8 right-3 top-2 rounded-full bg-black flex justify-center items-center opacity-100 transition-opacity hover:opacity-70 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <Image
              src={ASSETS["cross-white.svg"] || "/placeholder.svg"}
              alt="ZECOND CLOSET SALE"
              width={12}
              height={12}
            />
            <span className="sr-only">Close</span>
          </button>

          {/* User Profile */}
          <div className="cursor-pointer flex items-center mb-14 gap-3 px-4 bg-[#424242] p-4 pt-12 text-white">
            <Image
              src={
                user
                  ? imageUrl(user.avatarUrl)
                  : ASSETS["profile-icon-black.png"]
              }
              alt="User"
              width={100}
              height={100}
              className="w-[100px] -mb-10 h-[100px] rounded-full"
              priority
            />
            <div className="text-sm">
              <p>
                {t("common.hello")}, {user?.firstName} {user?.lastName}
              </p>
              <RatingStars
                noOfReviews={user?.noOfReviews || 0}
                rating={user?.rating || 0}
              />
            </div>
          </div>

          {/* Nav */}
          <DashboardNavigation
            className="px-5"
            onNavigation={() => setIsOpen(false)}
          />
        </DrawerContent>
      </Drawer>
    </>
  );
}
