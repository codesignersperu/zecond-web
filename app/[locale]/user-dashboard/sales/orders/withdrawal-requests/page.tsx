"use client";
import { WithdrawalTransaction } from "@/lib/types";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import dayjs from "dayjs";
import { cn, formatAccountNumber, formatCurrency } from "@/lib/utils";
import { useGetMyWithdrawalRequests } from "@/lib/queries/revenue";
import { PulseLoader } from "react-spinners";

const statusStyles = {
  rejected: "bg-red-100 text-red-400",
  pending: "bg-[#F2E3CE] text-[#B98D50]",
  processing: "bg-[#F2E3CE] text-[#B98D50]",
  succeeded: "bg-[#D1F2DA] text-[#50B96F]",
  cancelled: "bg-[#E7E7E7] text-[#898989]",
};

export default function WithdrawalRequestsPage() {
  const t = useTranslations();

  const {
    data: withdrawal,
    isLoading: withdrawalLoading,
    isSuccess: withdrawalSuccess,
    error: withdrawalError,
  } = useGetMyWithdrawalRequests();

  return (
    <div>
      <div className="mb-12">
        <Link
          href={"/user-dashboard/sales/orders"}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="size-6 hidden sm:inline" />
          <span className="uppercase font-semibold ml-10 sm:ml-0">
            {t("dashboard.withdrawal-requests.sales")}
          </span>
        </Link>
      </div>
      <h1 className="text-center uppercase text-2xl font-semibold mb-12">
        {t("dashboard.withdrawal-requests.title")}
      </h1>

      {withdrawalLoading ? (
        <div className="h-[100px] flex justify-center items-center">
          <PulseLoader color="#d9d9d9" size={15} />
        </div>
      ) : withdrawalError ? (
        <div className="h-[100px] flex justify-center text-red-500 text-center items-center">
          {t("common.error-occured")}
        </div>
      ) : (
        withdrawalSuccess &&
        (!withdrawal.data.transactions.length ? (
          <div className="h-[100px] flex justify-center items-center">
            {t("dashboard.my-orders.no-orders")}
          </div>
        ) : (
          <div className="space-y-3">
            {withdrawal.data.transactions.map((trx) => (
              <WithdrawalRequestCard {...trx} key={trx.id} />
            ))}
          </div>
        ))
      )}
    </div>
  );
}

function WithdrawalRequestCard(trx: WithdrawalTransaction) {
  const t = useTranslations();
  return (
    <div className="flex px-4 py-4 bg-gray-100 rounded-2xl items-center gap-10 sm:gap-20">
      <div className="flex-1 flex flex-col lg:flex-row gap-2 items-start lg:items-center justify-between">
        <p className="text-nowrap">
          {dayjs(trx.createdAt).format("DD MMM YYYY")}
        </p>
        <div>
          <p className="font-bold mb-1"> {trx.account.bank}</p>
          <p className="text-nowrap text-ellipsis">
            {formatAccountNumber(trx.account.accountNumber)}
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-2 items-end lg:items-center justify-between">
        <p className="font-bold">{formatCurrency(trx.amount)}</p>
        <span
          className={cn(
            "inline-block rounded-[10px] text-center px-4 py-2 text-sm font-medium",
            statusStyles[trx.status],
          )}
        >
          {t(`common.transaction-statuses.${trx.status}` as any)}
        </span>
      </div>
    </div>
  );
}
