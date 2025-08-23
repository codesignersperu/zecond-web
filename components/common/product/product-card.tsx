"use client";

import { useTranslations } from "next-intl";
import { useModalStore, Modal, useGlobalStore } from "@/lib/stores";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ASSETS } from "@/lib/constants";
import Countdown from "react-countdown";
import { cn, formatCurrency, imageUrl } from "@/lib/utils";
import type { AuctionStatus, IProduct } from "@/lib/types";
import { useAddToCart } from "@/lib/mutations";
import { ComponentRef, useEffect, useMemo, useRef, useState } from "react";
import { Swiper, type SwiperRef, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import dayjs from "dayjs";
import { useLoginPass } from "@/lib/hooks";

interface iProductCardProps {
  product: Pick<
    IProduct,
    | "id"
    | "title"
    | "price"
    | "isAuction"
    | "startDate"
    | "endDate"
    | "size"
    | "color"
    | "brand"
    | "condition"
    | "status"
    | "seller"
    | "images"
    | "bids"
  >;
  cardType: "default" | "luxury";
  hideCartIcon?: boolean;
  hideInfluencer?: boolean;
  className?: string;
}

export default function ProductCard(props: iProductCardProps) {
  const t = useTranslations();
  const { openModal } = useModalStore();
  const addToCart = useAddToCart();
  const { user } = useGlobalStore();
  const router = useRouter();
  const loginPass = useLoginPass();

  const [imageViewMode, setImageViewMode] = useState(false);
  const swiperRef = useRef<SwiperRef>(null);
  const progressDivRef = useRef<ComponentRef<"div">>(null);
  useEffect(() => {
    if (swiperRef.current) {
      if (imageViewMode) {
        swiperRef.current.swiper.autoplay.start();
      } else {
        swiperRef.current.swiper.autoplay.stop();
      }
    }
  }, [imageViewMode]);
  function onAutoplayTimeLeft(s, time, progress) {
    if (progressDivRef.current) {
      progressDivRef.current.style.right = `${progress * 100}%`;
    }
  }

  const [recalcStatus, setRecalcStatus] = useState(false);
  const auctionStatus: AuctionStatus | null = useMemo(() => {
    if (!props.product.isAuction) return null;
    if (dayjs(props.product.endDate).isBefore(Date.now())) return "ended";
    if (dayjs(props.product.startDate).isAfter(Date.now()))
      return "has-to-start-yet";
    return "started";
  }, [recalcStatus]);

  async function onAddToCart(productId: number) {
    const pass = loginPass();
    if (!pass) return;
    const res = await addToCart.mutateAsync(productId);
    if (res.status === "success") {
      openModal({
        modal: Modal.AddedToCart,
        data: {
          images: props.product.images,
          title: props.product.title,
          price: props.product.price,
        },
      });
    }
  }

  function onCardInfoClick(args: { type: "regular" | "cart" }) {
    if (args.type === "regular" || props.product.isAuction) {
      openModal({
        modal: Modal.Product,
        data: { mode: "product", productId: props.product.id },
      });
    } else if (args.type === "cart") {
      onAddToCart(props.product.id);
    }
  }

  return (
    <div
      key={props.product.id}
      className={cn(
        "relative max-w-[150px] min-[440px]:max-w-[200px] min-[530px]:max-w-[240px] sm:max- w-[280px] pb-4 cursor-pointer",
        props.cardType === "luxury" && "text-white",
        props.className,
      )}
    >
      <div>
        {/* Product Image with Seller Info Overlay */}
        <div
          className="relative h-[220px] min-[440px]:h-[280px] min-[530px]:h-[330px] sm:h-[400px] rounded-lg overflow-hidden  z-0"
          onMouseEnter={() => setImageViewMode(true)}
          onMouseLeave={() => setImageViewMode(false)}
          onClick={() =>
            router.push(`/products/${props.product.id}`, { scroll: true })
          }
        >
          <div className="h-full relative">
            {/* Progress Dash */}
            <div
              ref={progressDivRef}
              className={cn(
                "absolute top-0 left-0 h-1 bg-neutral-100 z-10",
                imageViewMode ? "" : "hidden",
              )}
            ></div>
            <Swiper
              ref={swiperRef}
              className="h-full auctions-featured-swiper"
              modules={[FreeMode, Autoplay]}
              slidesPerView={1}
              spaceBetween={16}
              loop
              autoplay={{
                delay: 2000,
              }}
              speed={800}
              onAutoplayTimeLeft={onAutoplayTimeLeft}
              key={props.product.id + "gallery-swiper"}
            >
              {props.product.images.map((img) => (
                <SwiperSlide key={img.id}>
                  <Image
                    src={imageUrl(img.url) || "/placeholder.svg"}
                    alt={props.product.title}
                    fill
                    className="md:max-h-[600px] object-cover"
                  />
                </SwiperSlide>
              ))}
              <div className="product-modal-pagination absolute bottom-[5%] left-0 right-0 flex justify-center !gap-1 z-10"></div>
            </Swiper>
          </div>
          {/* Seller Info Overlay */}
          {!props.hideInfluencer && props.product.seller.isInfluencer && (
            <div className="absolute top-0 left-0 right-0 p-3 z-10">
              <div className="flex items-center gap-2">
                <Image
                  src={
                    imageUrl(props.product.seller.avatarUrl) ||
                    ASSETS["placeholder.svg"]
                  }
                  alt={props.product.seller.firstName}
                  width={32}
                  height={32}
                  className="rounded-full size-8 aspect-square object-cover object-top"
                />
                <span className="text-sm text-[#424242]">
                  {props.product.seller.firstName}{" "}
                  {props.product.seller.lastName}
                </span>
              </div>
            </div>
          )}
          {/* Timer Bar */}
          {props.product.isAuction && (
            <div className="absolute text-xs text-center left-0 right-0 bottom-0 px-3 py-1 sm:py-2 text-white sm:text-sm bg-black z-10">
              {auctionStatus === "ended" ? (
                <p>{t("auctions.auction-ended")}</p>
              ) : (
                <>
                  {auctionStatus === "has-to-start-yet"
                    ? t("common.starts-in")
                    : t("common.ends-in")}{" "}
                  <Countdown
                    date={
                      auctionStatus === "has-to-start-yet"
                        ? `${props.product.startDate}`
                        : `${props.product.endDate}`
                    }
                    renderer={({ days, hours, minutes, seconds }) => (
                      <p className="min-[440px]:inline">
                        {days}d : {hours}h : {minutes}m : {seconds}s
                      </p>
                    )}
                    onComplete={() => setRecalcStatus((prev) => !prev)}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div
        className={cn(
          "p-3 rounded-lg transition-all group space-y-2 hover:shadow-lg hover:scale-110 hover:-translate-y-5",
          props.cardType === "default"
            ? "bg-white"
            : props.cardType === "luxury"
              ? "hover:bg-[#323232]"
              : "",
        )}
        onClick={() => onCardInfoClick({ type: "regular" })}
      >
        <h3
          className={cn(
            "text-sm",
            props.cardType === "default"
              ? "text-[#424242]"
              : props.cardType === "luxury"
                ? "text-[#B6B6B6]"
                : "",
          )}
        >
          {props.product.title}
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 mb-1">
          <div className="flex-1 flex justify-between items-center">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 ">
              {props.product.isAuction && (
                <span className="text-sm">{t("product.info.from")}</span>
              )}
              <span className="font-bold">
                {formatCurrency(props.product.price)}
              </span>
            </div>

            {/*<button
              className={cn(
                "w-10 h-10 rounded-full bg-[#D9D9D9] group-hover:bg-[#E4F6D9] flex items-center justify-center",
                props.hideCartIcon && "hidden",
              )}
              aria-label="Add to cart"
              // onClick={() => onCardInfoClick({ type: "cart" })}
            >
              <Image
                src={ASSETS["shopping-cart-black-2.svg"] || "/placeholder.svg"}
                alt="Add to cart"
                width={20}
                height={20}
              />
            </button>*/}
          </div>
        </div>
        <div className="text-[#1374aa] capitalize text-sm">
          <span className="hover:underline">
            {t("product.info.size")} {props.product.size}
          </span>
          {props.product.color && (
            <>
              {" | "}
              <span className="hover:underline">{props.product.color}</span>
            </>
          )}
          {props.product.brand && (
            <>
              {" | "}
              <span className="hover:underline">{props.product.brand}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
