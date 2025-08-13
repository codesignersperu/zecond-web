import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ASSETS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";

export default function BidPlacedModal(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bidAmount: string;
}) {
  const t = useTranslations();
  const locale = useLocale();
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
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent
        className="max-w-[350px] px-[10px] py-[60px] pb-[30px] gap-0 !space-y-0 bg-white
      !rounded-[20px]"
      >
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
        <div>
          <div className="flex justify-center mb-2">
            <Image
              src={ASSETS["check.svg"]}
              width={60}
              height={60}
              alt="Check"
            />
          </div>
          <DialogHeader className="text-2xl font-bold mb-6 !text-center">
            {t("common.offer-sent")}
          </DialogHeader>
          <p className="text-xl text-center">{t("common.your-offer")}</p>
          <p className="text-xl font-bold text-center mb-6">
            ${props.bidAmount}
          </p>
          <time className="text-center block mb-2 max-w-[230px] mx-auto font-semibold">
            {formatDate(new Date())}
          </time>
          <div className="flex justify-center">
            <Button
              className="rounded-full uppercase h-[44px] justify-center border border-black bg-black hover:bg-black/90"
              onClick={() => props.onOpenChange(false)}
            >
              {t("common.see-my-offers")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
