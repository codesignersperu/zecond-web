"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ASSETS } from "@/lib/constants";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { OrderStatus } from "@/app/[locale]/user-dashboard/sales/orders/[id]/page";

interface OrderStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  orderDate: string;
  productImage: string;
  currentStatus: OrderStatus;
  onUpdateStatus: (status: OrderStatus) => void;
}

export function OrderStatusModal({
  open,
  onOpenChange,
  orderId,
  orderDate,
  productImage,
  currentStatus,
  onUpdateStatus,
}: OrderStatusModalProps) {
  const t = useTranslations();
  const [selectedStatus, setSelectedStatus] =
    useState<OrderStatus>(currentStatus);

  const statuses = [
    { status: t("common.on-waiting"), color: "[#FFD8B9]" },
    { status: t("common.failed"), color: "[#FFB9B9]" },
    { status: t("common.processing"), color: "[#B9EEFF]" },
    { status: t("common.completed"), color: "[#B9FFD3]" },
  ];

  const handleUpdateStatus = () => {
    onUpdateStatus(selectedStatus);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[350px] sm:max-w-md rounded-2xl">
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

        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {t("common.order-status")}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Order Details */}
          <div className="flex w-fit mx-auto items-center gap-4">
            <div className="w-[105px] aspect-square overflow-hidden flex">
              <Image
                src={productImage || "/placeholder.svg"}
                alt="Product"
                width={105}
                height={105}
                className="rounded-lg object-cover object-center"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                {t("common.order")} #{orderId}
              </h3>
              <p className="text-gray-600">{orderDate}</p>
            </div>
          </div>

          {/* Status Options */}
          <div className="space-y-3">
            {statuses.map(({ status, color }) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status as OrderStatus)}
                className={`w-full rounded-full py-3 px-6 text-center font-medium transition-all
                            bg-${color}
                            ${selectedStatus === status ? "ring-2 ring-" + color + " ring-offset-2" : "hover:opacity-90"}
                          `}
              >
                <div className="flex items-center justify-between">
                  <span className="uppercase">{status}</span>
                  {selectedStatus === status && (
                    <Image
                      src={ASSETS["tick-black.svg"] || "/placeholder.svg"}
                      alt="Selected"
                      width={20}
                      height={20}
                    />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Update Button */}
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full uppercase py-2 rounded-full"
            variant="outline"
          >
            <Image
              src={ASSETS["update-black.svg"] || "/placeholder.svg"}
              alt=""
              width={20}
              height={20}
              className="mr-2"
            />
            {t("common.update")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
