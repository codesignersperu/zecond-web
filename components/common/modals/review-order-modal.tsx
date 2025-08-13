"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { cn, imageUrl } from "@/lib/utils";
import { ASSETS } from "@/lib/constants";
import { Modal, useModalStore } from "@/lib/stores";
import dayjs from "dayjs";
import { useUpdateReview } from "@/lib/mutations";

export default function ReviewOrderModal() {
  const t = useTranslations();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const updateReveiw = useUpdateReview();
  const {
    currentOpenedModal,
    reviewProductModalData: data,
    closeModal,
  } = useModalStore();
  const ratingText = [
    "",
    t("common.poor"),
    t("common.regular"),
    t("common.average"),
    t("common.good"),
    t("common.excellent"),
  ];

  useEffect(() => {
    if (data) {
      console.log("data: ", data);
      if (data.rating) {
        setRating(data.rating);
      } else {
        setRating(0);
      }
    }
  }, [data]);

  const handleSubmit = async () => {
    if (data) {
      await updateReveiw.mutateAsync({ id: data.id, rating });
      closeModal();
    }
  };

  return (
    <Dialog
      open={currentOpenedModal === Modal.ReviewProduct}
      onOpenChange={closeModal}
    >
      <DialogContent className="max-w-md p-0 rounded-2xl">
        {/* Close Button */}
        <DialogClose className="absolute  w-10 h-10 right-2 top-2 rounded-full bg-black flex justify-center items-center opacity-100 transition-opacity hover:opacity-70 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <Image
            src={ASSETS["cross-white.svg"] || "/placeholder.svg"}
            alt="ZECOND CLOSET SALE"
            width={14}
            height={14}
          />
          <span className="sr-only">Close</span>
        </DialogClose>

        <div className="p-8 space-y-8">
          {/* Header */}
          <h2 className="text-2xl font-bold text-center">
            {t("dashboard.my-orders.leave-a-review")}
          </h2>

          {/* Order Info */}
          <div className="flex items-center gap-6">
            <div className="w-[120px] h-[160px] bg-[#F8F8F8] rounded-lg overflow-hidden">
              <Image
                src={
                  imageUrl(data?.product.images[0].url) || "/placeholder.svg"
                }
                alt="Product"
                width={120}
                height={160}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {t("common.order")} #{data?.order.id}
              </h3>
              <p className="">
                {dayjs(data?.order.createdAt).format("DD MMM, YYYY")}
              </p>
            </div>
          </div>

          {/* Rating Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">
              {t("common.qualification")}
            </h3>
            <div className="flex flex-col items-center gap-4">
              {/* Star Rating */}
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="relative"
                  >
                    <Star
                      className={cn(
                        "w-7 h-7 transition-colors",
                        (hoveredRating ? star <= hoveredRating : star <= rating)
                          ? "fill-[#FFD700] text-[#FFD700]"
                          : "fill-none text-black",
                      )}
                    />
                  </button>
                ))}
              </div>
              {/* Rating Text */}
              <p className="text-lg uppercase font-semibold h-8">
                {rating > 0 && ratingText[rating]}
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="w-full uppercase bg-black hover:bg-black/90 text-white rounded-full h-14"
          >
            {data?.status === "reviewed"
              ? t("common.update")
              : t("common.send")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
