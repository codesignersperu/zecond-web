"use client";

import { cn, formatCurrency } from "@/lib/utils";
import { useTranslations } from "next-intl";
import React from "react";
import { Check } from "lucide-react";
import Link from "next/link";
import { useGetSubscriptionPlans } from "@/lib/queries";
import { PulseLoader } from "react-spinners";
import { SubscriptionPlan } from "@/lib/types";
import { Modal, useModalStore, useGlobalStore } from "@/lib/stores";
import { useRouter } from "next/navigation";

const SubscriptionPlans = () => {
  const t = useTranslations();
  const {
    data: plansRes,
    isLoading,
    isSuccess,
    isError,
  } = useGetSubscriptionPlans();
  const router = useRouter();
  const { openModal } = useModalStore();
  const user = useGlobalStore((state) => state.user);

  function onPlanClick(planId: SubscriptionPlan["planId"]) {
    if (planId === "zecond-free") {
      if (!user) {
        // open signup modal
        openModal({ modal: Modal.LoginSignup });
      }
    } else {
      router.push("/subscription-checkout?id=" + planId, {
        scroll: true,
      });
    }
  }
  return (
    <div className="min-h-[calc(100vh-212px)] bg-gray-50">
      {/* heading */}
      <div className="bg-white py-8 sm:py-16 px-4">
        <h2 className="text-2xl font-bold text-center">
          {t("subscription-plans.heading")}
        </h2>
      </div>

      {isLoading ? (
        <div className="h-[250px] flex justify-center items-center">
          <PulseLoader color="#d9d9d9" />
        </div>
      ) : isError ? (
        <div className="h-[250px] flex text-red-500 justify-center items-center">
          {t("common.error-occured")}
        </div>
      ) : (
        isSuccess && (
          <div className="max-w-7xl mx-auto px-4 pt-12 pb-32">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plansRes.data.map((plan) => (
                <PlanCard
                  key={plan.planId}
                  plan={plan}
                  onPlanClick={onPlanClick}
                  isCurrent={plan.planId === user?.subscriptions[0]?.planId}
                />
              ))}
            </div>

            {/* Footer text */}
            <div className="max-w-[350px] text-[#616161] mx-auto text-center mt-12 text-sm">
              {t.rich("dashboard.my-orders.id.purchase-agreement", {
                anchor: (chunk) => (
                  <Link
                    href="/privacy"
                    className="font-semibold hover:underline"
                  >
                    {chunk}
                  </Link>
                ),
              })}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default SubscriptionPlans;

const PlanCard = ({
  plan,
  isCurrent,
  onPlanClick,
}: {
  plan: SubscriptionPlan;
  isCurrent: boolean;
  onPlanClick: (planId: string) => void;
}) => {
  const t = useTranslations();
  const { user } = useGlobalStore();

  const getButtonStyle = () => {
    if (plan.planId === "zecond-free") return "bg-gray-400 text-white";
    if (plan.planId === "zecond-black")
      return "bg-green-500 hover:bg-green-600 text-white";
    if (plan.planId === "todo-zecond")
      return "bg-black hover:bg-gray-800 text-white";
  };

  const getBorderStyle = () => {
    if (plan.planId === "zecond-black") return "border-green-500";
    return "border-gray-200";
  };

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border-2 p-10 pt-6 flex flex-col h-full shadow-shadow-1",
        getBorderStyle(),
      )}
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{plan.title}</h3>
        <div className="mb-4">
          <span className="text-3xl font-medium text-gray-900">
            {formatCurrency(plan.price)}
          </span>
          <span className="text-gray-600 ml-2 capitalize">
            {t("common.monthly")}
          </span>
        </div>
        <button
          className={cn(
            `w-full py-3 px-4 rounded-full uppercase font-semibold transition-colors`,
            getButtonStyle(),
            isCurrent && "cursor-not-allowed",
          )}
          disabled={isCurrent}
          onClick={() => onPlanClick(plan.planId)}
        >
          {plan.planId === "zecond-free" && !user
            ? t("modals.login.signup")
            : isCurrent
              ? t("common.your-current-plan")
              : t("common.get-it-now")}
        </button>
      </div>

      {/* Features */}
      <div className="flex-1">
        {plan.subtitle && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800">{plan.subtitle}</h4>
          </div>
        )}

        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check />
              <div>
                <div className="font-semibold text-gray-800">
                  {feature.heading}
                </div>
                <div className="text-sm text-gray-600">{feature.para}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
