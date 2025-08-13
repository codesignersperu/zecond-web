"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useRouter } from "next/navigation";
import { useGlobalStore } from "@/lib/stores";
import { imageUrl } from "@/lib/utils";

const desktopSlides = [
  [
    "https://ahoraeszecond.com/zecond-banner-desktop.jpg",
    "/subscription-plans",
  ],
  [
    "https://ahoraeszecond.com/zecond-banner-desktop.jpg",
    "/subscription-plans",
  ],
  [
    "https://ahoraeszecond.com/zecond-banner-desktop.jpg",
    "/subscription-plans",
  ],
];

const mobileSlides = [
  ["https://ahoraeszecond.com/zecond-banner-mobile.jpg", "/subscription-plans"],
  ["https://ahoraeszecond.com/zecond-banner-mobile.jpg", "/subscription-plans"],
  ["https://ahoraeszecond.com/zecond-banner-mobile.jpg", "/subscription-plans"],
];

export default function Header() {
  const t = useTranslations("common");
  const { config } = useGlobalStore();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);
  const headerSlides = useMemo(
    () =>
      typeof isMobile === "boolean"
        ? isMobile
          ? config?.mobileBanners || mobileSlides
          : config?.banners || desktopSlides
        : [],
    [isMobile],
  );

  useEffect(() => {
    if (typeof window !== undefined) {
      const width = window.innerWidth;
      if (width <= 640) setIsMobile(true);
      else setIsMobile(false);
    }
  }, []);

  return (
    <>
      <div className="relative flex flex-col w-full">
        {/* Hero Section with Slider */}
        <Swiper
          modules={[Pagination, Autoplay]}
          loop={true}
          spaceBetween={24}
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true, el: ".home-header-pagination" }}
          className="w-full mb-0"
        >
          {headerSlides.map(([img, link], index) => (
            <SwiperSlide
              key={img + index}
              className="p-3 sm:p-0 cursor-pointer"
              onClick={() => router.push(link)}
            >
              <img
                src={imageUrl(img)}
                className="rounded-[20px] w-full sm:rounded-none sm:object-cover object-center"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div
          className="home-header-pagination !absolute left-0 right-0 flex justify-center !-bottom-6 sm:!-bottom-8 !gap-[6px] z-10"
          style={{ gap: "6px" }}
        ></div>
      </div>
    </>
  );
}
