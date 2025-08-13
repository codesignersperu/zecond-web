"use client";

import { useTranslations } from "next-intl";
import ProductCard from "@/components/common/product/product-card";
import { useGetMyBoughtProducts } from "@/lib/queries";
import { PulseLoader } from "react-spinners";
import ReviewOrderModal from "@/components/common/modals/review-order-modal";

// Mock data for the favorites

export default function HistoryPage() {
  const t = useTranslations();
  const {
    data: products,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useGetMyBoughtProducts();
  return (
    <div className="space-y-8">
      <h1 className="text-center sm:text-left text-2xl font-bold">
        {t("common.record")}
      </h1>
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center sm:justify-items-start py-4 px-2 md:px-6 mb-12">
        {isLoading ? (
          <div className="col-span-full flex py-12 sm:py-16 justify-center items-center">
            <PulseLoader color="#d9d9d9" />
          </div>
        ) : isError ? (
          <div className="col-span-full flex py-12 sm:py-16 justify-center items-center">
            <p className="text-center text-red-500">
              {error && error.message
                ? error.message
                : t("common.error-occured")}
            </p>
          </div>
        ) : (
          isSuccess &&
          products.data.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cardType="default"
              hideCartIcon
              hideInfluencer
            />
          ))
        )}
      </div>
    </div>
  );
}
