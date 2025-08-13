"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import SwiperNavigationButton from "@/components/common/swiper-navigation-button";
import ProductCard from "@/components/common/product/product-card";
import { useMediaQuery } from "usehooks-ts";
import { useGetProducts } from "@/lib/queries";
import { PulseLoader } from "react-spinners";
import { cn } from "@/lib/utils";

export default function Luxury() {
  const t = useTranslations();
  const {
    data: res,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetProducts({
    isAuction: false,
    isFeatured: false,
    isPremium: true,
    limit: 4,
    sort: "desc",
  });
  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <section className="pb-12 pt-6 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 px-4">
          <h2 className="text-2xl font-bold text-[#1c1c1c] mb-1">
            {t("home.deluxe")}
          </h2>
          <Link
            href="/premium"
            className="text-[#989898] hover:text-[#1c1c1c] transition-colors"
          >
            {t("common.see-more")}
          </Link>
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
              {t("common.no-products-atm")}
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
            isSuccess && (
              <div className="max-w-7xl mx-auto px-4 relative">
                {/* Left Arrow */}
                <SwiperNavigationButton
                  className="home-luxury-prev top-[170px]"
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
                    prevEl: ".home-luxury-prev",
                    nextEl: ".home-luxury-next",
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
                  className="home-luxury-next top-[170px]"
                  direction="right"
                />
              </div>
            )
          ))
        )}
      </div>
    </section>
  );
}
