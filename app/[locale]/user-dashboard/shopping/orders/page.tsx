"use client";

import { useTranslations } from "next-intl";
import { ComponentRef, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetOrders } from "@/lib/queries";
import { PulseLoader } from "react-spinners";
import dayjs from "dayjs";
import { formatCurrency, imageUrl } from "@/lib/utils";
import { OrderInResonse } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function MyOrders() {
  const t = useTranslations();
  const router = useRouter();
  const linkRef = useRef<ComponentRef<"a">>(null);
  const { data: res, isLoading, isSuccess } = useGetOrders();
  const [reviewOrderModalOpen, setReviewOrderModalOpen] = useState(false);

  function orderActions(
    id: OrderInResonse["id"],
    status: OrderInResonse["status"],
    trackingUrl: OrderInResonse["shipmentTrackingUrl"],
    deliveredAt: OrderInResonse["deliveredAt"],
  ) {
    if (status === "shipped" && trackingUrl) {
      openShipmentTracking(trackingUrl);
    }
    if (status === "completed") {
      router.push("/user-dashboard/shopping/reviews");
    }
  }

  function openShipmentTracking(url: string) {
    if (linkRef.current) {
      linkRef.current.href = url;
      linkRef.current.click();
    }
  }

  return (
    <div className="">
      <h1 className="text-center sm:text-left text-2xl font-bold mb-6">
        {t("navigation.dashboard.my-orders")}
      </h1>
      <div className="space-y-4">
        {isLoading ? (
          <div className="h-[150px] flex justify-center items-center">
            <PulseLoader color="#d9d9d9" />
          </div>
        ) : isSuccess && !res.data.length ? (
          <div className="h-[150px] flex justify-center items-center">
            <p>No Orders right now</p>
          </div>
        ) : (
          isSuccess &&
          res.data.map((order) => (
            <div
              key={order.id}
              className="border border-[#D7D7D7] rounded-lg p-6 space-y-6"
            >
              <div className="flex flex-col xl:flex-row justify-between gap-6">
                <div className="">
                  <h2 className="text-lg font-semibold mb-4">
                    {order.deliveredAt ? (
                      <>
                        {t("dashboard.my-orders.delivered-on")}{" "}
                        {dayjs(order.deliveredAt)
                          .add(5, "days")
                          .format("DD MMM, YYYY")}
                      </>
                    ) : order.status === "shipped" ? (
                      <>
                        {t("dashboard.my-orders.estimated-deliver-for")}:{" "}
                        {dayjs(order.createdAt)
                          .add(5, "days")
                          .format("DD MMM, YYYY")}
                      </>
                    ) : null}
                  </h2>
                  <div className="flex gap-2 overflow-x-scroll no-scrollbar scroll-smooth">
                    {order.orderItems.map((item, idx) => (
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

                <div className="flex  flex-wrap justify-between xl:flex-col gap-4">
                  <Link href={`orders/${order.id}`}>
                    <Button
                      variant="link"
                      className="text-black p-0 text-[18px] font-semibold"
                    >
                      {t("dashboard.my-orders.view-order-details")}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>

                  <Button
                    variant={"default"}
                    className={`rounded-full ${
                      order.status === "completed"
                        ? "border-[#FF7E54] bg-[#FF7E54] text-white"
                        : "bg-black text-white hover:bg-black/90"
                    }`}
                    onClick={() =>
                      orderActions(
                        order.id,
                        order.status,
                        order.shipmentTrackingUrl,
                        order.deliveredAt,
                      )
                    }
                  >
                    {order.status === "pending"
                      ? t("dashboard.my-orders.payment") +
                        t(
                          `dashboard.my-orders.paymentStatus-actions.${order.paymentStatus}`,
                        )
                      : order.status === "shipped" && order.shipmentTrackingUrl
                        ? t("dashboard.my-orders.track-order")
                        : order.status === "completed" &&
                            order.orderItems.some((item) => {
                              if (item.product.reviews.length === 0)
                                return false;
                              return (
                                item.product.reviews[0].status === "pending"
                              );
                            })
                          ? t("dashboard.my-orders.leave-a-review")
                          : t(
                              `dashboard.my-orders.status-actions.${order.status}` as any,
                            )}
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 xl:justify-around">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">
                    {order.orderItems.length} {t("common.articles")}:
                  </p>
                  <p className="font-semibold">{formatCurrency(order.total)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">
                    {t("dashboard.my-orders.order-date")}:
                  </p>
                  <p className="font-semibold">
                    {dayjs(order.createdAt).format("DD MMM, YYYY")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">
                    {t("dashboard.my-orders.order-id")}:
                  </p>
                  <p className="font-semibold">{order.id}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <a ref={linkRef} href="" target="_blank"></a>
    </div>
  );
}
