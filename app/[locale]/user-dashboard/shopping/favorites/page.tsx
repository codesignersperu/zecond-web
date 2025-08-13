"use client";

import { useTranslations } from "next-intl";
import ProductCard from "@/components/common/product/product-card";
import { useGetFavorites } from "@/lib/queries";
import { PulseLoader } from "react-spinners";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Mock data for the favorites

export default function FavoritesPage() {
  const t = useTranslations();
  const [page, setPage] = useState<number | null>(null);
  const {
    data: res,
    isLoading,
    isSuccess,
  } = useGetFavorites({ page: page || 1 });

  return (
    <div className="space-y-8">
      <h1 className="text-center sm:text-left text-2xl font-bold">
        {t("navigation.dashboard.favorites")}
      </h1>

      {isLoading ? (
        <div className="text-center h-[350px] sm:h-[500px] flex items-center justify-center">
          <PulseLoader color="#d9d9d9" />
        </div>
      ) : isSuccess && !res.data.products.length ? (
        <div className="h-[350px] sm:h-[500px] text-muted-foreground flex justify-center items-center text-center">
          <p>{t("common.no-products-atm")}</p>
        </div>
      ) : (
        isSuccess && (
          <>
            <section className="space-y-4">
              <div className="relative">
                <div
                  className={cn(
                    "col-span-full w-fit mx-auto mb-6",
                    !res?.data?.products?.length ||
                      !res?.data?.pagination?.prevPage
                      ? "hidden"
                      : "",
                  )}
                >
                  <Button
                    variant="default"
                    className="rounded-full uppercase bg-black !h-[40px] border-0 text-white"
                    onClick={() => setPage((prev) => (prev ? prev - 1 : 1))}
                    disabled={!res?.data?.pagination?.prevPage}
                  >
                    {t("common.previous")}
                  </Button>
                </div>
                <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 items-start justify-start no-scrollbar scroll-smooth py-4 px-2 mb-8">
                  {res.data.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      cardType="default"
                    />
                  ))}
                </div>
                <div className="w-fit mx-auto">
                  <Button
                    variant="default"
                    className="rounded-full uppercase bg-black !h-[40px] border-0 text-white"
                    onClick={() => setPage((prev) => (prev ? prev + 1 : 1))}
                    disabled={!res?.data?.pagination?.nextPage}
                  >
                    {t("common.see-more")}
                  </Button>
                </div>
              </div>
            </section>
          </>
        )
      )}
    </div>
  );
}
