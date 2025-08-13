"use client";

import { useTranslations } from "next-intl";
import ProductCard from "@/components/common/product/product-card";
import { useGetProducts } from "@/lib/queries";
import { PulseLoader } from "react-spinners";

export default function MoreProducts({ userId }: { userId: number }) {
  const t = useTranslations("common");

  const {
    data: res,
    isLoading,
    isSuccess,
  } = useGetProducts({
    userId,
  });

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#1c1c1c] mb-1">
            {t("more-products")}
          </h2>
        </div> */}

        <div className="relative">
          <div
            className="max-w-7xl mx-auto grid justify-items-center grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4 px-2 md:px-6"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {isLoading ? (
              <div className="col-span-full text-center h-[400px] flex items-center justify-center">
                <PulseLoader color="#d9d9d9" />
              </div>
            ) : (
              isSuccess &&
              (!res?.data.products.length ? (
                <div className="col-span-full text-center h-[400px] flex items-center justify-center">
                  {t("no-products-atm")}
                </div>
              ) : (
                res?.data.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    cardType="default"
                  />
                ))
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
