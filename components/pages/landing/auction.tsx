"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/common/product/product-card";
import { ASSETS } from "@/lib/constants";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import SwiperNavigationButton from "@/components/common/swiper-navigation-button";
import { useMediaQuery } from "usehooks-ts";
import { useGetProducts } from "@/lib/queries";
import { PulseLoader } from "react-spinners";
import { cn } from "@/lib/utils";

export default function AuctionSection() {
  const t = useTranslations();
  const {
    data: res,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetProducts({
    isAuction: true,
    limit: 4,
  });
  const isMobile = useMediaQuery("(max-width: 640px)");
  return (
    <section className="py-8 sm:py-12">
      {/* Auction Banner */}
      <div className="px-4">
        <div className="max-w-7xl mx-auto  bg-black text-white rounded-xl mb-8 p-4 flex items-center justify-center gap-8">
          <div className="flex items-center gap-8">
            <Image
              src={ASSETS["auction-white.svg"] || "/placeholder.svg"}
              alt={"category"}
              width={120}
              height={120}
              className="w-[34px]"
            />
            <span className="text-xl font-bold">
              {t("home.up-for-auction")}
            </span>
          </div>
          <Link href="/auctions" className="flex items-center gap-2 text-sm">
            {t("home.for-a-limited-time")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-[500px]">
          <PulseLoader size={12} color="#d9d9d9" />
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center h-[500px]">
          <p
            className={cn(
              error.statusCode === 503 ? "text-blue-500" : "text-red-400",
            )}
          >
            {error.message}
          </p>
        </div>
      ) : (
        isSuccess &&
        (!res.data?.products.length ? (
          <div className="flex justify-center items-center h-[500px] text-muted-foreground">
            {t("common.no-auctions-atm")}
          </div>
        ) : isMobile ? (
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {res.data.products.map((product, index) => (
              <ProductCard
                product={product}
                key={index}
                cardType="default"
                className={`flex-1 ${
                  !index
                    ? "ml-8"
                    : index === res.data.products.length - 1
                      ? "mr-8"
                      : ""
                }`}
              />
            ))}
          </div>
        ) : (
          <div className="max-w-7xl mx-auto relative">
            {/* Left Arrow */}
            <SwiperNavigationButton
              className="home-auction-prev top-[170px]"
              direction="left"
            />

            <Swiper
              className="!px-3"
              modules={[Navigation, FreeMode]}
              slidesPerView={2}
              spaceBetween={8}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              navigation={{
                prevEl: ".home-auction-prev",
                nextEl: ".home-auction-next",
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 8,
                },
                915: {
                  slidesPerView: 3,
                  spaceBetween: 8,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 28,
                },
              }}
            >
              {res.data.products.map((product, idx) => (
                <SwiperSlide
                  key={product.id + idx}
                  className="!flex !justify-center"
                >
                  <ProductCard
                    key={product.id}
                    product={product}
                    cardType="default"
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Right Arrow */}
            <SwiperNavigationButton
              className="home-auction-next top-[170px]"
              direction="right"
            />
          </div>
        ))
      )}
    </section>
  );
}
