"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { ASSETS } from "@/lib/constants";
import { OrderItem } from "@/lib/types";
import { imageUrl } from "@/lib/utils";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
}

export default function OrderDetailsModal({
  isOpen,
  onClose,
  items,
}: OrderDetailsModalProps) {
  const t = useTranslations();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[350px] max-h-[80vh] overflow-y-scroll min-[470px]:max-w-[400px] rounded-2xl sm:max-w-xl p-0 gap-0">
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

        {/* Header */}
        <DialogHeader className="px-3 pt-4">
          <h2 className="text-2xl text-center font-bold">
            {t("common.order-details")}
          </h2>
        </DialogHeader>

        {/* Items List */}
        <div className="p-6 max-h-[600px] overflow-y-auto">
          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-6 shadow-shadow-1 p-4 bg-white rounded-xl"
              >
                {/* Product Image */}
                <div className="flex items-center gap-3">
                  <div className="rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={
                        imageUrl(item.product.images[0].url) ||
                        "/placeholder.svg"
                      }
                      alt={item.product.title}
                      width={120}
                      height={120}
                      className="w-[100px] aspect-[3/3.75] object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-light mb-2">
                      {item.product.title}
                    </h3>
                    <div className="space-y-1 text-[#424242]">
                      <p className="font-bold text-sm">
                        Talla: {item.product.size}
                      </p>
                      <p className="font-bold text-sm">
                        Color: {item.product.color}
                      </p>
                      <p className="font-bold text-sm">
                        Marca: {item.product.brand}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Quantity and Price */}
                <div className="flex items-center gap-8">
                  <p className="text-base font-bold">
                    <span className="sm:hidden mr-1">{t("common.qty")}:</span>1
                  </p>
                  <p className="text-base font-bold">
                    <span className="sm:hidden mr-1">{t("common.price")}:</span>
                    $ {item.product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
