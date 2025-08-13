"use client";

import type React from "react";
import { useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ASSETS } from "@/lib/constants";
import Link from "next/link";
import { useGetCartItems } from "@/lib/queries";
import { useModalStore, Modal, useGlobalStore } from "@/lib/stores";
import toast from "react-hot-toast";
import { MoonLoader } from "react-spinners";
import { imageUrl } from "@/lib/utils";
import { useRemoveFromCart } from "@/lib/mutations";
import { Lock } from "lucide-react";

export default function CartDropdown() {
  const t = useTranslations("cart-dropdown");
  const { data: res, isLoading, isSuccess } = useGetCartItems();
  const removeCart = useRemoveFromCart();
  const { user } = useGlobalStore();
  const { openModal } = useModalStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const total = isSuccess
    ? res.data.reduce(
        (sum, item) =>
          sum +
          (item.product.isAuction
            ? item.product.bids[0].amount
            : item.product.price),
        0,
      )
    : 0.0;

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

  function onCartOpen() {
    if (!user) {
      toast("Login to view the cart");
      openModal({ modal: Modal.LoginSignup });
    } else {
      setIsOpen((prev) => !prev);
    }
  }

  function onRemoveItem(id: number) {
    const confirmation = window.confirm(t("remove-from-cart-confirmation"));
    if (!confirmation) return;
    removeCart.mutate(id);
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div>
        <div
          className="hidden sm:block relative cursor-pointer"
          onClick={onCartOpen}
        >
          <CartIcon items={isSuccess ? res.data.length : 0} />
        </div>

        <Link className="sm:hidden block relative" href="/cart">
          <CartIcon items={isSuccess ? res.data.length : 0} />
        </Link>
      </div>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[490px] bg-white border rounded-xl shadow-2xl p-6 z-50">
          {isLoading ? (
            <div className="h-[150px] grid content-center">
              <MoonLoader color="#d9d9d9" />
            </div>
          ) : isSuccess && res.data.length ? (
            <div className="space-y-6">
              {/* Header */}
              <h3 className="font-semibold text-lg">{t("my-cart")}:</h3>
              {/* Cart Items */}
              <div className="space-y-4">
                {res.data.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="h-[110px] w-[80px] bg-[#F5F5F5] rounded-xl overflow-hidden">
                      <Image
                        src={
                          imageUrl(item.product.images[0].url) ||
                          "/placeholder.svg"
                        }
                        alt={item.product.title}
                        width={80}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[#424242]">{item.product.title}</h4>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-semibold">
                        ${" "}
                        {item.product.isAuction
                          ? item.product.bids[0].amount
                          : item.product.price}
                      </span>
                      {!item.expirey ? (
                        <button
                          className="text-gray-400 focus:outline-none hover:text-gray-600 transition-colors"
                          onClick={() => onRemoveItem(item.product.id)}
                        >
                          <Image
                            src={
                              ASSETS["trash-black.svg"] || "/placeholder.svg"
                            }
                            alt="Remove"
                            width={20}
                            height={20}
                          />
                        </button>
                      ) : (
                        <div className="size-5">
                          {/* <Image
                            src={
                              ASSETS["padlock-white.svg"] || "/placeholder.svg"
                            }
                            alt="Remove"
                            width={20}
                            height={20}
                          /> */}
                          <Lock className="size-5 text-neutral-500" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/* Total */}
              <div className="w-[75%] h-[1px] bg-[#E7E7E7] mx-auto"></div>
              <div className="flex items-center justify-between pt-4 !mt-0">
                <span className="font-semibold text-lg">Total:</span>
                <span className="font-semibold text-lg">$ {total}</span>
              </div>
              {/* Actions */}
              <div className="flex gap-4">
                <Link
                  href="/cart"
                  className="flex-1"
                  onClick={() => setIsOpen(false)}
                >
                  <Button
                    variant="outline"
                    className="w-full rounded-full h-12 flex items-center justify-center uppercase"
                  >
                    <Image
                      src={
                        ASSETS["shopping-cart-black.svg"] || "/placeholder.svg"
                      }
                      alt="Cart"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    {t("view-cart")}
                  </Button>
                </Link>
                <Link
                  href={
                    "/checkout?ids=" +
                    res.data.map((v) => v.product.id).join(",")
                  }
                  className="flex-1"
                >
                  <Button
                    className="w-full flex-1 rounded-full h-12 bg-black hover:bg-black/90 flex items-center justify-center uppercase"
                    onClick={() => setIsOpen(false)}
                  >
                    <Image
                      src={
                        ASSETS["credit-card-white.svg"] || "/placeholder.svg"
                      }
                      alt="Credit Card"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    {t("checkout")}
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="h-[150px] grid content-center">
              <p className="text-blue-500 text-center">{t("empty-cart")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CartIcon({ items }: { items: number }) {
  return (
    <div className="relative">
      <Image
        src={ASSETS["shopping-cart-black.svg"] || "/placeholder.svg"}
        alt="Shopping Cart"
        width={22}
        height={22}
        className="size-5 sm:size-6"
        priority
      />
      {!!items && (
        <span className="absolute -top-2 -right-2 bg-[#ff5858] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {items}
        </span>
      )}
    </div>
  );
}
