"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ASSETS } from "@/lib/constants";
import OrderDetailsModal from "@/components/common/modals/order-details-modal";
import { useState, use } from "react";
import { useGetOrder } from "@/lib/queries";
import { MoonLoader } from "react-spinners";
import { formatCurrency } from "@/lib/utils";

interface OrderDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const t = useTranslations();
  // In a real app, you would fetch the order details based on the ID
  const { id } = use(params);

  // Order Details Modal
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const { data: res, isLoading, isSuccess, isError, error } = useGetOrder(+id);

  return (
    <div className="max-w-7xl py-10 sm:py-8 mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="h-[150px] flex justify-center items-center">
            <MoonLoader color="#989898" />
          </div>
        ) : isError ? (
          <div className="h-[150px] flex justify-center items-center">
            <p>{error.message}</p>
          </div>
        ) : (
          isSuccess && (
            <>
              {/* Left Column - Order Details */}
              <div className="xl:col-span-2 space-y-6">
                {/* Order Summary */}
                <div
                  className="bg-white rounded-lg shadow-shadow-1 cursor-pointer overflow-hidden"
                  onClick={() => setShowOrderDetails(true)}
                >
                  <div className="flex flex-wrap justify-between items-center p-6">
                    <div className="flex items-center">
                      <span className="text-lg font-bold">
                        {t("dashboard.my-orders.id.show-order-details")}
                      </span>
                      <ChevronRight className="ml-2 -mt-[6px] h-5 w-5" />
                    </div>
                    <span className="text-xl font-bold">
                      {formatCurrency(res.data.subTotal)}
                    </span>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <div className="flex p-3 justify-between items-center">
                    <h2 className="text-lg font-bold">
                      {t("dashboard.my-orders.id.mailing-address")}
                    </h2>
                  </div>
                  <div className="p-6 flex items-start gap-4 bg-white rounded-lg shadow-shadow-1">
                    <div className="mt-1">
                      <Image
                        src={ASSETS["location-black.svg"] || "/placeholder.svg"}
                        alt="Location"
                        width={24}
                        height={24}
                      />
                    </div>
                    <div>
                      <p className="font-medium">
                        {res.data.shippingAddress.recipientName}
                      </p>
                      <p>
                        {((v) =>
                          `${v.exteriorReference}, ${v.street}, ${v.neighborhood}, ${v.city}, ${v.municipality}, ${v.state}, ${v.postalCode}`)(
                          res.data.shippingAddress,
                        )}
                      </p>
                      <p>{res.data.shippingAddress.phoneNumber}</p>
                    </div>
                  </div>
                </div>
                {/* Delivery Time */}
                <div className="bg-white rounded-lg overflow-hidden shadow-shadow-1">
                  <div className="p-6 flex items-center gap-4">
                    <Image
                      src={
                        ASSETS["shopping-cart-black.svg"] || "/placeholder.svg"
                      }
                      alt="Delivery"
                      width={24}
                      height={24}
                    />
                    <span className="text-lg">
                      {t("common.delivery")}: 3 -7 días hábiles
                    </span>
                  </div>
                </div>
                {/* Purchase Protection */}
                <div className="px-4">
                  <h2 className="text-lg font-bold mb-2">
                    {t("dashboard.my-orders.id.purchase-protection")}
                  </h2>
                  <p className="text-[#424242]">
                    {t("dashboard.my-orders.id.purchase-protection-details")}
                  </p>
                </div>
              </div>

              {/* Right Column - Payment Summary */}
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="bg-white rounded-lg border border-black  overflow-hidden p-6 shadow-shadow-1">
                  <h2 className="text-xl font-bold mb-6">
                    {t("common.order-summary")}
                  </h2>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>{t("common.total-items")}</span>
                      <span className="font-medium">
                        {formatCurrency(res.data.subTotal)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>{t("dashboard.my-orders.id.shipping-cost")}</span>
                      <span className="font-medium">
                        {res.data.shippingCost
                          ? formatCurrency(res.data.shippingCost)
                          : "-"}
                      </span>
                    </div>

                    {res.data.discountCode && (
                      <div className="flex justify-between text-green-500">
                        <span>{t("common.discount")}</span>
                        <span className="font-medium">
                          - {res.data.discountType === "amount" ? "S/ " : ""}
                          {res.data.discountType === "amount"
                            ? formatCurrency(res.data.discountAmount || 0)
                            : res.data.discountAmount}
                          {res.data.discountType === "percent" ? "%" : ""}
                        </span>
                      </div>
                    )}

                    <div className="pt-4 border-t border-black ">
                      <div className="flex justify-between">
                        <span className="text-xl font-bold">Total:</span>
                        <span className="text-xl font-bold">
                          {formatCurrency(res.data.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Payment Method */}
                <div className="bg-white rounded-lg border border-black  overflow-hidden p-6 shadow-shadow-1">
                  <div className="space-x-2 mb-3">
                    <span className="font-bold">{t("common.payment")}</span>
                    <span className="p-1 rounded bg-neutral-50 text-[#898989]">
                      STRIPE
                    </span>
                  </div>

                  <p className="text-sm text-[#898989] mb-4">
                    {t("dashboard.my-orders.id.transactions-secure")}
                  </p>

                  <div className="flex gap-3">
                    <Image
                      src={ASSETS["visa-logo.webp"]}
                      alt="Visa"
                      width={40}
                      height={24}
                    />
                    <Image
                      src={ASSETS["mastercard-logo.webp"]}
                      alt="Mastercard"
                      width={40}
                      height={24}
                    />
                    <Image
                      src={ASSETS["diners-club-logo.webp"]}
                      alt="Diners"
                      width={40}
                      height={24}
                    />
                  </div>
                </div>
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
              </div>
            </>
          )
        )}
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={showOrderDetails}
        onClose={() => setShowOrderDetails(false)}
        items={res?.data ? res.data.orderItems : []}
      />
    </div>
  );
}
