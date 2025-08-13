"use client";

import { useTranslations } from "next-intl";
import ProductCard from "@/components/common/product/product-card";
import { useGetProducts } from "@/lib/queries";
import { PulseLoader } from "react-spinners";

export default function RelatedProducts() {
  const t = useTranslations();

  const {
    data: res,
    isLoading,
    error,
    isError,
    isSuccess,
  } = useGetProducts({
    limit: 8,
  });

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-2xl font-bold text-[#424242]">
            {t("product.more-products")}
          </h2>
        </div>

        {/* Products Container */}
        <div className="w-full max-w-7xl justify-items-center mx-auto grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4 px-2 md:px-6">
          {isLoading ? (
            <div className="col-span-full h-[250px] flex justify-center items-center">
              <PulseLoader color="#d9d9d9" />
            </div>
          ) : isError ? (
            <div className="col-span-full h-[250px] flex justify-center items-center">
              {error?.message || t("common.error-occured")}
            </div>
          ) : isSuccess ? (
            res.data.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                cardType="default"
              />
            ))
          ) : null}
        </div>
      </div>
    </section>
  );
}
