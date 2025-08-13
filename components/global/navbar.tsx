"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ASSETS } from "@/lib/constants";
import CartDropdown from "@/components/common/cart-dropdown";
import UserProfile from "@/components/common/user-profile";
import ProductSearch from "@/components/common/product/product-search";
import MenuDrawer from "@/components/common/menu-drawer";
import LeftSidebar from "@/components/common/left-sidebar";
import { useModalStore, Modal } from "@/lib/stores";
import { useRouter } from "next/navigation";

interface INavItem {
  name: string;
  href: string;
  icon?: keyof typeof ASSETS;
}

export default function Navbar() {
  const t = useTranslations("navigation");

  // Define navigation items with their respective links
  const navItems: Array<INavItem> = [
    {
      name: t("auctions"),
      href: `/auctions`,
      icon: "flash-white.svg",
    },
    { name: t("men"), href: `/products?category=Hombre` },
    { name: t("women"), href: `/products?category=Mujer` },
    { name: t("boys"), href: `/products?category=Niños` },
    { name: t("girls"), href: `/products?category=Niñas` },
    { name: t("featured"), href: `/products?isFeatured=true` },
    { name: t("luxury"), href: `/premium` },
    { name: t("influencers"), href: `/featured-sellers` },
  ];

  return (
    <>
      <div id="scroll-top">
        <div className="container mx-auto px-8 sm:px-4 py-3 sm:py-4 grid grid-cols-[1fr_130px_1fr] md:grid-cols-[1fr_150px_1fr]">
          {/* Left Section */}
          <div className="flex-1 w-auto flex items-center justify-start gap-4">
            {/* Search Bar */}
            <LeftSidebar />
            <ProductSearch />
          </div>

          {/* Logo */}
          <Link href="/" className="flex justify-center items-center">
            <Image
              src={ASSETS["zecond-logo-black.png"] || "/placeholder.svg"}
              alt="ZECOND CLOSET SALE"
              width={120}
              height={60}
              className="-mt-2 flex-1"
              priority
            />
          </Link>

          {/* Right Section */}
          <div className="flex-1 flex items-center justify-end gap-4 sm:gap-7">
            {/* User's Profile */}
            <UserProfile />

            <Link
              href="/help"
              className="hidden xl:ml-[140px] sm:flex items-center"
            >
              <Image
                src={ASSETS["chat-black.svg"] || "/placeholder.svg"}
                alt="Ayuda"
                width={20}
                height={20}
                className="w-7 h-7"
              />
            </Link>
            <CartDropdown />
            <MenuDrawer navItems={navItems} />
          </div>
        </div>
        {/* Navigation */}
        <BottomNav navItems={navItems} />
      </div>
    </>
  );
}

function BottomNav({ navItems }: { navItems: INavItem[] }) {
  const t = useTranslations("navigation");
  const router = useRouter();
  return (
    <nav className="hidden md:block bg-black text-white py-4 lg:py-2">
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse min-[530px]:flex-row items-center justify-center gap-4 min-[530px]:justify-between">
          <ul className="flex flex-wrap max-[530px]:justify-center lg:items-center gap-y-2 gap-x-6 xl:gap-x-8">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex uppercase items-center gap-2 text-xs font-bold hover:opacity-85"
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
          <Button
            className="min-[530px]:ml-auto max-w-[75%] bg-black text-white border border-white rounded-full px-6 py-2 font-medium flex items-center gap-2"
            onClick={() => router.push("/subscription-plans")}
          >
            <Image
              src={ASSETS["plus-white.svg"] || "/placeholder.svg"}
              alt="User"
              width={120}
              height={60}
              className="h-3 w-3"
              priority
            />
            {t("sell-now")}
          </Button>
        </div>
      </div>
    </nav>
  );
}
