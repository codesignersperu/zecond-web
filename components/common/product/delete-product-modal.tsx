"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ASSETS } from "@/lib/constants";
import type { IProduct } from "@/lib/types";
import { imageUrl } from "@/lib/utils";

interface DeleteProductProps {
  isOpen: boolean;
  onClose: () => void;
  product: Pick<IProduct, "images" | "title" | "price">;
}

export default function DeleteProductModal({
  isOpen,
  onClose,
  product,
}: DeleteProductProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[350px] sm:max-w-[480px] rounded-2xl p-0 pt-8 bg-[#FDFDFD]">
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

        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="space-y-6 max-w-[300px] mx-auto">
            <h2 className="text-3xl text-center font-bold">
              Eliminar publicación
            </h2>
            <p className="font-bold text-center">
              ¿Confirmas que quieres eliminar esta publicación?
            </p>
          </div>

          {/* Product Image */}
          <div className="flex justify-center">
            <Image
              src={imageUrl(product?.images[0].url) || "/placeholder.svg"}
              alt={product?.title || ""}
              width={130}
              height={130}
              className="w-[130px] h-auto rounded-lg"
            />
          </div>

          {/* Product Title */}
          <div className="space-y-1">
            <h3 className="text-xl font-light text-center">
              {product?.title || ""}
            </h3>
            <p className="text-xl font-bold text-center">
              ${product?.price || "0.00"}
            </p>
          </div>

          {/* Action Button */}
          <div className="flex justify-center gap-5">
            <Button
              className="px-8 h-14 bg-neutral-400 text-white rounded-full text-lg"
              onClick={onClose}
            >
              SUBASTAR
            </Button>
            <Button
              className="px-8 h-14 bg-black text-white rounded-full text-lg"
              onClick={onClose}
            >
              ELIMINAR
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
