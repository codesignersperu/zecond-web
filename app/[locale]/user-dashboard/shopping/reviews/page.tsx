"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useGetMyReviews } from "@/lib/queries";
import { PulseLoader } from "react-spinners";
import { imageUrl } from "@/lib/utils";
import ReviewOrderModal from "@/components/common/modals/review-order-modal";
import { Modal, useModalStore } from "@/lib/stores";

export default function ReviewsPage() {
  const t = useTranslations();
  const { openModal } = useModalStore();
  const { data: reviews, isLoading, isError } = useGetMyReviews();
  return (
    <div className="space-y-6">
      <h1 className="text-center sm:text-left text-2xl font-bold">
        {t("navigation.dashboard.reviews")}
      </h1>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex py-12 sm:py-16 justify-center items-center">
            <PulseLoader color="#d9d9d9" />
          </div>
        ) : !reviews?.data.length ? (
          <div className="flex py-12 sm:py-16 justify-center items-center">
            <p className="text-center text-gray-500">
              {t("common.no-data-atm")}
            </p>
          </div>
        ) : (
          reviews?.data.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 sm:gap-0 sm:flex-row items-center justify-between py-6 border-b border-[#E5E5E5] last:border-b-0"
            >
              <div className="w-[106px] h-[106px] bg-[#F8F8F8] rounded-xl overflow-hidden">
                <Image
                  src={
                    imageUrl(item.product.images[0].url) || "/placeholder.svg"
                  }
                  alt={item.product.title}
                  width={106}
                  height={106}
                  className="size-full object-cover object-top"
                />
              </div>
              <h3 className="text-[#424242] mb-1 line-clamp-2">
                {item.product.title}
              </h3>
              <p className="text-[#424242] font-bold">
                $
                {(item.product.isAuction
                  ? item.product.bids[0].amount
                  : item.product.price
                ).toFixed()}
              </p>
              <Button
                variant={item.status === "reviewed" ? "secondary" : "default"}
                className={`rounded-full px-8 ${
                  item.status === "reviewed"
                    ? "bg-[#40C98E] text-white hover:bg-[#40C98E]/90"
                    : "bg-[#FF7E54] text-white hover:bg-[#FF7E54]/90"
                }`}
                onClick={() =>
                  openModal({
                    modal: Modal.ReviewProduct,
                    data: item,
                  })
                }
              >
                {item.status === "reviewed"
                  ? t("dashboard.my-orders.view-review")
                  : t("dashboard.my-orders.leave-a-review")}
              </Button>
            </div>
          ))
        )}
      </div>
      <ReviewOrderModal />
    </div>
  );
}
