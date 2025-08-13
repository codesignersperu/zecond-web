"use client";

import { useGetMe, useIsSubscriptionUpdated } from "@/lib/queries";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { MoonLoader } from "react-spinners";
import { useTranslations } from "next-intl";
import { User } from "@/lib/types";

export default function SubscriptionSuccessfulPage() {
  const t = useTranslations();
  const params = useSearchParams();
  const {
    data: userRes,
    isLoading: userLoading,
    isSuccess: userSuccess,
  } = useGetMe();
  const { isLoading } = useIsSubscriptionUpdated(params.get("session-id"));

  return (
    <div className="min-h-[calc(100vh-220px)]">
      <div className="max-w-7xl mx-auto py-20">
        {isLoading || userLoading ? (
          <div className="h-[350px] flex justify-center items-center">
            <MoonLoader size={40} color="#d1d1d1" />
          </div>
        ) : (
          userSuccess && (
            <div className="flex flex-col items-center gap-5">
              <CheckCircle2 className="size-20 text-green-700" />

              <h2 className="text-2xl font-semibold">
                {t("common.congratulations")}
              </h2>

              <h3>
                {t("dashboard.subscription.you-subscribed-to")}{" "}
                <span className="font-semibold">
                  {/* @ts-ignore */}
                  {(userRes && userRes.data.subscriptions[0]?.plan.title) ||
                    "Zecond Free"}
                </span>
              </h3>
            </div>
          )
        )}
      </div>
    </div>
  );
}
