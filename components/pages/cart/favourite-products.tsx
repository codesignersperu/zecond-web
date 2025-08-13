"use client";

import Link from "next/link";
import ProductCard from "@/components/common/product/product-card";
import { useTranslations } from "next-intl";
import { useGetFavorites } from "@/lib/queries";
import { PulseLoader } from "react-spinners";

export default function FavouriteProducts() {
  const t = useTranslations();
  const { data: res, isLoading, isSuccess } = useGetFavorites();

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#1c1c1c] mb-1">
            {t("common.your-favorites")}
          </h2>
          <Link
            href="/favourites"
            className="text-[#989898] hover:text-[#1c1c1c] transition-colors"
          >
            {t("common.see-more")}
          </Link>
        </div>
        <div className="max-w-7xl mx-auto grid justify-items-center grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4 px-2 md:px-6 mb-12">
          {isLoading ? (
            <div className="col-span-full text-center h-[400px] flex items-center justify-center">
              <PulseLoader color="#d9d9d9" />
            </div>
          ) : isSuccess && !res.data.products.length ? (
            <div className="col-span-full text-center h-[400px] flex items-center justify-center">
              <p className="text-neutral-400">
                {t("common.no-favorites-right-now")}
              </p>
            </div>
          ) : (
            res &&
            res.data.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                cardType="default"
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
