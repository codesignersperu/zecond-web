"use client";

import type React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, FreeMode } from "swiper/modules";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useMemo, useState } from "react";
import { cn, formatCurrency, imageUrl } from "@/lib/utils";
import { ASSETS } from "@/lib/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Countdown from "react-countdown";
import ProductInfo from "@/components/common/product/product-info";
import { useModalStore, Modal } from "@/lib/stores";
import { useGetProducts } from "@/lib/queries";
import { MoonLoader } from "react-spinners";
import { AuctionStatus, HttpResponse, IProduct } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import Link from "next/link";
import AutoWidthInput from "../auto-width-input";
import { useBidSocket } from "@/lib/hooks";
import { useBidOnAuction } from "@/lib/mutations";
import { useLoginPass } from "@/lib/hooks";
import BidPlacedModal from "./bid-placed-modal";

export default function ProductModal() {
  const {
    currentOpenedModal,
    closeModal,
    productModalData: props,
  } = useModalStore();
  const bid = useBidOnAuction();
  const t = useTranslations();
  const router = useRouter();
  const loginPass = useLoginPass();
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const {
    data: products,
    isSuccess: productsSuccess,
    isLoading: productsLoading,
    isError: productsError,
  } = useGetProducts({
    userId: props?.mode === "story" ? props.influencerId : undefined,
    ids: props?.mode === "product" ? [props.productId] : undefined,
    version: "full",
  });

  const [recalcStatus, setRecalcStatus] = useState(false);
  const [bidPlacedOpen, setBidPlacedOpen] = useState(false);
  const auctionStatus: AuctionStatus | null = useMemo(() => {
    if (!products) return null;
    const currentProduct = products.data.products[currentProductIndex];
    if (!currentProduct || !currentProduct.isAuction) return null;
    if (dayjs(currentProduct.endDate).isBefore(Date.now())) return "ended";
    if (dayjs(currentProduct.startDate).isAfter(Date.now()))
      return "has-to-start-yet";
    return "started";
  }, [products, currentProductIndex, recalcStatus]);

  const biddingEndsAt = useMemo(() => {
    if (!products) return "";
    const currentProduct = products.data.products[currentProductIndex];

    return auctionStatus
      ? auctionStatus === "has-to-start-yet"
        ? (currentProduct.startDate as string)
        : auctionStatus === "started"
          ? (currentProduct.endDate as string)
          : ""
      : "";
  }, [auctionStatus]);

  const { totalBids, highestBid, price, handlePriceChange } = useBidSocket({
    product: products?.data?.products.length
      ? products.data.products[currentProductIndex]
      : undefined,
  });

  async function onCheckout(productId: number) {
    const pass = await loginPass();
    if (!pass) return;
    router.push("/checkout?ids=" + productId);
    closeModal();
  }

  async function onBid() {
    const product = products?.data?.products.length
      ? products.data.products[currentProductIndex]
      : undefined;
    if (!product) return;
    const res = await loginPass<Promise<HttpResponse | undefined>>(() =>
      bid.mutateAsync({
        productId: product.id,
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
      <Dialog
        open={currentOpenedModal === Modal.Product}
        onOpenChange={closeModal}
      >
        {/* TODO: fix this placement of the modal  */}
        <DialogContent
          className={cn(
            "max-w-[310px] md:max-w-[900px] h-[80vh] md:h-auto !rounded-2xl border-none p-0 focus:outline-none",
            props?.mode === "story" &&
              productsSuccess &&
              products.data.products.length &&
              "top-[56%]",
          )}
        >
          {/* Close Button */}
          <DialogClose className="absolute z-10 w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 right-2 top-2 rounded-full bg-black flex justify-center items-center opacity-100 transition-opacity hover:opacity-70 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <Image
              src={ASSETS["cross-white.svg"] || "/placeholder.svg"}
              alt="Close Modal"
              width={14}
              height={14}
              className="w-[10px] h-[10px] sm:w-[10px] sm:h-[10px]"
            />
            <span className="sr-only">Close</span>
          </DialogClose>
          {((seller) =>
            !seller ? null : (
              <div className="absolute -top-[110px] sm:-top-[90px] lg:-top-[240px] items-center left-0 right-0 flex flex-col sm:flex-row lg:flex-col justify-center gap-3 lg:gap-0 px-8 py-4 lg:py-8">
                <div
                  className="cursor-pointer flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-3 lg:gap-0"
                  onClick={() => {
                    router.push("/featured-sellers/" + seller.username);
                    closeModal();
                  }}
                >
                  <div className="lg:mx-auto flex gap-2 items-center justify-center lg:mb-4">
                    <div className="w-[60px] lg:w-[120px] aspect-square flex justify-center items-center h-full rounded-full p-[2px] lg:p-1 border-2 border-[#f244d5]">
                      <Image
                        src={imageUrl(seller.avatarUrl) || "/placeholder.svg"}
                        alt={seller.firstName}
                        width={120}
                        height={120}
                        className="rounded-full w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="sm:hidden lg:text-2xl font-medium leading-none lg:mb-4 text-white">
                      {seller.firstName} {seller.lastName}
                    </h3>
                  </div>
                  <h3 className="hidden sm:block lg:text-2xl font-medium leading-none lg:mb-4 text-white">
                    {seller.firstName} {seller.lastName}
                  </h3>
                </div>
                <div className="flex-1 flex justify-center gap-2 w-full sm:w-auto max-w-[70%] lg:w-full lg:max-w-[400px] sm:ml-auto lg:mx-auto">
                  {products?.data?.products.map((_, idx) => (
                    <div
                      className={cn(
                        "h-1 flex-1 rounded-full",
                        currentProductIndex >= idx ? "bg-white" : "bg-white/20",
                      )}
                    />
                  ))}
                </div>
              </div>
            ))(
            props?.mode === "story" && products?.data?.products?.length
              ? products.data.products[0].seller
              : null,
          )}

          {/* Slid control Buttons */}
          {/* Left Arrow */}
          <button
            className={cn(
              "product-modal-main-prev absolute -left-12 sm:-left-16 top-1/2 -translate-y-1/2 z-10 w-[49px] h-[49px] md:bg-white rounded-full flex items-center justify-center disabled:opacity-60",
              props?.mode !== "story" && "hidden",
            )}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-10 h-10 text-white md:text-[#808080] md:w-5" />
          </button>

          {/* Right Arrow */}
          <button
            className={cn(
              "product-modal-main-next absolute -right-12 sm:-right-16 top-1/2 -translate-y-1/2 z-10 w-[49px] h-[49px] md:bg-white rounded-full flex items-center justify-center disabled:opacity-60",
              props?.mode !== "story" && "hidden",
            )}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-10 h-10 text-white md:text-[#808080] md:w-5" />
          </button>

          <div className="h-full w-full flex flex-col rounded-2xl overflow-hidden md:h-auto md:flex-row md:gap-6">
            {/* <div> */}
            <Swiper
              className="auctions-featured-swiper h-full w-full relative"
              allowTouchMove={false}
              modules={[Navigation]}
              slidesPerView={1}
              spaceBetween={16}
              navigation={{
                prevEl: ".product-modal-main-prev",
                nextEl: ".product-modal-main-next",
              }}
              onSlideChange={(swiper) =>
                setCurrentProductIndex(swiper.activeIndex)
              }
            >
              {productsLoading ? (
                <SwiperSlide className="!flex flex-col py-20 items-center justify-center rounded-2xl md:h-auto md:flex-row md:gap-6">
                  <MoonLoader color="#989898" size={40} />
                </SwiperSlide>
              ) : productsError ? (
                <SwiperSlide className="!flex flex-col py-20 items-center justify-center rounded-2xl md:h-auto md:flex-row md:gap-6">
                  <p>{t("common.error")}</p>
                </SwiperSlide>
              ) : !products?.data?.products?.length ? (
                <SwiperSlide className="!flex flex-col py-20 items-center justify-center rounded-2xl md:h-auto md:flex-row md:gap-6">
                  <p>Product Doesn't Exist</p>
                </SwiperSlide>
              ) : productsSuccess ? (
                products.data.products.map((product) => (
                  <SwiperSlide className="!flex flex-col md:max-h-[600px] md:min-h-[500px] rounded-2xl md:h-auto md:flex-row md:gap-6 overflow-hidden">
                    {/* Image Gallery */}
                    <div className="relative md:h-auto flex-1 overflow-hidden rounded-t-xl md:rounded-none md:rounded-l-xl">
                      <Swiper
                        className="h-full auctions-featured-swiper overflow-hidden"
                        modules={[Pagination, FreeMode]}
                        slidesPerView={1}
                        spaceBetween={16}
                        loop
                        pagination={{
                          clickable: true,
                          el: ".product-modal-pagination",
                        }}
                      >
                        {product.images.map((img, idx) => (
                          <SwiperSlide key={idx}>
                            <Image
                              src={imageUrl(img.url) || "/placeholder.svg"}
                              alt={product.title}
                              fill
                              className="md:!max-h-[600px] object-cover -z-10"
                            />
                          </SwiperSlide>
                        ))}
                        <div className="product-modal-pagination absolute bottom-[5%] left-0 right-0 flex justify-center !gap-1 z-10"></div>
                      </Swiper>
                    </div>

                    <div className="hidden md:flex flex-col flex-1 pb-5 pr-6 overflow-y-auto">
                      <DialogTitle className="sr-only">
                        {product.title}
                      </DialogTitle>
                      <ProductInfo
                        product={
                          productsSuccess && products.data.products.length
                            ? (products.data.products[
                                currentProductIndex
                              ] as IProduct)
                            : null
                        }
                        cardType="modal"
                      />

                      {/* Product Actions */}
                      <div className="space-y-6 mt-auto">
                        {!product.isAuction ? (
                          // Regular Product View
                          <div className="space-y-8">
                            <div className="space-y-4">
                              {product.seller && (
                                <Link
                                  className="block"
                                  href={
                                    "/featured-sellers/" +
                                    product.seller.username
                                  }
                                  onClick={closeModal}
                                >
                                  <Button
                                    variant="outline"
                                    className="w-full h-12 text-lg rounded-full font-semibold"
                                  >
                                    <span className="uppercase font-normal">
                                      {t("product.see-seller-name-closet")}
                                    </span>{" "}
                                    {product.seller.firstName.toUpperCase()}
                                  </Button>
                                </Link>
                              )}

                              <div className="grid grid-cols-2 gap-4">
                                <Link
                                  href={"/products/" + product.id}
                                  onClick={closeModal}
                                >
                                  <Button
                                    variant="outline"
                                    className="w-full h-12 uppercase text-lg rounded-full bg-gray-100"
                                  >
                                    {t("common.see-more")}
                                  </Button>
                                </Link>
                                <Button
                                  className="w-full h-12 text-lg rounded-full bg-black hover:bg-black/90 text-white"
                                  onClick={() => onCheckout(product.id)}
                                >
                                  <Image
                                    src={
                                      ASSETS["credit-card-white.svg"] ||
                                      "/placeholder.svg"
                                    }
                                    width={30}
                                    height={30}
                                    alt="Credit Card"
                                  />
                                  {t("cart-dropdown.checkout")}
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // Auction Product View
                          <div className="space-y-6">
                            <form
                              className="space-y-4"
                              onSubmit={(e) => {
                                e.preventDefault();
                                if (!auctionStatus || auctionStatus === "ended")
                                  return;
                                onBid();
                              }}
                            >
                              {/* Auction Timer */}
                              {auctionStatus && auctionStatus !== "ended" && (
                                <div className="bg-[#1374aa] text-white p-4 rounded-full">
                                  <p className="text-lg font-medium text-center">
                                    {auctionStatus === "has-to-start-yet"
                                      ? t("common.starts-in")
                                      : t("common.ends-in")}{" "}
                                    <Countdown
                                      date={biddingEndsAt}
                                      renderer={({
                                        days,
                                        hours,
                                        minutes,
                                        seconds,
                                      }) => (
                                        <p className="min-[440px]:inline">
                                          {days}d : {hours}h : {minutes}m :{" "}
                                          {seconds}s
                                        </p>
                                      )}
                                      onComplete={() =>
                                        setRecalcStatus((prev) => !prev)
                                      }
                                    />
                                  </p>
                                </div>
                              )}

                              <div className="mb-2 flex justify-between gap-2 flex-wrap">
                                <p className="font-semibold text-[#424242] text-nowrap">
                                  {t("auctions.number-of-proposals")}:{" "}
                                  <span className="font-bold text-2xl ml-1">
                                    {totalBids}
                                  </span>
                                </p>
                                {!!product.bids.length && (
                                  <p className="font-semibold text-[#424242] text-nowrap">
                                    {t("auctions.highest-bid")}:{" "}
                                    <span className="font-bold text-2xl ml-1">
                                      {formatCurrency(highestBid)}
                                    </span>
                                  </p>
                                )}
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
                                    </div>
                                    <label
                                      htmlFor="offer-bid-input"
                                      className="relative rounded-full bg-white h-14 flex justify-center items-center border-2 border-neutral-500 focus-within:border-blue-500"
                                    >
                                      <span className="absolute left-8 top-1/2 text-xl font-semibold -translate-y-1/2">
                                        S/
                                      </span>
                                      <AutoWidthInput
                                        id="offer-bid-input"
                                        placeholder="0.00"
                                        min={
                                          totalBids
                                            ? highestBid + 1
                                            : products.data.products[
                                                currentProductIndex
                                              ].price
                                        }
                                        value={price}
                                        onChange={handlePriceChange}
                                      />
                                    </label>
                                  </div>
                                  <Button
                                    className="w-full bg-black text-white text-[18px] h-14 hover:bg-black/90 rounded-full"
                                    disabled={bid.isPending}
                                  >
                                    {t("auctions.bid-now")}
                                  </Button>{" "}
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
                    </div>

                    <ProductInfo
                      product={
                        productsSuccess && products.data.products.length
                          ? (products.data.products[
                              currentProductIndex
                            ] as IProduct)
                          : null
                      }
                      cardType="drawerTrigger"
                      trigger={() => setMobileDrawerOpen(true)}
                    />
                  </SwiperSlide>
                ))
              ) : null}
            </Swiper>
          </div>
        </DialogContent>
      </Dialog>
      {/* Mobile Drawer */}
      <Drawer
        open={mobileDrawerOpen}
        onOpenChange={() => setMobileDrawerOpen(false)}
      >
        <DrawerContent className="py-8 px-5">
          {productsLoading ? (
            <div className="h-[400px] flex justify-center items-center">
              <MoonLoader color="#989898" size={40} />
            </div>
          ) : productsError ? (
            <div className="h-[400px] flex justify-center items-center">
              <p>{t("common.error")}</p>
            </div>
          ) : productsSuccess && products?.data?.products?.length ? (
            <>
              {" "}
              <ProductInfo
                product={
                  productsSuccess && products.data.products.length
                    ? (products.data.products[currentProductIndex] as IProduct)
                    : null
                }
                cardType="drawer"
              />
              {/* Product Actions */}
              {((product) =>
                product ? (
                  <div className="space-y-6">
                    {!product.isAuction ? (
                      // Regular Product View
                      <div className="space-y-8">
                        <div className="space-y-4">
                          {product.seller.isInfluencer && (
                            <Link
                              className="block"
                              href={
                                "/featured-sellers/" + product.seller.username
                              }
                              onClick={closeModal}
                            >
                              <Button
                                variant="outline"
                                className="w-full h-12 rounded-full font-semibold"
                              >
                                <span className="uppercase font-normal">
                                  {t("product.see-seller-name-closet")}
                                </span>{" "}
                                {product.seller.firstName.toUpperCase()}
                              </Button>
                            </Link>
                          )}

                          <div className="grid grid-cols-2 gap-4">
                            <Link
                              href={"/products/" + product.id}
                              onClick={closeModal}
                              className="block"
                            >
                              <Button
                                variant="outline"
                                className="h-12 w-full uppercase rounded-full bg-gray-100"
                              >
                                {t("common.see-more")}
                              </Button>
                            </Link>
                            <Button
                              className="h-12 w-full uppercase rounded-full bg-black hover:bg-black/90 text-white"
                              onClick={() => onCheckout(product.id)}
                            >
                              <Image
                                src={
                                  ASSETS["credit-card-white.svg"] ||
                                  "/placeholder.svg"
                                }
                                width={20}
                                height={20}
                                alt="Credit Card"
                              />
                              {t("cart-dropdown.checkout")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Auction Product View
                      <div className="space-y-6">
                        <form
                          className="space-y-4"
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!auctionStatus || auctionStatus === "ended")
                              return;
                            onBid();
                          }}
                        >
                          {auctionStatus && auctionStatus !== "ended" && (
                            <div className="bg-[#1374aa] text-white p-4 rounded-full">
                              <p className="text-lg font-medium text-center">
                                {auctionStatus === "has-to-start-yet"
                                  ? t("common.starts-in")
                                  : t("common.ends-in")}{" "}
                                <Countdown
                                  date={biddingEndsAt as any}
                                  renderer={({
                                    days,
                                    hours,
                                    minutes,
                                    seconds,
                                  }) => (
                                    <p className="min-[440px]:inline">
                                      {days}d : {hours}h : {minutes}m :{" "}
                                      {seconds}s
                                    </p>
                                  )}
                                  onComplete={() =>
                                    setRecalcStatus((prev) => !prev)
                                  }
                                />
                              </p>
                            </div>
                          )}

                          <div className="mb-2 flex justify-between gap-2 flex-wrap">
                            <p className="text-[#424242]">
                              {t("auctions.number-of-proposals")}: {totalBids}
                            </p>
                            {product.bids.length && (
                              <p className="text-[#424242]">
                                {t("auctions.highest-bid")}:{" "}
                                <span className="font-bold">
                                  {formatCurrency(highestBid)}
                                </span>
                              </p>
                            )}
                          </div>

                          {auctionStatus === "started" && (
                            <>
                              <div className="space-y-2">
                                <p className="text-[#424242]">
                                  {t("auctions.offer-a-price")}:
                                </p>
                                <label
                                  htmlFor="offer-bid-input-drawer"
                                  className="relative rounded-full bg-white h-14 flex justify-center items-center border-2 border-neutral-500 focus-within:border-blue-500"
                                >
                                  <span className="absolute left-8 top-1/2 text-xl font-semibold -translate-y-1/2">
                                    S/
                                  </span>
                                  <AutoWidthInput
                                    id="offer-bid-input-drawer"
                                    placeholder="0.00"
                                    min={
                                      totalBids
                                        ? highestBid + 1
                                        : products.data.products[
                                            currentProductIndex
                                          ].price
                                    }
                                    value={price}
                                    onChange={handlePriceChange}
                                  />
                                </label>
                              </div>

                              <Button
                                className="w-full bg-black h-14 text-white uppercase hover:bg-black/90 rounded-full"
                                disabled={bid.isPending}
                              >
                                {t("auctions.bid-now")}
                              </Button>
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
                ) : null)(products.data.products[currentProductIndex])}
            </>
          ) : null}
        </DrawerContent>
      </Drawer>

      {/* Bid Placed Modal */}
      <BidPlacedModal
        open={bidPlacedOpen}
        onOpenChange={() => setBidPlacedOpen(false)}
        bidAmount={price}
      />
    </>
  );
}
