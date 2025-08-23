"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ASSETS } from "@/lib/constants";
import { Facebook } from "lucide-react";
import Link from "next/link";

interface IMenuDrawerProps {
  navItems: {
    name: string;
    href: string;
    icon?: keyof typeof ASSETS;
  }[];
}

export default function MenuDrawer({ navItems }: IMenuDrawerProps) {
  const t = useTranslations();
  const discoverLinks = [
    {
      name: t("mobile-drawer.discover.how-does-it-picture"),
    },
    {
      name: t("mobile-drawer.discover.item-verification"),
    },
    {
      name: t("mobile-drawer.discover.download-app"),
    },
    {
      name: t("mobile-drawer.discover.informative-board"),
    },
    {
      name: t("mobile-drawer.discover.help-center"),
    },
  ];

  const enterpriseLinks = [
    {
      name: t("mobile-drawer.company.about-your"),
    },
    {
      name: t("mobile-drawer.company.sustainability"),
    },
    {
      name: t("mobile-drawer.company.work-with-us"),
    },
  ];
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <>
      <Drawer direction="bottom" open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerTrigger className="md:hidden">
          <Menu />
        </DrawerTrigger>
        <DrawerContent className="p-5 border-none bg-[#0e0e0e] space-y-6">
          {/* Create Closet Button */}
          <div className="flex">
            <Link
              href={"/subscription-plans"}
              className="w-full flex justify-center items-center gap-2 bg-[#0e0e0e] text-white border border-white rounded-full px-6 py-2 font-medium"
              onClick={() => setDrawerOpen(false)}
            >
              <Image
                src={ASSETS["plus-white.svg"] || "/placeholder.svg"}
                alt="User"
                width={120}
                height={60}
                className="h-3 w-3"
                priority
              />
              {t("navigation.sell-now")}
            </Link>
          </div>
          {/* Links */}
          <ul className="flex flex-wrap gap-y-3 gap-x-2">
            {navItems.map((item) => (
              <li
                key={item.name}
                className="bg-[#252525] px-4 text-white py-[10px] rounded-full"
              >
                <Link
                  href={item.href}
                  className="flex items-center uppercase gap-2 text-xs font-bold hover:opacity-85"
                  onClick={() => setDrawerOpen(false)}
                >
                  {item.icon && (
                    <Image
                      src={ASSETS[item.icon] || "/placeholder.svg"}
                      alt={item.name}
                      width={12}
                      height={18}
                      priority
                    />
                  )}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          {/* Discover */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-lg uppercase">
              {t("mobile-drawer.discover.discover")}
            </h3>
            <ul className="flex flex-wrap gap-y-3 gap-x-2">
              {discoverLinks.map((item) => (
                <li
                  key={item.name}
                  className="bg-[#252525] px-4 text-white py-[10px] rounded-full"
                >
                  <Link
                    href={"/"}
                    className="flex items-center gap-2 text-xs font-bold hover:opacity-85"
                    onClick={() => setDrawerOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Company */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-lg uppercase">
              {t("mobile-drawer.company.company")}
            </h3>
            <ul className="flex flex-wrap gap-y-3 gap-x-2">
              {enterpriseLinks.map((item) => (
                <li
                  key={item.name}
                  className="bg-[#252525] px-4 text-white py-[10px] rounded-full"
                >
                  <Link
                    href={"/"}
                    className="flex items-center gap-2 text-xs font-bold hover:opacity-85"
                    onClick={() => setDrawerOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <Link href="https://instagram.com" className="hover:opacity-80">
              <Image
                src={ASSETS["instagram-white.svg"]}
                alt="Instagram"
                width={24}
                height={24}
              />
            </Link>
            <Link href="https://instagram.com" className="hover:opacity-80">
              <Image
                src={ASSETS["twitter-white.svg"]}
                alt="Twitter"
                width={22}
                height={22}
              />
            </Link>
            <Link href="https://facebook.com" className="hover:opacity-80">
              <Facebook className="text-white" />
            </Link>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
