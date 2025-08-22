"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import InfluencerCard from "@/components/common/influencer-card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import SwiperNavigationButton from "@/components/common/swiper-navigation-button";
import { useMediaQuery } from "usehooks-ts";
import { useGetInfluencers } from "@/lib/queries";
import { PulseLoader } from "react-spinners";
import { cn } from "@/lib/utils";

export default function Influencers() {
  const t = useTranslations();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const {
    data: res,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetInfluencers({ limit: 8, liveProducts: true });
  return (
    <section className="py-12 sm:py-32 relative bg-[#F8F8F8]">
      <div className="max-w-7xl mx-auto">
        <div className="flex px-8 justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-[#424242] capitalize">
            {t("navigation.influencers")}
          </h2>
          <Link
            href="influencers"
            className="text-[#989898] hover:text-[#424242] transition-colors"
          >
            {t("common.see-more")}
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-[130px]">
            <PulseLoader size={12} color="#d9d9d9" />
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center h-[130px]">
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
          (!res.data.influencers.length ? (
            <div className="flex justify-center items-center h-[500px] text-muted-foreground">
              {t("common.no-influencers-atm")}
            </div>
          ) : isMobile ? (
            <div className="flex overflow-x-auto gap-3 no-scrollbar">
              {res?.data.influencers.map((influencer, index) => (
                <InfluencerCard
                  influencer={influencer}
                  key={influencer.username}
                  className={
                    !index
                      ? "ml-8"
                      : index === res.data.influencers.length - 1
                        ? "mr-8"
                        : ""
                  }
                />
              ))}
            </div>
          ) : (
            isSuccess && (
              <div className="px-8 relative">
                {/* Left Arrow */}
                <SwiperNavigationButton
                  className="influencer-prev top-[32px]"
                  direction="left"
                />

                {/* Scrollable Container */}
                <Swiper
                  modules={[Navigation, FreeMode]}
                  slidesPerView={3}
                  spaceBetween={8}
                  autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                  }}
                  navigation={{
                    prevEl: ".influencer-prev",
                    nextEl: ".influencer-next",
                  }}
                  breakpoints={{
                    460: {
                      slidesPerView: 4,
                      spaceBetween: 8,
                    },
                    560: {
                      slidesPerView: 4,
                      spaceBetween: 8,
                    },
                    720: {
                      slidesPerView: 5,
                      spaceBetween: 16,
                    },
                    850: {
                      slidesPerView: 6,
                      spaceBetween: 20,
                    },
                    1024: {
                      slidesPerView: 7,
                      spaceBetween: 28,
                    },
                    1220: {
                      slidesPerView: 8,
                      spaceBetween: 32,
                    },
                  }}
                >
                  {res?.data.influencers.map((influencer) => (
                    <SwiperSlide key={influencer.id}>
                      <InfluencerCard influencer={influencer} />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Right Arrow */}
                <SwiperNavigationButton
                  className="influencer-next top-[32px] "
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
