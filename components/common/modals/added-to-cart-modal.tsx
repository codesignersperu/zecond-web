import Image from "next/image";
import { useTranslations } from "next-intl";
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

export default function AddedToCartModal() {
  const t = useTranslations();
  const {
    currentOpenedModal,
    closeModal,
    addedToCartModalProduct: product,
  } = useModalStore();
  const router = useRouter();

  return (
    <Dialog
      open={currentOpenedModal === Modal.AddedToCart}
      onOpenChange={closeModal}
    >
      <DialogContent
        className="max-w-[350px] px-8 py-[60px] pb-[30px] gap-0 !space-y-0 bg-white
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
            {t("common.added-to-cart")}
          </DialogHeader>
          <div className="flex justify-center mb-2">
            <Image
              src={
                product ? imageUrl(product.images[0].url) : "/placeholder.svg"
              }
              width={158}
              height={158}
              alt="Check"
              className="w-[158px] h-[172px] object-cover object-center rounded-xl"
            />
          </div>
          <p className="text-xl text-center">{product?.title}</p>
          <p className="text-xl font-bold text-center mb-6">
            $ {product?.price}
          </p>
          <div className="flex flex-col gap-2 justify-center">
            <Button
              className="bg-neutral-200 text-black hover:bg-neutral-300 hover:text-black rounded-full h-12 flex items-center justify-center uppercase"
              onClick={() => {
                router.push("/cart", { scroll: true });
                closeModal();
              }}
            >
              {t("cart-dropdown.view-cart")}
            </Button>
            <Button
              className="rounded-full h-12 bg-[#39ab75] hover:bg-[#39ab75]/90 flex items-center justify-center uppercase"
              onClick={() => {
                router.push("/checkout", { scroll: true });
                closeModal();
              }}
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
