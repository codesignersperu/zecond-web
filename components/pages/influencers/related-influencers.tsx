"use client";

import { useTranslations } from "next-intl";
import { useGetInfluencers } from "@/lib/queries";
import { imageUrl, cn, generateQueryParams } from "@/lib/utils";
import { PulseLoader } from "react-spinners";
import { useRouter, useSearchParams } from "next/navigation";
import InfluencerCard from "@/components/common/influencer-card";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function RelatedInfluencers() {
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
      router.push(`/featured-sellers?${params}`);
    }
  }, [page]);
  const { data: res, isLoading } = useGetInfluencers({
    page: page || undefined,
  });

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div
          className={cn(
            "w-fit mx-auto mb-6",
            !res?.data?.influencers?.length || !res?.data?.pagination?.prevPage
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

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-8 mb-12">
          {isLoading ? (
            <div className="col-span-full h-[150px] flex justify-center items-center">
              <PulseLoader color="#d9d9d9" />
            </div>
          ) : res?.data ? (
            res.data.influencers.map((v) => <InfluencerCard influencer={v} />)
          ) : null}
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
