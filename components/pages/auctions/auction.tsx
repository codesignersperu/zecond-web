"use client";

import { useTranslations } from "next-intl";
import ProductCard from "@/components/common/product/product-card";
import { useGetProducts } from "@/lib/queries";
import { PulseLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { cn, generateQueryParams } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Auction() {
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
      router.push(`/auctions?${params}`);
    }
  }, [page]);
  const {
    data: res,
    isLoading,
    isSuccess,
  } = useGetProducts({
    page: page || undefined,
    limit: 24,
    isAuction: true,
    sort: "desc",
  });

  return (
    <section className="pt-20 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 px-4">
          <h2 className="text-2xl font-bold text-[#1c1c1c] mb-1">
            {t("home.up-for-auction")}
          </h2>
        </div>

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

        <div className="relative px-5">
          <div
            className="max-w-7xl mx-auto grid justify-items-center grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4 px-2 md:px-6"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {isLoading ? (
              <div className="col-span-full flex justify-center items-center h-[500px]">
                <PulseLoader size={12} color="#d9d9d9" />
              </div>
            ) : (
              isSuccess &&
              (!res?.data?.products?.length ? (
                <div className="col-span-full text-muted-foreground h-[150px] flex justify-center items-center text-center">
                  <p>{t("common.no-auctions-atm")}</p>
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
  );
}
