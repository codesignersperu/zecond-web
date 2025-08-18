"use client";

import { useTranslations } from "next-intl";
import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ASSETS } from "@/lib/constants";
import { Card } from "@/components/ui/card";
import { cn, formatCurrency, imageUrl } from "@/lib/utils";
import { OrderStatusModal } from "@/components/common/modals/order-status-modal";
import { useGetOrder } from "@/lib/queries";
import { PulseLoader } from "react-spinners";
import dayjs from "dayjs";

export type OrderStatus = "EN ESPERA" | "FALLIDO" | "PROCESANDO" | "COMPLETADO";

export default function OrderDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(props.params);

  if (!id || isNaN(parseInt(id))) {
    return <div>Error: Invalid ID</div>;
  }

  const t = useTranslations();
  const {
    data: order,
    isLoading: orderLoading,
    isSuccess: orderSuccess,
    isError: orderError,
  } = useGetOrder(parseInt(id));
  const [orderStatusModal, setOrderStatusModal] = useState(false);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("EN ESPERA");
  return (
    <div className="container pb:py-8">
      {/* Header */}
      {orderLoading ? (
        <div className="h-[100px] flex justify-center items-center">
          <PulseLoader color="#d9d9d9" size={15} />
        </div>
      ) : orderError ? (
        <div className="h-[100px] flex justify-center text-red-500 text-center items-center">
          {t("common.error-occured")}
        </div>
      ) : (
        orderSuccess && (
          <>
            <div className="mb-8 flex items-center justify-center sm:justify-start gap-2 text-2xl font-bold">
              <Link
                href="/user-dashboard/sales/orders"
                className="hover:opacity-70 hidden sm:inline"
              >
                ≤
              </Link>
              <h1>
                {t("common.order")} #{order.data.id}
              </h1>
            </div>
            <div className="grid gap-6 xl:grid-cols-[1fr,400px]">
              {/* Products List */}
              <div className="space-y-4">
                <div className="flex justify-between text-lg font-medium">
                  <span>{t("common.articles")}</span>
                  <div className="hidden sm:flex gap-16">
                    <span>{t("common.qty")}.</span>
                    <span>{t("common.price")}</span>
                  </div>
                </div>

                {/* Product Cards */}
                {order.data.orderItems.map((item, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div
                      className={cn(
                        "flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-4",
                        item.product.isAuction
                          ? "bg-black text-white"
                          : "bg-white text-black",
                      )}
                    >
                      <div className="flex gap-3 items-center">
                        <Image
                          src={
                            imageUrl(item.product.images[0].url) ||
                            "/placeholder.svg"
                          }
                          alt="Product"
                          width={95}
                          height={95}
                          className="w-[95px] h-[95px]  rounded-md bg-white object-cover object-top"
                        />
                        <div
                          className={cn(
                            index !== 0 ? "text-black" : "text-white",
                          )}
                        >
                          <h3 className="font-medium">
                            <span>{item.product.title}</span>
                            {item.product.isAuction && (
                              <Image
                                src={ASSETS["trophy.svg"] || "/placeholder.svg"}
                                alt="Trophy"
                                width={20}
                                height={20}
                                className="ml-2 inline"
                              />
                            )}
                          </h3>
                          <div
                            className={cn(
                              "mt-1 space-y-0.5 text-sm",
                              item.product.isAuction
                                ? "text-gray-300"
                                : "text-black",
                            )}
                          >
                            <p>
                              {t("products.filters.size")}: {item.product.size}
                            </p>
                            <p>
                              {t("products.filters.color")}:{" "}
                              {item.product.color}
                            </p>
                            <p>
                              {t("products.filters.brand")}:{" "}
                              {item.product.brand}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="sm:ml-auto sm:text-right">
                        <span className="sm:hidden mr-2 font-bold">
                          {t("common.qty")}:{" "}
                        </span>
                        1
                      </p>
                      <p className="sm:ml-10 sm:text-right">
                        <span className="sm:hidden mr-2 font-bold">
                          {t("common.price")}:{" "}
                        </span>
                        {formatCurrency(item.product.price)}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="space-y-4">
                <Card className="p-6">
                  <h2 className="mb-4 text-lg font-bold">
                    {t("common.order-summary")}
                  </h2>
                  <div className="space-y-4">
                    {/* Date */}
                    <div className="flex items-center gap-2">
                      <Image
                        src={ASSETS["clock-black.svg"] || "/placeholder.svg"}
                        alt="Date"
                        width={20}
                        height={20}
                      />
                      <div className="flex font-bold flex-1 justify-between">
                        <span>{t("common.date")}</span>
                        <span>
                          {dayjs(order.data.createdAt).format("DD MMM YYYY")}
                        </span>
                      </div>
                    </div>

                    {/* Customer */}
                    <div className="flex items-center gap-2">
                      <Image
                        src={ASSETS["user-3.svg"] || "/placeholder.svg"}
                        alt="Customer"
                        width={20}
                        height={20}
                      />
                      <span className="font-bold">
                        {order.data.buyer.firstName +
                          " " +
                          order.data.buyer.lastName}
                      </span>
                    </div>

                    <hr className="my-4" />

                    {/* Order Totals */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-light">
                          {t("common.order-summary")}{" "}
                          <span className="font-bold">
                            ({order.data.orderItems.length}{" "}
                            {t("common.products")})
                          </span>
                        </span>
                        <span className="font-bold">
                          {formatCurrency(order.data.subTotal)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-light">
                          {t("common.shipping-methods")}
                        </span>
                        <span className="font-bold">
                          {formatCurrency(order.data.shippingCost || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span className="text-lg font-bold">
                          {t("common.paid")}:
                        </span>
                        <span className="font-bold">
                          {formatCurrency(order.data.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Delivery Details */}
                <Card className="p-6">
                  <div className="flex items-center gap-2">
                    <Image
                      src={ASSETS["delivery-black.svg"] || "/placeholder.svg"}
                      alt="Delivery"
                      width={24}
                      height={24}
                    />
                    <h2 className="text-lg font-bold">Entrega</h2>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <div>
                      <span className="font-semibold">
                        {t("common.street-and-number")}:
                      </span>
                      <span className="ml-1 font-light">
                        {order.data.shippingAddress.street}{" "}
                        {order.data.shippingAddress.exteriorReference}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">
                        {t("common.colony")}:
                      </span>
                      <span className="ml-1 font-light">
                        {order.data.shippingAddress.neighborhood}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">
                        {t("common.delegation-or-municipality")}:
                      </span>
                      <span className="ml-1 font-light">
                        {order.data.shippingAddress.municipality}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">{t("common.city")}:</span>
                      <span className="ml-1 font-light">
                        {order.data.shippingAddress.city}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">
                        {t("common.state")}:
                      </span>
                      <span className="ml-1 font-light">
                        {order.data.shippingAddress.state}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">
                        {t("common.zip-code")}:
                      </span>
                      <span className="ml-1 font-light">
                        {order.data.shippingAddress.postalCode || "-"}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Status */}
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg flex-1">
                      {t("common.status")}
                    </span>
                    <Button
                      className="flex-1 bg-[#FFD8B9] hover:bg-[#FFD8B9] hover:opacity-85 text-[#C26523] px-4 py-1"
                      // onClick={() => setOrderStatusModal(true)}
                    >
                      {t(`common.order-statuses.${order.data.status}` as any)}
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </>
        )
      )}

      <OrderStatusModal
        open={orderStatusModal}
        onOpenChange={setOrderStatusModal}
        orderId="1"
        productImage={ASSETS["cloth-1.png"]}
        orderDate="13 Feb, 2025"
        currentStatus={orderStatus}
        onUpdateStatus={setOrderStatus}
      />
    </div>
  );
}
