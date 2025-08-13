"use client";

import { useTranslations } from "next-intl";
import ProductCard from "@/components/common/product/product-card";
import { useGetProducts } from "@/lib/queries";
import { PulseLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn, generateQueryParams } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function FeaturedProductsPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [page, setPage] = useState<number | null>(null);

  useEffect(() => {
    let page = searchParams.get("page");
    setPage(Number(page || 1));
  }, []);

  useEffect(() => {
    const params = generateQueryParams({
      page,
    });

    if (params) {
      router.push(`/premium?${params}`);
    }
  }, [page]);
  const {
    data: res,
    isLoading,
    isSuccess,
  } = useGetProducts({
    page: page || undefined,
    limit: 24,
    isPremium: true,
    sort: "desc",
  });
  return (
    <main className="text-white relative pb-20">
      <div className="absolute top-0 left-0 w-full -z-10 bg-[#2D3534] h-[350px] min-[439px]:h-[500px]"></div>
      <div className="absolute inset-0 -z-20 bg-black"></div>

      <header className="pt-24">
        <div className="mb-14">
          <h2 className="font-bold italic text-[40px] text-center leading-tight mb-2">
            {t("luxury.luxury")}
          </h2>
          <p className="font-bold italic text-xl text-center">
            {t("luxury.featured-articles")}
          </p>
        </div>
      </header>

      <div
        className={cn(
          "w-fit mx-auto mb-6",
          !res?.data?.products?.length || !res?.data?.pagination?.prevPage
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

      <div className="max-w-7xl mx-auto grid justify-items-center grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4 px-2 md:px-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center h-[500px]">
            <PulseLoader size={12} color="#d9d9d9" />
          </div>
        ) : (
          isSuccess &&
          res.data.products.map((product) => (
            <ProductCard key={product.id} product={product} cardType="luxury" />
          ))
        )}
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
    </main>
  );
}
