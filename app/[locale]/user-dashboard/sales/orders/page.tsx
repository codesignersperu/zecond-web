"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ASSETS } from "@/lib/constants";
import { cn, formatCurrency } from "@/lib/utils";
import { useGetMyBalance, useGetMySales } from "@/lib/queries/revenue";
import { PulseLoader } from "react-spinners";
import { useState } from "react";
import { WithdrawalRequestModal } from "@/components/common/modals/withdrawal-request-modal";
import { AddWithdrawalBankModal } from "@/components/common/modals/add-withdrawal-bank-modal";
import dayjs from "dayjs";

const statusStyles = {
  pending: "bg-[#F2E3CE] text-[#B98D50]",
  processing: "bg-[#F2E3CE] text-[#B98D50]",
  succeeded: "bg-[#D1F2DA] text-[#50B96F]",
  cancelled: "bg-[#E7E7E7] text-[#898989]",
};

function FormattedCurrency(props: { amount: number }) {
  let str = formatCurrency(props.amount);
  let [integer, decimal] = str.split(".");
  return (
    <span className="text-3xl sm:text-4xl font-bold">
      {integer}
      <span className="text-xl">.{decimal}</span>
    </span>
  );
}

export default function OrdersPage() {
  const t = useTranslations();
  const {
    data: balance,
    isLoading: balanceLoading,
    isSuccess: balanceSuccess,
    error: balanceError,
  } = useGetMyBalance();

  const {
    data: sales,
    isLoading: salesLoading,
    isSuccess: salesSuccess,
    error: salesError,
  } = useGetMySales();

  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  function openAccountModal() {
    setWithdrawalModalOpen(false);
    setAccountModalOpen(true);
  }

  function openWithdrawalModal() {
    setAccountModalOpen(false);
    setWithdrawalModalOpen(true);
  }

  return (
    <div className="space-y-8">
      {/* Sales Balance */}
      <div className="space-y-8">
        <h1 className="text-center sm:text-left text-2xl font-bold">
          {t("common.balance-of-my-sales")}
        </h1>
        {balanceLoading ? (
          <div className="h-[84px] flex justify-center items-center">
            <PulseLoader color="#d9d9d9" size={15} />
          </div>
        ) : (
          balanceSuccess && (
            <div className="grid grid-cols-2 items-center rounded-[20px] border border-black bg-white">
              <div className="flex-1 px-4 sm:px-8 py-4">
                <FormattedCurrency amount={balance.data.availableBalance} />
              </div>
              <Button
                className="flex flex-1 uppercase !h-[72px] sm:!h-[82px] rounded-none rounded-r-[20px] bg-black font-bold !px-4 sm:!px-8 hover:bg-black/90"
                onClick={() => setWithdrawalModalOpen(true)}
              >
                <Image
                  src={ASSETS["print-white.svg"] || "/placeholder.svg"}
                  alt="Withdraw"
                  width={36}
                  height={36}
                  className="w-7 h-7 sm:w-9 sm:h-9 mr-2"
                />
                {t("common.withdraw-funds")}
              </Button>
            </div>
          )
        )}
      </div>

      <div className="flex justify-center">
        <Link
          href={"/user-dashboard/sales/orders/withdrawal-requests"}
          className="text-black font-bold underline underline-offset-8"
        >
          {t("dashboard.my-orders.view-withdrawal-requests")}
        </Link>
      </div>

      {/* Promotional Banner */}
      <div className="rounded-2xl bg-[#E4F6D9] p-6">
        <div className="flex items-start gap-4">
          <Image
            src={ASSETS["flash-green.svg"] || "/placeholder.svg"}
            alt="Lightning"
            width={24}
            height={24}
            className="mt-1"
          />
          <div className="space-y-1">
            <h2 className="text-xl font-bold">{t("common.orders-banner")}</h2>
            <p className="text-[#424242]">{t("common.orders-banner-para")}</p>
            <button className="text-[#50B96F] font-medium hover:underline">
              {t("common.upload-article")}
            </button>
          </div>
        </div>
      </div>
      {/* Orders Table */}
      <div className="space-y-6 max-w-[92vw] sm:max-w-[85vw] overflow-x-scroll">
        <h2 className="text-2xl font-bold">
          {t("navigation.dashboard.orders")}
        </h2>
        {salesLoading ? (
          <div className="h-[100px] flex justify-center items-center">
            <PulseLoader color="#d9d9d9" size={15} />
          </div>
        ) : salesError ? (
          <div className="h-[100px] flex justify-center text-red-500 text-center items-center">
            {t("common.error-occured")}
          </div>
        ) : (
          salesSuccess &&
          (!sales.data.transactions.length ? (
            <div className="h-[100px] flex justify-center items-center">
              {t("dashboard.my-orders.no-orders")}
            </div>
          ) : (
            <Table className="min-w-max border-collapse">
              <TableHeader>
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="w-[150px]">
                    {t("common.date")}
                  </TableHead>
                  <TableHead>{t("common.description")}</TableHead>
                  <TableHead className="text-right">
                    {t("common.amount")}
                  </TableHead>
                  <TableHead className="text-right w-[150px]">
                    {t("common.status")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.data.transactions.map((trx, index) => (
                  <TableRow
                    key={index}
                    className={`rounded-xl border-none ${index % 2 === 0 ? "bg-gray-100" : ""}`}
                  >
                    <TableCell>
                      {dayjs(trx.createdAt).format("DD MMM YYYY")}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/user-dashboard/sales/orders/${trx.orderId}`}
                        className="hover:underline text-ellipsis"
                      >
                        {t("common.order")} #{trx.orderId} -{" "}
                        {trx.order.buyer.firstName +
                          " " +
                          trx.order.buyer.lastName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(trx.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={cn(
                          "inline-block rounded-[10px] text-center px-4 py-2 text-sm font-medium",
                          statusStyles[trx.status],
                        )}
                      >
                        {t(`common.transaction-statuses.${trx.status}` as any)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ))
        )}
      </div>

      {/* Modals */}
      <WithdrawalRequestModal
        open={withdrawalModalOpen}
        onChange={(v) => setWithdrawalModalOpen(v)}
        addAccount={openAccountModal}
        availableBalance={balance?.data.availableBalance}
      />

      <AddWithdrawalBankModal
        open={accountModalOpen}
        onChange={() => openWithdrawalModal()}
      />
    </div>
  );
}
