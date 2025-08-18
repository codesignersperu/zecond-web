"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ASSETS } from "@/lib/constants";
import { PaymentElement, useCheckout } from "@stripe/react-stripe-js";
import { CheckoutProvider } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetSubscriptionPlans } from "@/lib/queries";
import { MoonLoader } from "react-spinners";
import { Modal, useModalStore, useGlobalStore } from "@/lib/stores";
import SelectAddressModal from "@/components/common/modals/select-address-modal";
import CreateAddressModal from "@/components/common/modals/create-address-modal";
import { useSubscriptionCheckout } from "@/lib/mutations";
import { stripePromise } from "@/lib/config";
import type { SubscriptionPlan } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export default function SubscriptionCheckoutPage() {
  const t = useTranslations();
  const params = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const { openModal } = useModalStore();
  const { user } = useGlobalStore();
  const {
    data: plansRes,
    isLoading: plansLoading,
    isSuccess: plansSuccess,
    isError: plansError,
  } = useGetSubscriptionPlans();
  const checkout = useSubscriptionCheckout();

  // Product Items

  const [planToCheckout, setPlanToCheckout] = useState<SubscriptionPlan | null>(
    null,
  );

  useEffect(() => {
    if (plansSuccess) {
      setPlanToCheckout(
        plansRes.data.find((v) => v.planId === params.get("id")) || null,
      );
    }
  }, [plansRes]);

  if (plansLoading) {
    return (
      <div className="bg-[#f3f3f3] pb-10">
        <div className="h-[350px] col-span-full w-full flex justify-center items-center">
          <MoonLoader color="#989898" size={40} />
        </div>
      </div>
    );
  }

  if (plansError) {
    return (
      <div className="bg-[#f3f3f3] pb-10">
        <div className="h-[350px] col-span-full w-full flex justify-center items-center">
          <p className="text-red-500">{t("common.error-occured")}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-[#f3f3f3] pb-10">
        <div className="h-[350px] col-span-full w-full flex flex-col gap-3 justify-center items-center">
          <Button onClick={() => openModal({ modal: Modal.LoginSignup })}>
            {t("modals.signup.login")}
          </Button>
          <p className="text-blue-500">{t("common.login-to-checkout")}</p>
        </div>
      </div>
    );
  }

  if (plansSuccess && planToCheckout) {
    // check for current user plan
    // TODO: Implement logic to check current user plan
    if (planToCheckout.planId === "zecond-free") {
      return (
        <div className="bg-[#f3f3f3] pb-10">
          <div className="h-[350px] col-span-full w-full flex justify-center items-center">
            <p className="text-red-500">
              {t("common.you-are-already-subscribed-to-this-plan")}
            </p>
            <Button onClick={() => router.push(locale + "/subscription-plans")}>
              {t("common.upgrade-your-plan")}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-[#f3f3f3] pb-10">
        <div className="max-w-7xl px-4 py-10 sm:py-8 mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Checkout Details */}
            <div className="xl:col-span-2 space-y-6">
              {/* Plan to checkout */}
              <div className="text-app-black-1 p-10 rounded-2xl space-y-4 border border-neutral-300 shadow-shadow-1">
                <h2>{`${t("common.subscribe-to")} ${planToCheckout.title}`}</h2>
                <div>
                  <span className="text-3xl font-medium text-gray-900">
                    {formatCurrency(planToCheckout.price)}
                  </span>
                  <span className="text-gray-600 ml-2 capitalize">
                    {t("common.monthly")}
                  </span>
                </div>
                <h3>{t("common.subscription")}</h3>
              </div>

              {/* Purchase Protection */}
              <PurchaseProtectionCard />
            </div>

            {/* Right Column - Payment Summary */}
            <div className="space-y-6">
              {/* Order Summary */}
              <OrderSummary
                total={planToCheckout.price}
                planTitle={planToCheckout.title}
              />
              <CheckoutProvider
                key={`checkout-${planToCheckout.planId}`}
                stripe={stripePromise}
                options={{
                  fetchClientSecret: () =>
                    checkout.mutateAsync(planToCheckout.planId),
                  elementsOptions: {
                    appearance: {
                      variables: {
                        borderRadius: "8px",
                        colorPrimary: "#222",
                      },
                      rules: {
                        ".Block:focus": {
                          outline: "none",
                        },
                        ".AccordionItem": {
                          boxShadow: "none",
                          border: "none",
                          outline: "none",
                          margin: "0",
                        },
                      },
                    },
                  },
                }}
              >
                <CheckoutForm checkoutLoading={checkout.isPending} />
              </CheckoutProvider>
            </div>

            {/* Modals */}
            <CreateAddressModal />
            <SelectAddressModal />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f3f3f3] pb-10">
      <div className="h-[350px] col-span-full text-red-400 w-full flex justify-center items-cent">
        {user && t("checkout.no-checkout-product")}
      </div>
    </div>
  );
}

const CheckoutForm = ({ checkoutLoading }: { checkoutLoading: boolean }) => {
  const t = useTranslations();
  const checkout = useCheckout();
  const [loading, setLoading] = useState(true);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [formReady, setFormReady] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setPaymentProcessing(true);
    const result = await checkout.confirm();

    if (result.type === "error") {
      // Show error to your customer (for example, payment details incomplete)
      console.log(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
    setPaymentProcessing(false);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg bg-white shadow-shadow-1 border border-black px-3 pt-[1px]"
    >
      {(checkoutLoading || loading) && (
        <div className="h-[150px] flex justify-center items-center">
          <MoonLoader size={30} color="#989898" />
        </div>
      )}

      <PaymentElement
        options={{ layout: "accordion" }}
        onLoaderStart={() => setLoading(false)}
        onReady={() => setFormReady(true)}
      />

      {formReady && (
        <div className="pt-1 pb-5 px-5 space-y-3">
          {/* Terms and Conditions */}
          <div className="text-sm text-[#898989]">
            <p>
              {t.rich("dashboard.my-orders.id.purchase-agreement", {
                anchor: (chunk) => (
                  <Link
                    href="/privacy"
                    className="text-[#424242] font-medium hover:underline"
                  >
                    {chunk}
                  </Link>
                ),
              })}
            </p>
          </div>
          {/* Complete Purchase Button */}
          <Button
            className="w-full h-14 bg-[#27AE60] uppercase hover:bg-[#27AE60]/90 rounded-full text-white text-lg font-medium"
            disabled={paymentProcessing}
          >
            <Image
              src={ASSETS["credit-card-white.svg"] || "/placeholder.svg"}
              alt="Credit Card"
              width={24}
              height={24}
              className="mr-2"
            />
            {t("common.subscribe")}
          </Button>
        </div>
      )}
    </form>
  );
};

const PurchaseProtectionCard = () => {
  const t = useTranslations();
  return (
    <div className="px-4">
      <h2 className="text-lg font-bold mb-2">
        {t("dashboard.my-orders.id.purchase-protection")}
      </h2>
      <p className="text-[#424242]">
        {t("dashboard.my-orders.id.purchase-protection-details")}
      </p>
    </div>
  );
};

const OrderSummary = ({
  total,
  planTitle,
}: {
  total: number;
  planTitle: string;
}) => {
  const t = useTranslations();

  return (
    <div className="bg-white rounded-lg border border-black  overflow-hidden p-6 shadow-shadow-1">
      <h2 className="text-lg font-bold mb-6">{t("common.order-summary")}</h2>

      <div className="flex justify-between uppercase gap-3">
        <p className="text-sm">
          {t("common.subscription")} {planTitle}
          <br />
          {formatCurrency(total)} {t("common.monthly")}
        </p>
        <p className="text-xl font-bold">{formatCurrency(total)}</p>
      </div>
    </div>
  );
};
