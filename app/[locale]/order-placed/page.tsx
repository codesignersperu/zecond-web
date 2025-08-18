"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ASSETS } from "@/lib/constants";
import { useTranslations } from "next-intl";
import { useGetOrderByCheckoutId } from "@/lib/queries";
import { useSearchParams } from "next/navigation";
import { useGlobalStore } from "@/lib/stores";
import { MoonLoader } from "react-spinners";
import dayjs from "dayjs";
import { formatCurrency, imageUrl } from "@/lib/utils";

// Mock order data - in a real app, this would come from an API
const orderData = {
  customerName: "Jorge",
  orderId: "PO-159-0039079818807267",
  orderDate: "12 ene 2025",
  estimatedDelivery: "15-20 de Febrero 2025",
  totalItems: 9,
  totalPrice: 280.95,
  items: [
    {
      id: 1,
      image: ASSETS["cloth-1.png"],
      name: "Black Blazer",
    },
    {
      id: 2,
      image: ASSETS["cloth-2.png"],
      name: "Beige Blazer",
    },
    {
      id: 3,
      image: ASSETS["cloth-1.png"],
      name: "Black Blazer",
    },
    {
      id: 4,
      image: ASSETS["cloth-1.png"],
      name: "Black Blazer",
    },
  ],
  shippingAddress: {
    street: "AV. REPUBLICA DEL SALVADOR NO 1619 P.B.",
    colony: "FRACC. EL DORADO",
    municipality: "AGUASCALIENTES",
    city: "AGUASCALIENTES",
    state: "AGUASCALIENTES",
    postalCode: "",
    customerName: "Jorge Alberti",
    address: "Dirección numero 235, dpt 456",
    phone: "942 04569 87",
  },
};

export default function OrderPlacedPage() {
  const t = useTranslations();
  const params = useSearchParams();
  const { user } = useGlobalStore();

  const {
    data: res,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useGetOrderByCheckoutId(params.get("sessionId") || "");
  return (
    <div className="container py-20 max-w-4xl mx-auto px-4">
      {isLoading ? (
        <div className="h-[150px] flex justify-center items-center">
          <MoonLoader size={40} color="#989898" />
        </div>
      ) : isError ? (
        <div className="h-[150px] flex justify-center items-center">
          <p>{error.message}</p>
        </div>
      ) : (
        isSuccess && (
          <>
            <div className="text-center mb-12">
              <h1 className="text-[#1374AA] text-xl sm:text-2xl mb-2">
                {t("dashboard.my-orders.thank-you-for-your-purchase")},{" "}
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-4xl font-bold">
                {t("dashboard.my-orders.order-placed-successfully")}
              </p>
            </div>
            {/* Order Summary Card */}
            <div className="bg-white shadow-shadow-1 rounded-xl border border-black px-6 py-4 mb-8">
              <div className="flex flex-col space-y-6">
                {/* Header */}
                <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start">
                  <div>
                    <p className="text-xl font-bold mb-4">
                      {t("dashboard.my-orders.estimated-deliver-for")}:{" "}
                      {dayjs(res.data.createdAt)
                        .add(5, "days")
                        .format("DD MMM, YYYY")}
                    </p>
                    {/* Product Images */}
                    <div className="flex gap-2 overflow-x-scroll no-scrollbar scroll-smooth">
                      {res.data.orderItems.map((item, idx) => (
                        <Image
                          key={idx}
                          src={imageUrl(item.product.images[0].url)}
                          alt={item.product.title}
                          width={100}
                          height={150}
                          className="object-cover rounded-[14px]"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap xl:flex-col xl:items-end gap-4">
                    <Link
                      href={`user-dashboard/shopping/orders/${res.data.id}`}
                      className="text-lg font-medium flex items-center hover:underline"
                    >
                      {t("dashboard.my-orders.view-order-details")}
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>

                {/* Order Details */}
                <div className="flex flex-wrap gap-1 text-sm items-center justify-between">
                  <div className="flex items-center gap-8">
                    <p className="text-[#898989]">
                      {res.data.orderItems.length} {t("common.articles")}:{" "}
                      <span className="text-black font-medium">
                        {formatCurrency(res.data.total)}
                      </span>
                    </p>
                    <p className="text-[#898989]">
                      {t("dashboard.my-orders.order-date")}:{" "}
                      <span className="text-black font-medium">
                        {dayjs(res.data.createdAt).format("DD MMM, YYYY")}
                      </span>
                    </p>
                    <div className="flex items-center gap-2">
                      <Image
                        src={ASSETS["stripe.svg"] || "/placeholder.svg"}
                        alt="Stripe"
                        width={48}
                        height={36}
                      />
                    </div>
                  </div>
                  <p className="text-[#898989]">
                    {t("dashboard.my-orders.order-id")}:{" "}
                    <span className="text-black font-medium">
                      {res.data.id}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            {/* Shipping Address */}
            <div>
              <h2 className="text-xl font-bold mb-4">
                {t("dashboard.my-orders.id.mailing-address")}
              </h2>
              <div className="bg-white rounded-xl border border-black shadow-shadow-1 p-6">
                <div className="flex flex-wrap gap-3 justify-between items-end text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Image
                        src={ASSETS["delivery-black.svg"] || "/placeholder.svg"}
                        alt="Delivery"
                        width={28}
                        height={28}
                      />
                      <h3 className="font-bold text-base">
                        {t("common.delivery")}
                      </h3>
                    </div>

                    <p className="font-light text-xs">
                      <span className="font-semibold text-sm">
                        {t("common.street-and-number")}:{" "}
                      </span>
                      {res.data.shippingAddress.exteriorReference},{" "}
                      {res.data.shippingAddress.street}
                    </p>
                    <p className="font-light text-xs">
                      <span className="font-semibold text-sm">
                        {t("common.colony")}:{" "}
                      </span>
                      {res.data.shippingAddress.neighborhood}
                    </p>
                    <p className="font-light text-xs">
                      <span className="font-semibold text-sm">
                        {t("common.delegation-or-municipality")}:{" "}
                      </span>
                      {res.data.shippingAddress.municipality}
                    </p>
                    <p className="font-light text-xs">
                      <span className="font-semibold text-sm">
                        {t("common.city")}:{" "}
                      </span>
                      {res.data.shippingAddress.city}
                    </p>
                    <p className="font-light text-xs">
                      <span className="font-semibold text-sm">
                        {t("common.state")}:{" "}
                      </span>
                      {res.data.shippingAddress.state}
                    </p>
                    <p className="font-light text-xs">
                      <span className="font-semibold text-sm">
                        {t("common.zip-code")}:{" "}
                      </span>
                      {res.data.shippingAddress.postalCode}
                    </p>
                  </div>
                  <div className="">
                    <p className="font-bold mb-2">
                      {res.data.shippingAddress.recipientName}
                    </p>
                    <p className="font-light">
                      {res.data.shippingAddress.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>{" "}
          </>
        )
      )}
    </div>
  );
}
