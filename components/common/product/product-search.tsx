"use client";

import { useTranslations } from "next-intl";
import type React from "react";
import { ComponentRef, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { ASSETS } from "@/lib/constants";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useRouter } from "next/navigation";
import { cn, imageUrl } from "@/lib/utils";
import { useGlobalStore } from "@/lib/stores";

const popularNow = ["Polos", "Pantalones", "Camisas", "Chompas"];

export default function ProductSearch() {
  const [productSearch, setProductSearch] = useState("");

  const [drawerOpen, setDrawer] = useState(false);

  const productDropdownRef = useRef<ComponentRef<"div">>(null);
  // const [heightRecalc, forceHeightRecalc] = useState(0);
  const [dropdownOpen, setDropdown] = useState(false);
  const [productDropdownHeight, setProductDropdownHeight] = useState(0);
  const { recentSearches, browsingHistory } = useGlobalStore();

  // IMPORTANT: productDropdownHeight needs to be updated when it's content changes, like recent searches or recently viewed products
  useEffect(() => {
    if (productDropdownRef.current) {
      setProductDropdownHeight(productDropdownRef.current.offsetHeight);
    }
  }, [dropdownOpen, recentSearches, browsingHistory]);

  function openSearchDropdown() {
    setDropdown(true);
  }

  function onItemClick() {
    setDropdown(false);
    setDrawer(false);
  }

  return (
    <>
      {/* implement an overlay on clicking will set dropdown to false */}
      <Drawer
        direction="left"
        open={drawerOpen}
        onOpenChange={(v) => setDrawer(v)}
      >
        <DrawerTrigger className="md:hidden">
          <Image
            src={ASSETS["search-black.svg"] || "/placeholder.svg"}
            alt="Search Icon"
            width={22}
            height={22}
            priority
            className="w-[18px] sm:w-[22px] h-[18px] sm:h-[22px]"
          />
        </DrawerTrigger>

        <DrawerContent className=" max-w-[90%] min-[450px]:max-w-[400px] h-full overflow-y-auto rounded-none rounded-r-xl">
          <SearchSuggestions
            value={productSearch}
            setValue={setProductSearch}
            onClick={openSearchDropdown}
            onSubmit={onItemClick}
          />
        </DrawerContent>
      </Drawer>

      {/* overlay */}
      <div
        onClick={() => setDropdown(false)}
        className={cn("fixed inset-0 z-[19]", !dropdownOpen && "hidden")}
      ></div>
      <div className="hidden group md:block relative z-20">
        <SearchInput
          value={productSearch}
          setValue={setProductSearch}
          onClick={openSearchDropdown}
          onSubmit={onItemClick}
        />
        <div
          ref={productDropdownRef}
          className={cn(
            "absolute left-0 -right-[50%] z-20 bg-white max-w-lg md:max-w-xl border-0 rounded-2xl shadow-shadow-1 mt-0",
            dropdownOpen ? "group-focus-within:block" : "hidden",
            productDropdownHeight ? "visible" : "invisible",
          )}
          style={{
            bottom: `-${productDropdownHeight + 10}px`,
          }}
        >
          <SearchSuggestions
            value={productSearch}
            setValue={setProductSearch}
            onClick={openSearchDropdown}
            onSubmit={onItemClick}
          />
        </div>
      </div>
    </>
  );
}

function SearchSuggestions(props: {
  onClick: () => void;
  onSubmit: () => void;
  value: string;
  setValue: (value: string) => void;
}) {
  const { recentSearches, browsingHistory } = useGlobalStore();
  const t = useTranslations("product-search");
  return (
    <div className="p-6">
      {/* Search Input */}
      <SearchInput
        className="md:hidden mb-6"
        onClick={() => {}}
        onSubmit={props.onSubmit}
        value={props.value}
        setValue={props.setValue}
      />

      {/* Recent Searches */}
      {recentSearches.length ? (
        <div className="mb-6 md:mb-8 space-y-2 md:space-y-4">
          <h3 className="text-lg font-bold">{t("recent-searches")}</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term, index) => (
              <Link
                href={`/products?query=${encodeURIComponent(term)}`}
                key={index}
                className="text-sm md:text-base px-3 md:px-6 py-[5px] md:py-2 bg-[#F5F5F5] rounded-full hover:bg-[#E5E5E5] transition-colors max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap"
                onClick={() => {
                  props.setValue(term);
                  props.onSubmit();
                }}
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {/* Popular Now */}
      <div className="space-y-2 md:space-y-4">
        <h3 className="text-lg font-bold">{t("popular-now")}</h3>
        <div className="flex flex-wrap gap-2">
          {popularNow.map((term, index) => (
            <Link
              key={index}
              className="text-sm md:text-base px-3 md:px-6 py-[5px] md:py-2 bg-[#F5F5F5] rounded-full hover:bg-[#E5E5E5] transition-colors"
              href={`/products?subcategory=${term}`}
              onClick={props.onSubmit}
            >
              {term}
            </Link>
          ))}
        </div>
      </div>

      {/* Browsing History */}
      {browsingHistory.length ? (
        <div className="mt-6 md:mt-8 space-y-4">
          <h3 className="text-lg font-bold">{t("browsing-history")}</h3>
          <div className="grid grid-cols-3 gap-4">
            {browsingHistory.map((item) => (
              <Link
                key={item.id}
                href={`/products/${item.id}`}
                onClick={props.onSubmit}
                className="group block space-y-2"
              >
                <div className="aspect-[4/5] relative rounded-lg overflow-hidden bg-[#F5F5F5]">
                  <Image
                    src={imageUrl(item.images[0].url) || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold">
                    $
                    {(item.isAuction && item.bids.length
                      ? item.bids[0].amount
                      : item.price
                    ).toFixed(2)}
                  </p>
                  <h4 className="text-neutral-400 font-bold line-clamp-2">
                    {item.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SearchInput({
  className,
  onClick,
  onSubmit,
  value,
  setValue,
}: {
  className?: string;
  onClick: () => void;
  onSubmit: () => void;
  value: string;
  setValue: (value: string) => void;
}) {
  const { setRecentSearch } = useGlobalStore();
  const t = useTranslations("product-search");
  const router = useRouter();
  return (
    <form
      className={cn("relative flex-1 w-full", className)}
      onClick={onClick}
      onSubmit={(e) => {
        e.preventDefault();
        setRecentSearch(value);
        onSubmit();
        router.push(`/products?query=${value}`, { scroll: true });
      }}
    >
      <Input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t("search-products")}
        className="w-full pl-4 flex-1 min-w-[240px] pr-10 rounded-full border-[#424242]"
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 h-[18px] cursor-pointer"
      >
        <Image
          src={ASSETS["search-black.svg"] || "/placeholder.svg"}
          alt="Search Icon"
          width={18}
          height={18}
          className="w-[18px] text-gray-400"
          priority
        />
      </button>
    </form>
  );
}
