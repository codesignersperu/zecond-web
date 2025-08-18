"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ASSETS } from "@/lib/constants";
import { formatCurrency, imageUrl } from "@/lib/utils";
import { Modal, useModalStore } from "@/lib/stores";
import dayjs from "dayjs";

export default function AuctionItModal() {
  const t = useTranslations();
  const locale = useLocale();
  const {
    currentOpenedModal,
    closeModal,
    auctionItModalData: data,
  } = useModalStore();
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return null;
    return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <Dialog
      open={currentOpenedModal === Modal.AuctionIt}
      onOpenChange={closeModal}
    >
      <DialogContent className="max-w-[350px] sm:max-w-[480px] rounded-2xl p-0 bg-[#FDFDFD]">
        {/* Close Button */}
        <DialogClose className="absolute w-7 h-7 sm:w-10 sm:h-10 right-2 top-2 rounded-full bg-black flex justify-center items-center opacity-100 transition-opacity hover:opacity-70 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <Image
            src={ASSETS["cross-white.svg"] || "/placeholder.svg"}
            alt="Close Modal"
            width={14}
            height={14}
            className="w-[10px] h-[10px] sm:w-[10px] sm:h-[10px]"
          />
          <span className="sr-only">Close</span>
        </DialogClose>

        <div className="px-8 py-4 sm:p-8 space-y-4">
          {/* Header */}
          <div className="flex flex-col items-center justify-center gap-3">
            <Image
              src={ASSETS["auction-black.svg"] || "/placeholder.svg"}
              alt="Auction"
              width={60}
              height={60}
              className="w-12 sm:w-16"
            />
            <h2 className="text-2xl font-bold">{t("common.auction")}</h2>
          </div>

          {/* Product Image */}
          <div className="flex justify-center">
            <Image
              src={imageUrl(data?.product?.images[0].url) || "/placeholder.svg"}
              alt={data?.product?.title || ""}
              width={130}
              height={130}
              className="w-[120px] h-[150px] object-cover object-center rounded-lg"
            />
          </div>

          {/* Product Title */}
          <h3 className="text-xl font-medium text-center">
            {data?.product?.title || ""}
          </h3>

          {/* Base Price */}
          <div className="space-y-1 flex flex-col px-4 py-2 sm:p-4 rounded-xl border border-[#bfbfbf] bg-white">
            <p className="text-[#898989]">{t("common.base-price")}</p>
            <p className="sm:w-auto text-2xl font-bold focus:outline-none">
              {formatCurrency(data?.product?.price || 0)}
            </p>
          </div>

          {/* Auction Time */}
          <div className="space-y-1 px-4 py-2 sm:p-4 rounded-xl border border-[#bfbfbf] bg-white flex justify-between items-start sm:items-end">
            <div>
              <p className="text-[#898989] mb-3">{t("common.auction-time")}</p>
              <p className="text-lg leading-none grid grid-cols-[70px_1fr] gap-[8px_4px]">
                <span>{t("common.starts")}: </span>
                <span>
                  {formatDate(dayjs(data?.product.startDate).toDate())}
                </span>
                <span>{t("common.ends")}: </span>
                <span>{formatDate(dayjs(data?.product.endDate).toDate())}</span>
              </p>
            </div>
            <div>
              <Image
                src={ASSETS["clock-black.svg"] || "/placeholder.svg"}
                alt="Clock"
                width={22}
                height={22}
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <Button
              className="px-8 h-11 uppercase sm:h-14 bg-[#009045] hover:bg-[#009045]/90 rounded-full text-lg"
              onClick={() => {
                data?.onSubmit();
                closeModal();
              }}
            >
              <Image
                src={ASSETS["flash-white.svg"] || "/placeholder.svg"}
                alt="Lightning"
                width={20}
                height={20}
                className="mr-2"
              />
              {t("common.auction")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
