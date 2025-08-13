"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ASSETS } from "@/lib/constants";

interface BillingHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type BillingRecord = {
  membership: string;
  transactionId: string;
  date: string;
  amount: number;
  status: "paid" | "unpaid";
};

// Mock data - replace with real data in production
const billingHistory: BillingRecord[] = [
  {
    membership: "CLOSET ILIMITADO",
    transactionId: "INV-C-2025-8985342",
    date: "13 feb 2025",
    amount: 45.0,
    status: "unpaid",
  },
  {
    membership: "CLOSET 20",
    transactionId: "INV-C-2025-8664006",
    date: "13 feb 2025",
    amount: 45.0,
    status: "paid",
  },
  {
    membership: "CLOSET 20",
    transactionId: "INV-C-2024-8339241",
    date: "13 feb 2025",
    amount: 45.0,
    status: "paid",
  },
  {
    membership: "CLOSET 20",
    transactionId: "INV-C-2024-8339241",
    date: "13 feb 2025",
    amount: 45.0,
    status: "paid",
  },
];

export function BillingHistoryModal({
  open,
  onOpenChange,
}: BillingHistoryModalProps) {
  const t = useTranslations();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[350px] pt-8 sm:max-w-xl md:max-w-2xl lg:max-w-3xl rounded-2xl">
        {/* Close Button */}
        <DialogClose className="absolute w-7 h-7 sm:w-10 sm:h-10 right-2 top-2 rounded-full bg-black flex justify-center items-center opacity-100 transition-opacity hover:opacity-70 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <Image
            src={ASSETS["cross-white.svg"] || "/placeholder.svg"}
            alt="Close Modal"
            width={14}
            height={14}
            className="w-[10px] h-[10px] sm:w-[10px] sm:h-[10px]"
          />
          <span className="sr-only">Close</span>
        </DialogClose>

        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {t("dashboard.subscription.billing-history")}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-6 overflow-x-auto">
          <Table className="min-w-max">
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-black">
                  {t("common.membership")}
                </TableHead>
                <TableHead className="font-semibold text-black">
                  {t("common.transaction-id")}
                </TableHead>
                <TableHead className="font-semibold text-black">
                  {t("common.date")}
                </TableHead>
                <TableHead className="font-semibold text-black">
                  {t("common.amount")}
                </TableHead>
                <TableHead className="font-semibold text-black">
                  {t("common.status")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingHistory.map((record, index) => (
                <TableRow key={index}>
                  <TableCell className="font-light">
                    {record.membership}
                  </TableCell>
                  <TableCell className="font-light">
                    {record.transactionId}
                  </TableCell>
                  <TableCell className="font-light">{record.date}</TableCell>
                  <TableCell className="font-light">
                    $ {record.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div
                      className={cn(
                        "px-3 w-[120px] text-center py-2 rounded-xl text-sm",
                        record.status === "paid"
                          ? "bg-[#B9FFD3] text-black"
                          : "bg-[#FF6B6B] text-white",
                      )}
                    >
                      <span>
                        {record.status === "paid"
                          ? t("common.paid")
                          : t("common.not-paid")}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
