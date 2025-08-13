"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, FreeMode, Autoplay } from "swiper/modules";
import Countdown from "react-countdown";
import { useGetProducts } from "@/lib/queries";
import { PulseLoader } from "react-spinners";
import { AuctionStatus, ProductsResponse } from "@/lib/types";
import { imageUrl } from "@/lib/utils";
import { useMemo, useState } from "react";
import dayjs from "dayjs";

export default function FeaturedAuctionsSlider() {
  const t = useTranslations();
  const {
    data: res,
    isLoading,
    isSuccess,
  } = useGetProducts({
    isAuction: true,
    sort: "desc",
    limit: 4,
  });
  return (
    <div className="relative w-full overflow-y-visible bg-[#272C2D] py-16">
      {isLoading ? (
        <div className="flex justify-center items-center h-[500px]">
          <PulseLoader size={12} color="#d9d9d9" />
        </div>
      ) : (
        isSuccess &&
        res?.data?.products.length > 0 && (
          <div className="container auctions-featured-container mx-auto px-16 min-[420px]:px-20 sm:px-4">
            {/* Slider */}
            <div className="relative max-w-3xl mx-auto">
              {/* Navigation Buttons */}
              <div className="absolute inset-0 aspect-[2/3] sm:static sm:h-0">
                <button
                  className="auctions-featured-prev absolute -left-14 lg:-left-24 top-1/2 -translate-y-1/2 z-10 text-white/70 disabled:text-white/40"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="size-10 min-[420px]:size-14" />
                </button>

                <button
                  className="auctions-featured-next absolute -right-14 lg:-right-24 top-1/2 -translate-y-1/2 z-10 text-white/70 disabled:text-white/40"
                  aria-label="Next slide"
                >
                  <ChevronRight className="size-10 min-[420px]:size-14" />
                </button>
              </div>
              {/* Swiper */}
              <Swiper
                className="auctions-featured-swiper"
                modules={[Navigation, Pagination, FreeMode, Autoplay]}
                slidesPerView={1}
                spaceBetween={16}
                pagination={{
                  clickable: true,
                  el: ".auctions-featured-pagination",
                }}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                navigation={{
                  prevEl: ".auctions-featured-prev",
                  nextEl: ".auctions-featured-next",
                }}
              >
                {!res.data.products.length ? (
                  <SwiperSlide key={"no-auction-slider"}>
                    <div className=" h-[150px] text-muted-foreground flex justify-center items-center text-center">
                      <p>{t("common.no-auctions-atm")}</p>
                    </div>
                  </SwiperSlide>
                ) : (
                  res.data.products.map((product, idx) => (
                    <SwiperSlide key={idx}>
                      <Slide product={product} />
                    </SwiperSlide>
                  ))
                )}
              </Swiper>
            </div>
            <div className="auctions-featured-pagination absolute left-0 !-bottom-10 w-full h-5 flex justify-center"></div>
          </div>
        )
      )}
    </div>
  );
}

function Slide(props: { product: ProductsResponse }) {
  const t = useTranslations();
  const locale = useLocale();

  const [recalcStatus, setRecalcStatus] = useState(false);
  const auctionStatus: AuctionStatus | null = useMemo(() => {
    if (dayjs(props.product.endDate).isBefore(Date.now())) return "ended";
    if (dayjs(props.product.startDate).isAfter(Date.now()))
      return "has-to-start-yet";
    return "started";
  }, [props.product, recalcStatus]);

  const biddingEndsAt = useMemo(
    () =>
      auctionStatus
        ? auctionStatus === "has-to-start-yet"
          ? (props.product.startDate as string)
          : auctionStatus === "started"
            ? (props.product.endDate as string)
            : ""
        : "",
    [auctionStatus],
  );

  return (
    <div className="grid max-w-3xl mx-auto grid-cols-1 md:grid-cols-[290px_1fr] gap-8 md:gap-12 items-center">
      {/* Product Image */}
      <div className="relative aspect-[2/3]">
        {/* Seller Info */}
        <div className="absolute left-1 sm:left-4 top-1 sm:top-4 z-10 flex items-center gap-2 rounded-full p-2">
          <Image
            src={imageUrl(props.product.seller.avatarUrl) || "/placeholder.svg"}
            alt={props.product.seller.firstName}
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="text-white font-medium capitalize">
            {props.product.seller.firstName} {props.product.seller.lastName[0]}.
          </span>
        </div>

        {/* Product Image */}
        <Image
          src={imageUrl(props.product.images[0].url) || "/placeholder.svg"}
          alt={props.product.title}
          width={290}
          height={375}
          className="w-full h-full object-cover rounded-2xl object-bottom"
        />
      </div>

      {/* Product Info */}
      <div className="text-white">
        <div className="text-2xl text-center sm:text-left font-bold mb-[6px]">
          $ {props.product.price.toFixed(2)}
          <span className="text-2xl">.+</span>
        </div>

        <h2 className="text-xl text-center sm:text-left sm:text-2xl font-bold mb-3 sm:mb-4">
          {props.product.title}
        </h2>

        <div className="hidden sm:bottom-0 text-4xl font-bold mb:6">
          $ {props.product.price.toFixed(2)}
          <span className="text-2xl">.+</span>
        </div>

        {/* Countdown */}
        {auctionStatus && auctionStatus !== "ended" && (
          <div className="bg-[#FF6B6B] text-white rounded-xl p-4 text-center text-lg sm:text-xl font-medium mb-4">
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
              onComplete={() => setRecalcStatus((prev) => !prev)}
            />
          </div>
        )}

        <div className="space-y-2 mb-2">
          <p className="text-center sm:text-left text-gray-300">
            {t("auctions.number-of-proposals")}:{" "}
            <span className="text-white">{props.product.totalBids}</span>
          </p>
          {!!props.product.bids.length && (
            <p className="text-center sm:text-left text-gray-300">
              {t("auctions.highest-bid")}:{" "}
              <span className="text-white font-bold">
                $ {props.product.bids[0].amount.toFixed(2)}
              </span>
            </p>
          )}
        </div>

        {auctionStatus === "started" && (
          <Link
            href={locale + `/products/` + props.product.id}
            className="w-full inline-flex gap-3 uppercase justify-center sm:justify-start text-[#40C98E]"
          >
            {t("auctions.bid-now")}
            <ChevronRight />
          </Link>
        )}

        {auctionStatus === "ended" && (
          <p className="text-blue-500 py-4">{t("auctions.auction-ended")}</p>
        )}
      </div>
    </div>
  );
}
