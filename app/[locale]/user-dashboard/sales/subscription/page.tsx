"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ASSETS } from "@/lib/constants";
import { BillingHistoryModal } from "@/components/common/modals/billing-history-modal";

export default function SubscriptionPage() {
  const [billingModalOpen, setBillingModalOpen] = useState(false);
  const t = useTranslations();
  return (
    <div className="max-w-[720px] space-y-8 pb-8">
      <h1 className="text-center sm:text-left text-2xl font-bold">
        {t("common.subscription")}
      </h1>

      {/* Plan Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[#424242]">{t("common.plan")}</h2>
        <div className="border border-black rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl uppercase font-medium">
                {t("dashboard.subscription.closet-plan", { noOfItems: 20 })}{" "}
                <span className="font-bold normal-case">$5.00</span>
              </h3>
            </div>
            <div className="space-y-1">
              <p className="text-[#424242]">
                {t("dashboard.subscription.monthly-billing")}
              </p>
              <p className="text-[#424242]">
                {t("dashboard.subscription.next-payment")}: 4 de marzo de 2025
              </p>
            </div>
          </div>

          <Link
            href={"/user-dashboard/sales/subscription/cancel"}
            className="text-lg text-[#565656] font-bold hover:underline"
          >
            {t("dashboard.subscription.cancel-subscription")}
          </Link>
        </div>
      </div>

      {/* Credits Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold upp text-[#424242]">
          {t("common.credits")}
        </h2>
        <div className="border border-black rounded-lg p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg text-stone-400 uppercase font-bold">
                {t("common.credits")}:
              </span>
              <span className="text-lg font-bold">5/10</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg text-stone-400 font-bold">
                {t("dashboard.subscription.closet-sale")}:
              </span>
              <span className="text-lg font-bold">1/1</span>
            </div>
          </div>
          <p className="text-black">
            {t("dashboard.subscription.credits-reset")}
          </p>
        </div>
      </div>

      {/* Billing Information */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase text-[#424242]">
          {t("dashboard.subscription.billing-information")}
        </h2>
        <div className="border border-black rounded-lg p-6">
          <div className="flex flex-col gap-5 min-[520px]:flex-row min-[520px]:justify-between min-[520px]:items-end">
            <div className="space-y-1">
              <p className="font-bold">JORGE ALBERTI</p>
              <p className="text-[#898989]">user@gmail.com</p>
            </div>
            <Button
              variant="link"
              className="text-lg justify-start min-[520px]:justify-center text-[#565656] font-bold hover:underline p-0 h-auto"
              onClick={() => setBillingModalOpen(true)}
            >
              {t("dashboard.subscription.billing-history")}
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[#424242] uppercase">
          {t("dashboard.subscription.payment-details")}
        </h2>
        <div className="border border-black rounded-lg p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div className="flex items-center gap-4">
              <Image
                src={ASSETS["stripe.svg"] || "/placeholder.svg"}
                alt="Stripe"
                width={64}
                height={36}
              />
              <span className="text-[#898989]">user@gmail.com</span>
            </div>
            <Button
              variant="link"
              className="text-lg justify-start sm:justify-center text-[#898989] hover:text-[#424242]"
            >
              {t("dashboard.subscription.update-payment-details")}
            </Button>
          </div>
        </div>
      </div>
      <BillingHistoryModal
        open={billingModalOpen}
        onOpenChange={setBillingModalOpen}
      />
    </div>
  );
}
