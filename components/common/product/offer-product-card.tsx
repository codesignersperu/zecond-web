"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useGlobalStore } from "@/lib/stores";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ASSETS } from "@/lib/constants";
import Countdown from "react-countdown";
import { cn, imageUrl } from "@/lib/utils";
import type { AuctionStatus, IProduct } from "@/lib/types";
import dayjs from "dayjs";
import { useLoginPass } from "@/lib/hooks";
import { Button } from "@/components/ui/button";

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
    | "totalBids"
    | "myHighestBid"
    | "seller"
    | "images"
    | "bids"
  >;
  hideInfluencer?: boolean;
  className?: string;
}

export default function OfferProductCard(props: iProductCardProps) {
  const t = useTranslations();
  const { user } = useGlobalStore();
  const router = useRouter();
  const loginPass = useLoginPass();

  const [recalcStatus, setRecalcStatus] = useState(false);
  const auctionStatus: AuctionStatus | null = useMemo(() => {
    if (!props.product.isAuction) return null;
    if (dayjs(props.product.endDate).isBefore(Date.now())) return "ended";
    if (dayjs(props.product.startDate).isAfter(Date.now()))
      return "has-to-start-yet";
    return "started";
  }, [recalcStatus]);

  return (
    <div
      key={props.product.id}
      className={cn(
        "relative max-w-[150px] min-[440px]:max-w-[200px] min-[530px]:max-w-[240px] sm:max- w-[280px] pb-4",
        props.className,
      )}
    >
      <div>
        {/* Product Image with Seller Info Overlay */}
        <div
          className="cursor-pointer relative h-[220px] min-[440px]:h-[280px] min-[530px]:h-[330px] sm:h-[400px] rounded-lg overflow-hidden  z-0"
          onClick={() =>
            router.push(`/products/${props.product.id}`, { scroll: true })
          }
        >
          <div className="h-full relative">
            <Image
              src={imageUrl(props.product.images[0].url) || "/placeholder.svg"}
              alt={props.product.title}
              fill
              className="md:max-h-[600px] object-cover"
            />
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
          "p-3 rounded-lg bg-white transition-all group space-y-1 hover:shadow-lg hover:scale-110 hover:-translate-y-5",
        )}
      >
        <h3 className={cn("text-sm text-[#424242]")}>{props.product.title}</h3>
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

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 ">
          <p className="text-sm text-nowrap">
            {t("dashboard.my-offers.my-offer")} :
          </p>

          <p className="font-bold text-sm text-right">
            ${props.product.myHighestBid || "-"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 ">
          <p className="text-sm text-nowrap">{t("auctions.highest-bid")}:</p>

          <div>
            <p className="font-bold text-sm text-right">
              ${props.product.bids[0]?.amount.toFixed(2) || "-"}
            </p>
            {props.product.bids[0]?.bidderId === user?.id && (
              <p className="text-muted-foreground font-normal text-right text-nowrap">
                (👑 {t("common.you")})
              </p>
            )}
          </div>
        </div>

        {auctionStatus === "started" && (
          <Button
            className="rounded-full w-full !mt-3"
            type="button"
            onClick={() =>
              router.push(`/products/${props.product.id}`, { scroll: true })
            }
          >
            {t("auctions.bid-now")}
          </Button>
        )}
      </div>
    </div>
  );
}
