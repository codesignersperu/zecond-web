import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ASSETS } from "@/lib/constants";
import { useModalStore, Modal } from "@/lib/stores";
import { imageUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuctionWonModal() {
  const t = useTranslations();
  const {
    currentOpenedModal,
    closeModal,
    auctionWonModalData: data,
  } = useModalStore();
  const router = useRouter();
  const locale = useLocale();

  return (
    <Dialog
      open={currentOpenedModal === Modal.AuctionWon}
      onOpenChange={closeModal}
    >
      <DialogContent
        className="max-w-[350px] px-[30px] py-[60px] pb-[30px] gap-0 !space-y-0 bg-white
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
              src={ASSETS["auction-black.svg"]}
              width={60}
              height={60}
              alt="Check"
            />
          </div>

          <DialogHeader className="text-2xl font-bold mb-6 !text-center line-clamp-2">
            {t("common.congratulations")}
          </DialogHeader>
          <p className="font-bold text-center mb-6">
            {t("auctions.auction-won-para")}
          </p>
          <div className="flex justify-center mb-2">
            <Image
              src={data ? imageUrl(data.productImage) : "/placeholder.svg"}
              width={158}
              height={158}
              alt="Check"
              className="w-[158px] h-[172px] object-cover object-center rounded-xl"
            />
          </div>
          <p className="text-xl text-center">{data?.productTitle}</p>
          <p className="text-xl font-bold text-center mb-6">
            $ {data?.amount.toFixed(2)}
          </p>
          <div className="flex flex-col gap-2 justify-center">
            <Link href={`/${locale}/cart`} scroll>
              <Button
                className="bg-neutral-200 w-full hover:bg-neutral-200/50 text-black rounded-full h-12 flex items-center justify-center uppercase"
                onClick={closeModal}
              >
                {t("cart-dropdown.view-cart")}
              </Button>
            </Link>
            <Link href={`/${locale}/checkout?ids=`} scroll>
              <Button
                className="rounded-full w-full h-12 bg-[#39ab75] hover:bg-[#39ab75]/90 flex items-center justify-center uppercase"
                onClick={closeModal}
              >
                <Image
                  src={ASSETS["credit-card-white.svg"] || "/placeholder.svg"}
                  alt="Credit Card"
                  width={30}
                  height={30}
                  className="mr-2"
                />
                {t("cart-dropdown.checkout")}
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
