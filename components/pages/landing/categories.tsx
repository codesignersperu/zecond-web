"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ASSETS } from "@/lib/constants";

const categories = [
  {
    name: "Hombres",
    url: "/products/?category=Hombre",
    image: ASSETS["cloth-1.png"],
  },
  {
    name: "Mujer",
    url: "/products/?category=Mujer",
    image: ASSETS["cloth-1.png"],
  },
  {
    name: "Niños",
    url: "/products/?category=Niños",
    image: ASSETS["cloth-1.png"],
  },
  {
    name: "De Lujo",
    url: "/premium",
    image: ASSETS["cloth-1.png"],
  },
];

export default function CategoriesSection() {
  const t = useTranslations();

  return (
    <section className="py-8 sm:py-12 px-4 bg-[#F8F8F8]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#1c1c1c] mb-1">
            {t("home.categories")}
          </h2>
          <Link
            href="/products"
            className="text-[#989898] hover:text-[#1c1c1c] transition-colors"
          >
            {t("common.see-more")}
          </Link>
        </div>

        <div
          className="overflow-x-auto grid grid-cols-2 max-w-xl mx-auto xl:max-w-[100%] xl:grid-cols-4  gap-6 py-4 px-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.url}
              className="bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col min-[460px]:flex-row items-center gap-4 p-4 hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-shadow"
            >
              <div className="w-16 h-16 relative flex-shrink-0">
                <Image
                  src={category.image || ASSETS["placeholder.svg"]}
                  alt={category.name}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <span className="text-lg text-[#1c1c1c]">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
