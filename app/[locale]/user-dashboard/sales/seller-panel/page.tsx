"use client";

import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetSellerStats } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricCardProps {
  value: string | number;
  title: string;
  subtitle?: string;
  showStar?: boolean;
  className?: string;
  loading: boolean;
}

function MetricCard({
  value,
  title,
  subtitle = "sales",
  showStar = false,
  className,
  loading,
}: MetricCardProps) {
  const t = useTranslations();

  if (subtitle === "sales") {
    subtitle = t("navigation.dashboard.sales");
  }

  return (
    <div className={cn("rounded-xl border border-black p-6", className)}>
      {loading ? (
        <Skeleton className="w-[100px] h-10" />
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-4xl font-bold">{value}</span>
          {showStar && (
            <Star
              className={cn(
                "h-6 w-6 mb-2",
                Number(value)
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-neutral-300 text-neutral-300",
              )}
            />
          )}
        </div>
      )}
      <h3 className="mt-2 font-medium text-[#1C1C1C]">{title}</h3>
      {subtitle && <p className="text-[#898989]">{subtitle}</p>}
    </div>
  );
}

export default function SellerPanelPage() {
  const t = useTranslations();

  const { data: res, isLoading } = useGetSellerStats();
  return (
    <div className="space-y-8">
      <h1 className="text-center sm:text-left text-2xl font-bold">
        {t("dashboard.seller-panel.heading")}
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 pb-8">
        <MetricCard
          value={res?.data ? res.data.rating : "-"}
          title={t("dashboard.seller-panel.seller-qualification")}
          subtitle={
            (res?.data ? res.data.noOfReviews : "-") +
            " " +
            t("dashboard.seller-panel.opinions")
          }
          showStar
          className="col-span-2"
          loading={isLoading}
        />

        <MetricCard
          value={res?.data ? res.data.followers : "-"}
          title={t("dashboard.seller-panel.followers")}
          loading={isLoading}
        />

        <MetricCard
          value={res?.data ? res.data.following : "-"}
          title={t("dashboard.seller-panel.followed")}
          loading={isLoading}
        />
        <MetricCard
          value={res?.data ? res.data.products.active : "-"}
          title={t("dashboard.seller-panel.active-posts")}
          subtitle={"1 " + t("dashboard.seller-panel.opinions")}
          loading={isLoading}
          className="col-span-2"
        />
        <MetricCard
          value={res?.data ? res.data.ordersPending : "-"}
          title={t("dashboard.seller-panel.orders-pending-shipment")}
          loading={isLoading}
          className="col-span-2"
        />
        <MetricCard
          value={res?.data ? res.data.products.sold : "-"}
          title={t("dashboard.seller-panel.products-sold")}
          loading={isLoading}
          className="col-span-2"
        />
        <MetricCard
          value={res?.data ? res.data.products.draft : "-"}
          title={t("common.drafts")}
          loading={isLoading}
          className="col-span-2"
        />
      </div>
    </div>
  );
}
