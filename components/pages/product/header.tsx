"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import Countdown from "react-countdown";
import { ASSETS } from "@/lib/constants";
import ProductInfo from "@/components/common/product/product-info";
import SizeGuideModal from "@/components/common/modals/size-guide-modal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, FreeMode } from "swiper/modules";
import { Search } from "lucide-react";
import { useModalStore, Modal, useGlobalStore } from "@/lib/stores";
import { imageUrl, cn, formatCurrency } from "@/lib/utils";
import { useGetProduct, useGetProducts } from "@/lib/queries";
import { PulseLoader } from "react-spinners";
import type {
  AuctionStatus,
  HttpResponse,
  IProduct,
  ISeller,
} from "@/lib/types";
import ProductCard from "@/components/common/product/product-card";
import { useEffect, useMemo, useState } from "react";
import { useAddToCart, useBidOnAuction } from "@/lib/mutations";
import toast from "react-hot-toast";
import { useMediaQuery } from "usehooks-ts";
import dayjs from "dayjs";
import AutoWidthInput from "@/components/common/auto-width-input";
import { useBidSocket } from "@/lib/hooks";
import { useLoginPass } from "@/lib/hooks";
import BidPlacedModal from "@/components/common/modals/bid-placed-modal";

interface IHeader {
  productId: string;
}

export default function Header(props: IHeader) {
  const t = useTranslations();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [additionalInfoModal, setAdditionalInfoModal] = useState(false);

  const { openModal } = useModalStore();
  const { setBrowsingHistory } = useGlobalStore();
  const addToCart = useAddToCart();
  const bid = useBidOnAuction();
  const { user } = useGlobalStore();
  const loginPass = useLoginPass();
  const locale = useLocale();

  const {
    data: product,
    isLoading: productLoading,
    isError: productError,
    error,
    isSuccess: productSuccess,
  } = useGetProduct(props.productId);

  // Setting browsing history
  useEffect(() => {
    if (productSuccess) {
      setBrowsingHistory(product.data);
    }
  }, [productSuccess]);

  const [recalcStatus, setRecalcStatus] = useState(false);
  const [bidPlacedOpen, setBidPlacedOpen] = useState(false);
  const auctionStatus: AuctionStatus | null = useMemo(() => {
    if (!product?.data || !product?.data.isAuction) return null;
    if (dayjs(product.data.endDate).isBefore(Date.now())) return "ended";
    if (dayjs(product.data.startDate).isAfter(Date.now()))
      return "has-to-start-yet";
    return "started";
  }, [product?.data, recalcStatus]);

  const biddingEndsAt = useMemo(
    () =>
      auctionStatus
        ? auctionStatus === "has-to-start-yet"
          ? (product?.data.startDate as string)
          : auctionStatus === "started"
            ? (product?.data.endDate as string)
            : ""
        : "",
    [auctionStatus],
  );

  async function onAddToCart(productId: number) {
    const pass = await loginPass();
    if (!pass) return;
    const res = await addToCart.mutateAsync(productId);
    if (res.status === "success") {
      openModal({
        modal: Modal.AddedToCart,
        data: {
          images: product?.data.images || [],
          title: product?.data.title || "",
          price: product?.data.price || 0,
        },
      });
    }
  }

  const { totalBids, highestBid, price, handlePriceChange } = useBidSocket({
    product: product?.data,
  });

  async function onBid() {
    if (!product?.data) return;
    const res = await loginPass<HttpResponse>(async () =>
      bid.mutateAsync({
        productId: product.data.id,
        amount: parseFloat(price),
      }),
    );
    if (!res) return;
    if (res.status === "success") {
      setBidPlacedOpen(true);
    }
  }

  return (
    <>
      <div className="mx-auto sm:px-4 sm:pt-14 pb-20 bg-[#f3f3f3]">
        {productLoading ? (
          <div className="flex justify-center items-center h-[600px]">
            <PulseLoader color="#d9d9d9" />
          </div>
        ) : productError ? (
          <div className="flex justify-center items-center h-[600px]">
            {error.message}
          </div>
        ) : product?.data ? (
          <div className="flex flex-col justify-center mx-auto lg:w-fit min-[1080px]:grid lg:grid-cols-[530px_530px] min-[1130px]:grid-cols-[615px_615px] gap-16">
            {/* Left Column - Product Images Slide */}
            <div className="flex-1 overflow-y-visible sm:max-w-[530px] min-[1130px]:max-w-[615px] sm:mx-auto">
              <div className="relative">
                <Swiper
                  className="product-slide-swiper"
                  modules={[Navigation, Pagination, FreeMode]}
                  slidesPerView={1}
                  spaceBetween={16}
                  pagination={{
                    clickable: true,
                    el: ".product-slide-pagination",
                  }}
                >
                  {product.data.images.map((image, idx) => (
                    <SwiperSlide
                      key={idx}
                      className="relative flex justify-items-center"
                    >
                      <img
                        src={imageUrl(image.url) || "/placeholder.svg"}
                        alt={product.data.title}
                        className="flex-1 w-[615px] sm:rounded-3xl !aspect-[4/5] object-cover object-bottom"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute hidden sm:block z-10 bottom-4 right-4 p-1 rounded-full"
                >
                  <Search className="h-4 w-4" />
                </Button>
                <div className="hidden sm:flex absolute !-bottom-10 left-0 product-slide-pagination justify-center space-x-1 w-full h-5"></div>
              </div>
            </div>

            {/* Right Column */}
            <div className="sm:mx-auto lg:mx-0 xl:mx-auto sm:max-w-[450px] px-5 sm:px-0">
              {/* - Product Info */}
              {isMobile ? (
                <ProductInfo
                  product={product.data}
                  cardType={"page-mobile"}
                  auctionStatus={auctionStatus}
                  biddingEndsAt={biddingEndsAt}
                  setRecalcStatus={() => setRecalcStatus((prev) => !prev)}
                />
              ) : (
                <ProductInfo
                  product={product.data}
                  cardType={"page"}
                  className="pt-0"
                />
              )}

              <Button
                variant="outline"
                className="w-full flex items-center pl-6 justify-between sm:justify-center uppercase gap-2 h-14 rounded-full border-[#424242] mb-4"
                onClick={() =>
                  openModal({ modal: Modal.SizeGuide, data: product.data })
                }
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={ASSETS["size-guide-black.svg"] || "/placeholder.svg"}
                    alt="Size Guide"
                    width={24}
                    height={24}
                  />
                  {t("product.size-guide")}
                </div>
                <ChevronRight className="!size-7 text-neutral-500 sm:hidden" />
              </Button>

              <Button
                variant="outline"
                className="w-full flex sm:hidden items-center pl-6 justify-between uppercase gap-2 h-14 rounded-full border-[#424242] mb-6"
                onClick={() => setAdditionalInfoModal(true)}
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={ASSETS["chat-black.svg"] || "/placeholder.svg"}
                    alt="Ayuda"
                    width={20}
                    height={20}
                    className="size-8"
                  />
                  {t("common.additional-information")}
                </div>
                <ChevronRight className="!size-7 text-neutral-500 sm:hidden" />
              </Button>

              {/* - Product Actions */}
              {!product.data.isAuction ? (
                <div>
                  <div className="hidden sm:block space-y-6">
                    <div className="grid gap-4">
                      <Button
                        className="w-full uppercase rounded-full h-14 bg-[#1374AA] hover:bg-[#1374AA]/90 text-white"
                        onClick={() =>
                          loginPass(() => onAddToCart(product.data.id))
                        }
                        disabled={addToCart.isPending}
                      >
                        {t("product.add-to-cart")}
                      </Button>
                      <Link href={locale + "/checkout?ids=" + product.data.id}>
                        <Button className="w-full uppercase rounded-full h-14 bg-black hover:bg-black/90 text-white">
                          {t("product.buy-now")}
                        </Button>
                      </Link>
                    </div>

                    {product.data.seller.isInfluencer && (
                      <Link
                        href={
                          locale +
                          "/featured-sellers/" +
                          product.data.seller.username
                        }
                      >
                        <Button
                          variant="link"
                          className="w-full font-bold text-[#7E7E7E] hover:text-[#424242]"
                        >
                          {t("product.see-sellers-closet")}
                        </Button>
                      </Link>
                    )}
                  </div>

                  <div className="flex sm:hidden gap-4">
                    <Button
                      variant="outline"
                      className="w-full flex-1 rounded-full h-12 min-[400px]:h-14 text-sm min-[400px]:text-base flex items-center justify-center uppercase bg-neutral-200 border-neutral-200"
                      onClick={() =>
                        loginPass(() => onAddToCart(product.data.id))
                      }
                      disabled={addToCart.isPending}
                    >
                      <Image
                        src={
                          ASSETS["shopping-cart-black.svg"] ||
                          "/placeholder.svg"
                        }
                        alt="Cart"
                        width={24}
                        height={24}
                        className="size-5 min-[400px]:size-6 min-[400px]:mr-2"
                      />
                      {t("common.add")}
                    </Button>
                    <Link
                      href={locale + "/checkout?ids=" + props.productId}
                      className="flex-1"
                    >
                      <Button className="w-full flex-1 rounded-full h-12 min-[400px]:h-14 text-sm min-[400px]:text-base bg-black hover:bg-black/90 flex items-center justify-center uppercase">
                        <Image
                          src={
                            ASSETS["credit-card-white.svg"] ||
                            "/placeholder.svg"
                          }
                          alt="Credit Card"
                          width={24}
                          height={24}
                          className="size-5 min-[400px]:size-6 min-[400px]:mr-2"
                        />
                        {t("cart-dropdown.checkout")}
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div>
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!auctionStatus || auctionStatus !== "started") return;
                      onBid();
                    }}
                  >
                    <div className="hidden space-y-4 sm:block">
                      {auctionStatus && auctionStatus !== "ended" && (
                        <div className="bg-[#1374aa] text-white p-4 px-6 rounded-full">
                          <p className="text-lg font-medium text-center">
                            {auctionStatus === "has-to-start-yet"
                              ? t("common.starts-in")
                              : t("common.ends-in")}{" "}
                            <Countdown
                              date={biddingEndsAt}
                              renderer={({ days, hours, minutes, seconds }) => (
                                <span>
                                  {days}d : {hours}h : {minutes}m : {seconds}s
                                </span>
                              )}
                              onComplete={() =>
                                setRecalcStatus((prev) => !prev)
                              }
                            />
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 sm:grid-cols-1 gap-3">
                        <p className="font-semibold text-[#454545]">
                          {t("auctions.number-of-proposals")}:{" "}
                          <span className="font-bold text-black text-xl ml-1">
                            {totalBids}
                          </span>
                        </p>
                        {!!totalBids && (
                          <p className="font-semibold text-[#454545]">
                            {t("auctions.highest-bid")}:{" "}
                            <span className="font-bold text-black text-xl ml-1">
                              {formatCurrency(highestBid)}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    {auctionStatus === "started" && (
                      <>
                        <div className="space-y-2">
                          <div className="flex justify-between px-2 sm:px-0">
                            <label
                              htmlFor="offer-bid-input"
                              className="text-sm font-semibold text-[#454545]"
                            >
                              {t("auctions.offer-a-price")}:
                            </label>

                            {!!totalBids && (
                              <p className="text-sm font-semibold text-[#454545] sm:hidden">
                                {t("auctions.highest-bid")}:{" "}
                                <span className="font-bold text-base text-black">
                                  {formatCurrency(highestBid)}
                                </span>
                              </p>
                            )}
                          </div>
                          <label
                            htmlFor="offer-bid-input"
                            className="relative rounded-full bg-white h-14 flex justify-center items-center border-2 border-neutral-500 focus-within:border-blue-500"
                          >
                            <span className="absolute left-8 top-1/2 text-xl font-semibold -translate-y-1/2">
                              S/
                            </span>
                            <AutoWidthInput
                              type="number"
                              id="offer-bid-input"
                              placeholder="0.00"
                              min={
                                totalBids ? highestBid + 1 : product.data.price
                              }
                              value={price}
                              onChange={handlePriceChange}
                            />
                          </label>
                        </div>

                        <Button
                          className="w-full bg-black text-xl text-white h-14 hover:bg-black/90 rounded-full"
                          type="submit"
                          disabled={bid.isPending}
                        >
                          {t("auctions.bid-now")}
                        </Button>

                        <p className="text-sm text-center max-w-[270px] sm:max-w-full mx-auto !mt-5">
                          {t.rich("auctions.offers-remaining", {
                            offersLeft: 25,
                          })}
                        </p>
                      </>
                    )}

                    {auctionStatus === "ended" && (
                      <p className="text-center text-blue-500 py-4">
                        {t("auctions.auction-ended")}
                      </p>
                    )}
                  </form>
                </div>
              )}
            </div>
            <AdditionalInformationModal
              product={product.data}
              open={additionalInfoModal}
              close={() => setAdditionalInfoModal(false)}
            />
          </div>
        ) : null}
      </div>
      {productSuccess && product.data.seller.isInfluencer && (
        <InfluencersRelatedProducts
          seller={product.data.seller}
          productId={product.data.id}
        />
      )}
      <SizeGuideModal />
      <BidPlacedModal
        open={bidPlacedOpen}
        onOpenChange={() => setBidPlacedOpen(false)}
        bidAmount={price}
      />
    </>
  );
}

function InfluencersRelatedProducts(props: {
  seller: ISeller;
  productId: number;
}) {
  const t = useTranslations();
  const {
    data: res,
    isLoading,
    isSuccess,
  } = useGetProducts({
    userId: props.seller.id,
    excludeProduct: props.productId,
  });
  if (isLoading) {
    return (
      <div className="w-full h-[250px] flex justify-center items-center">
        <PulseLoader color="#d9d9d9" />
      </div>
    );
  }

  if (isSuccess && res.data.products.length) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col items-center mb-12">
            <div className="w-16 h-16 rounded-full overflow-hidden mb-4">
              <Image
                src={imageUrl(props.seller.avatarUrl) || "/placeholder.svg"}
                alt="Nicola P."
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-[#424242] capitalize">
              {t("product.more-from")} {props.seller.firstName}{" "}
              {props.seller.lastName}
            </h2>
          </div>

          {/* Products Container */}
          <div className="max-w-7xl mx-auto grid justify-items-center grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4 px-2 md:px-6">
            {res.data.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                cardType="default"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return <></>;
}

function AdditionalInformationModal(props: {
  product: IProduct;
  open: boolean;
  close: () => void;
}) {
  const t = useTranslations();
  const [descriptionOpen, setDescriptionOpen] = useState(false);

  return (
    <Drawer open={props.open} onClose={props.close}>
      <DrawerContent className="max-h-[80vh] p-8 pt-4 rounded-t-[30px]">
        <div className="flex-1 w-16 min-h-3 rounded-full bg-neutral-300 mx-auto mb-7"></div>
        <DrawerTitle className="mb-3 text-2xl font-semibold">
          {t("common.additional-information")}
        </DrawerTitle>
        <pre
          className={cn(
            "text-neutral-600 font-sans text-lg cursor-pointer mb-6 break-words text-wrap",
            descriptionOpen ? "overflow-y-auto" : "line-clamp-3",
          )}
          onClick={() => setDescriptionOpen((prev) => !prev)}
        >
          {props.product.description}
        </pre>
        <div className="space-y-1">
          <p>
            <span className="uppercase">{t("products.form.material")}:</span>{" "}
            {props.product.material || "-"}
          </p>
          <p>
            <span className="uppercase">{t("product.info.color")}:</span>{" "}
            {props.product.color || "-"}
          </p>
          <p>
            <span className="uppercase">{t("product.info.size")}:</span>{" "}
            {props.product.size}
          </p>
          <p>
            <span className="uppercase">{t("product.info.brand")}:</span>{" "}
            {props.product.brand}
          </p>
          <p>
            <span className="uppercase">{t("common.state")}:</span>{" "}
            {props.product.condition}
          </p>
          <p>
            <span className="uppercase">{t("common.category")}:</span>{" "}
            {props.product.category}
          </p>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
