"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { imageUrl, cn } from "@/lib/utils";
import { ASSETS } from "@/lib/constants";
import Countdown from "react-countdown";
import { Ellipsis } from "lucide-react";
import { ProductAction } from "@/app/[locale]/user-dashboard/sales/publications/page";
import { AuctionStatus, type IProduct, ProductStatus } from "@/lib/types";
import { useMemo } from "react";
import dayjs from "dayjs";

type SalesProductCardProps = Pick<
  IProduct,
  | "id"
  | "images"
  | "title"
  | "price"
  | "status"
  | "isAuction"
  | "startDate"
  | "endDate"
  | "bids"
  | "totalBids"
> & {
  productAction: (productId: number, action: ProductAction) => void;
  openActionDrawer: (productId: number) => void;
};

const statusStyles = {
  pending_approval: "bg-neutral-400 text-white hover:bg-neutral-400",
  sold: "bg-[#40C98E] text-white hover:bg-[#40C98E]/90",
  ongoing: "bg-black text-white hover:bg-black/90",
  auction: "bg-[#FFEE97] text-black hover:bg-[#FED843]/90",
  draft: "bg-[#aef] text-black hover:bg-[#aef]/90",
};

export default function SalesProductCard({
  id,
  images,
  title,
  price,
  status,
  isAuction,
  startDate,
  endDate,
  bids,
  totalBids,
  productAction,
  openActionDrawer,
}: SalesProductCardProps) {
  const t = useTranslations();
  const statusText = {
    [ProductStatus.PENDING_APPROVAL]: t("product.status.pending-approval"),
    [ProductStatus.SOLD]: t("product.status.sold"),
    [ProductStatus.LIVE]: t("product.status.live"),
    auction: t("product.status.auction"),
    [ProductStatus.DRAFT]: t("product.status.draft"),
  };

  const auctionStatus: AuctionStatus | null = useMemo(() => {
    if (!isAuction) return null;
    if (dayjs(endDate).isBefore(Date.now())) return "ended";
    if (dayjs(startDate).isAfter(Date.now())) return "has-to-start-yet";
    return "started";
  }, []);

  return (
    <div className="space-y-4 transition-transform rounded-2xl bg-neutral-100 sm:bg-transparent hover:scale-105 ">
      <div className="relative group hover:shadow-md p-3 sm:p-6 rounded-2xl hover:rounded-b-0">
        {/* Product Image */}
        <div className="relative mb-1 aspect-[3/4] w-full overflow-hidden rounded-lg bg-[#F8F8F8] z-0 sm:-z-10">
          <img
            src={imageUrl(images[0].url) || "/placeholder.svg"}
            alt={title}
            className="object-cover"
          />
          {status === ProductStatus.LIVE && isAuction && (
            <div className="absolute bottom-0 left-0 right-0 bg-black p-2 text-center text-xs font-bold text-white">
              {auctionStatus === "ended" ? (
                t("auctions.auction-ended")
              ) : (
                <>
                  {auctionStatus === "has-to-start-yet"
                    ? t("common.starts-in")
                    : t("common.ends-in")}
                  <br />
                  <Countdown
                    date={
                      (auctionStatus === "has-to-start-yet"
                        ? startDate
                        : endDate) as string
                    }
                    renderer={({ days, hours, minutes, seconds }) => (
                      <span>
                        {days}d : {hours}h : {minutes}m : {seconds}s
                      </span>
                    )}
                  />
                </>
              )}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <div>
            <h3 className="text-[#7e7e7e] text-sm">{title}</h3>
            <div className="flex justify-between items-center">
              <p className="text-sm font-bold">${price}</p>
              {/* 3 dots menu */}
              <div
                className="flex sm:hidden justify-center items-center p-[2px] rounded-full bg-[#f4f4f4] cursor-pointer text-neutral-500"
                onClick={() => openActionDrawer(id)}
              >
                <Ellipsis className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Status Button */}
          {[
            ProductStatus.PENDING_APPROVAL,
            ProductStatus.SOLD,
            ProductStatus.LIVE,
            ProductStatus.DRAFT,
          ].includes(status) && (
            <Button
              className={cn(
                "w-full rounded-full uppercase font-bold",
                statusStyles[status],
              )}
              onClick={() => productAction(id, status)}
            >
              {status === ProductStatus.DRAFT && isAuction ? (
                <>
                  <Image
                    src={ASSETS["flash-black.svg"] || "/placeholder.svg"}
                    alt="Lightning"
                    width={16}
                    height={16}
                    className="mr-2"
                  />
                  {statusText.auction}
                </>
              ) : (
                statusText[status]
              )}
            </Button>
          )}

          {/* Auction Info */}
          {status === ProductStatus.LIVE && isAuction && (
            <div className="space-y-1 text-sm text-[#424242]">
              <p>
                {t("auctions.number-of-proposals")}: {totalBids}
              </p>
              {bids.length && (
                <p>
                  {t("auctions.highest-bid")}:{" "}
                  <span className="font-bold">
                    ${bids[0].amount.toFixed(2)}
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="hidden sm:flex md:absolute px-6 pb-6 top-[92%] left-0 right-0 md:hidden md:group-hover:flex md:group-hover:shadow-md md:group-hover:rounded-b-2xl flex-col items-center bg-white z-20 gap-2">
            {status === "draft" && (
              <Button
                variant="outline"
                className="flex-1 w-full rounded-full border-[#424242] hover:bg-transparent hover:text-[#424242]"
                onClick={() => productAction(id, "delete")}
              >
                <Image
                  src={ASSETS["trash-solid-black.svg"] || "/placeholder.svg"}
                  alt="Delete"
                  width={16}
                  height={16}
                  className="mr-2"
                />
                {t("common.delete")}
              </Button>
            )}
            <Button
              className="flex-1 flex justify-center bg-white text-black items-center gap-2 w-full rounded-full border py-[6px] border-[#424242] hover:bg-transparent hover:text-[#424242]"
              onClick={() => productAction(id, "edit")}
            >
              <Image
                src={ASSETS["edit-black.svg"] || "/placeholder.svg"}
                alt="Edit"
                width={16}
                height={16}
                className="mr-2"
              />
              {t("common.edit")}
            </Button>
            <Button
              variant="outline"
              className="flex-1 w-full rounded-full border-[#424242] hover:bg-transparent hover:text-[#424242]"
              onClick={() => productAction(id, "compare")}
            >
              <Image
                src={ASSETS["out-link-black.svg"] || "/placeholder.svg"}
                alt="Edit"
                width={16}
                height={16}
                className="mr-2"
              />
              {t("common.compare")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
