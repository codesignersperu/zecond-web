"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ASSETS, SHIPPING_COST } from "@/lib/constants";
import Countdown from "react-countdown";
import { useGetCartItems } from "@/lib/queries";
import { useApplyPromoCode, useRemoveFromCart } from "@/lib/mutations";
import { MoonLoader, PulseLoader } from "react-spinners";
import { useTranslations } from "next-intl";
import { cn, formatCurrency, imageUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Checkbox1 from "@/components/common/checkbox-1";
import toast from "react-hot-toast";
import { HttpErrorResponse, PromoCode } from "@/lib/types";
import { InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGlobalStore } from "@/lib/stores";

export default function CartHeader() {
  const t = useTranslations();
  const { config } = useGlobalStore();
  const { data: res, isLoading, isSuccess } = useGetCartItems();
  const removeCart = useRemoveFromCart();
  const [promoCode, setPromoCode] = useState<string>("");
  const [promoRes, setPromoRes] = useState<PromoCode | null>(null);
  const [promoMessage, setPromoMessage] = useState<[boolean, string] | null>(
    null,
  );
  const applyPromoCode = useApplyPromoCode();
  async function onPromoCode() {
    try {
      const res = await applyPromoCode.mutateAsync({
        promoCode,
        for: "products",
      });
      if (!res.data.usable) {
        setPromoMessage([false, `${res.data.invalidReason}`]);
      } else {
        setPromoRes(res.data);
        setPromoMessage([
          true,
          res.data.description || "Promo code applied successfully",
        ]);
      }
    } catch (e) {
      if ((e as HttpErrorResponse).statusCode === 400)
        setPromoMessage([false, "Invalid promo code"]);
      setPromoMessage([false, "Error Occurred"]);
    }
  }

  const router = useRouter();
  const [itemsToCheckout, setItemsToCheckout] = useState<number[]>([]);

  useEffect(() => {
    if (res && res.data.length) {
      selectAllToggle();
    }
  }, [isSuccess]);

  const subTotal = useMemo(() => {
    if (isSuccess) {
      let sum = res.data.reduce(
        (sum, item) =>
          itemsToCheckout.includes(item.product.id)
            ? sum +
              (item.product.isAuction
                ? item.product.bids[0].amount
                : item.product.price)
            : sum,
        0,
      );
      return sum;
    } else return 0;
  }, [itemsToCheckout]);

  const total = useMemo(() => {
    let sum = subTotal;

    if (
      promoRes &&
      (!promoRes.minimumAmount || subTotal >= promoRes.minimumAmount)
    ) {
      if (promoRes.discount.type === "percent") {
        sum -= Math.floor(sum * (promoRes.discount.value / 100));
      } else {
        sum -= promoRes.discount.value;
      }
    }

    if (sum > 0) {
      sum += config?.deliveryFee || 0;
    }

    return sum;
  }, [subTotal, promoRes]);

  function onRemoveItem(id: number) {
    const confirmation = window.confirm(
      t("cart-dropdown.remove-from-cart-confirmation"),
    );
    if (!confirmation) return;
    removeCart.mutate(id);
  }

  function selectAllToggle() {
    if (res?.data?.length === itemsToCheckout.length) {
      setItemsToCheckout([]);
    } else if (res?.data) {
      setItemsToCheckout(res.data.map((v) => v.product.id));
    }
  }

  function selectItemToggle(id: number) {
    if (itemsToCheckout.includes(id)) {
      setItemsToCheckout((prev) => prev.filter((v) => v !== id));
    } else {
      setItemsToCheckout((prev) => [...prev, id]);
    }
  }

  function onCheckout() {
    let route = "/checkout?ids=";
    if (!itemsToCheckout.length) {
      return toast.error(t("cart.select-products-to-checkout"));
    }
    route += itemsToCheckout.join(",");
    if (
      promoRes &&
      (!promoRes.minimumAmount || subTotal >= promoRes.minimumAmount)
    ) {
      route += `&promo=${promoRes.code}`;
    }
    router.push(route, { scroll: true });
  }

  if (!config) {
    return (
      <div className="h-[100px] justify-center items-center text-center">
        <p className="text-center text-red-500">{t("common.error-occured")}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F7F7]">
      <div className="mx-auto container px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-[#424242] mb-8">
          <Link href="/" className="hover:underline">
            Inicio
          </Link>
          <span className="mx-2">|</span>
          <span>Mi Carrito</span>
        </div>

        <div className="grid w-full lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="h-[350px] col-span-full w-full flex justify-center items-center">
              <MoonLoader color="#989898" size={40} />
            </div>
          ) : isSuccess && res.data.length ? (
            <>
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {/* Header */}
                <div className="grid grid-cols-[1fr,9fr,2fr,2fr,1fr] gap-4 px-4 text-[#424242]">
                  {/* Select All */}
                  <div className="flex justify-center">
                    <Checkbox1
                      checked={res.data.length === itemsToCheckout.length}
                      onChange={selectAllToggle}
                    />
                  </div>
                  <div className="flex items-center">Artículos</div>
                  <div className="items-center justify-center hidden sm:flex text-center">
                    Cant.
                  </div>
                  <div className="items-center justify-center hidden sm:flex text-center">
                    Precio
                  </div>
                  <div></div>
                </div>

                {/* Items */}
                {res.data.map((item) => (
                  <div
                    key={item.product.id}
                    className={`rounded-xl p-4 shadow-1 relative overflow-hidden ${item.product.isAuction ? "bg-black text-white" : "bg-white"}`}
                  >
                    <div className="grid sm:grid-cols-[1fr,9fr,2fr,2fr,1fr] gap-4 item.products-center">
                      {/* Select Product */}
                      <div className="flex sm:justify-center items-center">
                        <Checkbox1
                          checked={itemsToCheckout.includes(item.product.id)}
                          onChange={() => selectItemToggle(item.product.id)}
                        />
                      </div>
                      {/* Product Info */}
                      <div className="flex gap-4">
                        <div className="flex-1 max-w-[98px] h-[116px] bg-[#F5F5F5] rounded-xl overflow-hidden">
                          <Image
                            src={
                              imageUrl(item.product.images[0].url) ||
                              "/placeholder.svg"
                            }
                            alt={item.product.title}
                            width={98}
                            height={116}
                            className="w-full min-w-20 rounded-xl h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">
                            {/* TODO: Implement text ellipses here */}
                            <span className="line-clamp-2 break-words">
                              {item.product.title}
                            </span>
                            {item.product.isAuction && (
                              <Image
                                src={ASSETS["trophy.svg"] || "/placeholder.svg"}
                                alt="Auction"
                                width={16}
                                height={16}
                                className="inline ml-2"
                              />
                            )}
                          </h3>
                          <div
                            className={`text-sm ${item.product.isAuction ? "text-white/70" : "text-[#424242]"}`}
                          >
                            <p>Talla: {item.product.size}</p>
                            <p>Color: {item.product.color}</p>
                            <p>Marca: {item.product.brand}</p>
                          </div>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center sm:justify-center sm:text-center">
                        <span className="sm:hidden font-bold mr-2">Cant: </span>
                        1
                      </div>

                      {/* Price */}
                      <div className="flex items-center sm:justify-center sm:text-center">
                        <span className="sm:hidden font-bold mr-2">
                          Precio:{" "}
                        </span>
                        {formatCurrency(
                          item.product.isAuction
                            ? item.product.bids[0].amount
                            : item.product.price,
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center sm:justify-center sm:text-center">
                        <span className="sm:hidden font-bold mr-2">
                          Actions:{" "}
                        </span>
                        {item.product.isAuction ? (
                          <button className="">
                            <Image
                              src={
                                ASSETS["padlock-white.svg"] ||
                                "/placeholder.svg"
                              }
                              alt={"Locked"}
                              width={20}
                              height={20}
                            />
                          </button>
                        ) : (
                          <button className="">
                            <Image
                              src={
                                ASSETS["trash-black.svg"] || "/placeholder.svg"
                              }
                              alt={"Remove"}
                              width={20}
                              height={20}
                              onClick={() => onRemoveItem(item.product.id)}
                            />
                          </button>
                        )}
                      </div>

                      {/* Auction Timer */}
                      {item.product.isAuction && item.expirey && (
                        <div className="sm:absolute leading-none bottom-3 right-3 sm:w-[50%] flex items-center gap-2 justify-center bg-[#FED843] text-black rounded-full px-4 h-[30px]">
                          {t("common.expires-in")}{" "}
                          <Countdown
                            date={item.expirey}
                            renderer={({ days, hours, minutes, seconds }) => (
                              <p className="min-[440px]:inline">
                                {hours}h : {minutes}m : {seconds}s
                              </p>
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-white border border-black mb-8 rounded-xl p-7">
                  <h2 className="text-xl font-semibold mb-6">
                    Resumen del pedido
                  </h2>
                  <div className="space-y-4 text-[#424242]">
                    <div className="flex justify-between">
                      <span>Total de artículos</span>
                      <span>{formatCurrency(subTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("common.shipping-cost")}</span>
                      <span>{formatCurrency(config?.deliveryFee)}</span>
                    </div>

                    {promoRes &&
                      ((amountNoFullfilled) => (
                        <div
                          className={cn(
                            "flex justify-between",
                            amountNoFullfilled ? "text-red-500" : "",
                          )}
                        >
                          <span className="flex items-center gap-2">
                            {t("common.discount")}
                            {amountNoFullfilled && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button type="button">
                                      <InfoIcon />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      {t.rich(
                                        "common.minimum-discount-requirement",
                                        {
                                          minimumAmount: `${promoRes.minimumAmount}`,
                                        },
                                      )}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </span>
                          <span>
                            - {promoRes.discount.type === "amount" ? "S/ " : ""}
                            {promoRes.discount.value}
                            {promoRes.discount.type === "percent" ? "%" : ""}
                          </span>
                        </div>
                      ))(
                        promoRes.minimumAmount &&
                          subTotal < promoRes.minimumAmount,
                      )}

                    <div className="pt-4 border-t">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total:</span>
                        <span>{formatCurrency(total)}</span>
                      </div>
                    </div>

                    <form
                      className="space-y-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        onPromoCode();
                      }}
                    >
                      <p className="font-bold text-medium">¿Tienes un Cuón?</p>
                      <div className="flex px-4 py-[10px] rounded-xl border border-black">
                        <Image
                          src={ASSETS["coupon-black.svg"] || "/placeholder.svg"}
                          alt="Coupon Code"
                          width={29}
                          height={29}
                        />
                        <Input
                          type="text"
                          placeholder="Introduce tu cupón aquí"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="flex-1 bg-transparent border-none focus:border-none focus-visible:ring-0 focus-visible:ring-offset-0 uppercase placeholder:normal-case"
                        />

                        <Button
                          className={cn(
                            "bg-black hover:bg-black/90 text-white items-center justify-center",
                            promoCode.length ? "flex" : "hidden",
                          )}
                          type="submit"
                          disabled={applyPromoCode.isPending}
                        >
                          {applyPromoCode.isPending ? (
                            <PulseLoader size={8} color="#fff" />
                          ) : (
                            t("common.apply")
                          )}
                        </Button>
                      </div>
                      {promoMessage && (
                        <p
                          className={cn(
                            promoMessage[0] ? "text-green-500" : "text-red-500",
                          )}
                        >
                          {promoMessage[1]}
                        </p>
                      )}
                    </form>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button
                    className="w-full h-12 uppercase rounded-full bg-black hover:bg-black/90 text-white flex item.products-center justify-center gap-2"
                    onClick={onCheckout}
                  >
                    <Image
                      src={
                        ASSETS["credit-card-white.svg"] || "/placeholder.svg"
                      }
                      alt="Credit Card"
                      width={20}
                      height={20}
                    />
                    {t("common.continue")}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-[350px] col-span-full w-full flex justify-center items-center">
              <p className="text-blue-500 text-center">
                {t("cart-dropdown.empty-cart")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
