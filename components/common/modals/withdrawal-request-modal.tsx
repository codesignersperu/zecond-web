"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ASSETS } from "@/lib/constants";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  useGetMyBalance,
  useGetMyWithdrawalAccounts,
} from "@/lib/queries/revenue";
import { PulseLoader } from "react-spinners";
import {
  useCreateWithdrawalRequest,
  useDeleteWithdrawalAccount,
} from "@/lib/mutations";
import AutoWidthInput from "../auto-width-input";
import toast from "react-hot-toast";
import { formatAccountNumber, formatCurrency } from "@/lib/utils";

type Account = {
  id: number;
  bank: string;
  accountNumber: string;
  cciNumber: string;
  isPrimary: boolean;
};

interface WithdrawalRequestModalProps {
  availableBalance: number | undefined;
  open: boolean;
  onChange: (open: boolean) => void;
  addAccount: () => void;
}

export function WithdrawalRequestModal({
  availableBalance,
  open,
  onChange,
  addAccount,
}: WithdrawalRequestModalProps) {
  const t = useTranslations();
  const deleteAccount = useDeleteWithdrawalAccount();
  const createRequest = useCreateWithdrawalRequest();
  const [amount, setAmount] = useState("");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value) && availableBalance) {
      let num = parseFloat(value) || 0;
      console.log("Number: ", num);
      if (num < availableBalance) {
        setAmount(value);
      } else {
        toast.error(
          t("dashboard.withdrawal-requests.amount-exceeds-available-balance"),
        );
      }
    }
  };
  const [selectedAccount, setSelectedAccount] = useState("");

  const {
    data: accounts,
    isLoading: accountsLoading,
    isSuccess: accountsSuccess,
  } = useGetMyWithdrawalAccounts();

  useEffect(() => {
    if (accountsSuccess && accounts.data.length) {
      setSelectedAccount(
        accounts.data.find((v) => v.isPrimary)?.id.toString() || "",
      );
    }
  }, []);

  function onDeleteAccount(accountId: number) {
    const confirmation = window.confirm(
      "Are you sure you want to delete this account?",
    );
    if (confirmation) {
      deleteAccount.mutate(accountId);
    }
  }

  async function onSubmit() {
    try {
      await createRequest.mutateAsync({
        amount: parseFloat(amount),
        accountId: parseInt(selectedAccount),
      });

      setAmount("");

      onChange(false);
    } catch {}
  }

  return (
    <Dialog open={open} onOpenChange={onChange}>
      <DialogContent className="p-0 max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex justify-end p-4">
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
        </div>
        <div className="text-center pb-3">
          <DialogHeader className="mb-5">
            <DialogTitle className="text-2xl uppercase font-bold text-center">
              {t("modals.withdrawal.title")}
            </DialogTitle>
          </DialogHeader>
          <div className="bg-gray-50 rounded-lg py-4 mb-2 flex flex-col items-center">
            <div className="text-lg font-medium mb-1">
              {t("modals.withdrawal.enter-amount")}
            </div>
            <div className="flex items-center justify-center gap-2 text-2xl font-semibold">
              <span>S/</span>
              <AutoWidthInput
                type="number"
                id="offer-bid-input"
                placeholder="0.00"
                className="text-4xl  font-semibold"
                value={amount}
                onChange={handleAmountChange}
              />
            </div>
            <div className="text-gray-400 text-sm mt-2">
              {t("modals.withdrawal.available-balance")}:
              {formatCurrency(availableBalance || 0)}
            </div>
          </div>
        </div>
        <form
          className="px-6 pb-6"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <h3 className="font-semibold mb-2">
            {t("modals.withdrawal.saved-accounts")}
          </h3>
          {accountsLoading ? (
            <div className="h-[100px] flex justify-center items-center">
              <PulseLoader color="#d9d9d9" size={10} />
            </div>
          ) : (
            accountsSuccess &&
            (!accounts.data.length ? (
              <div className="h-[100px] flex justify-center items-center text-center text-muted-foreground">
                {t("modals.withdrawal.add-account")}
              </div>
            ) : (
              <RadioGroup
                value={
                  selectedAccount ||
                  accounts.data.find((v) => v.isPrimary)?.id.toString()
                }
                defaultValue={accounts.data
                  .find((v) => v.isPrimary)
                  ?.id.toString()}
                onValueChange={(value) => setSelectedAccount(value.toString())}
                className="flex flex-col gap-3 max-h-[180px] overflow-y-auto"
              >
                {accounts.data.map((acc) => (
                  <div
                    key={acc.id}
                    className={`flex justify-between items-end p-3 rounded-lg border ${
                      (!selectedAccount && acc.isPrimary) ||
                      (selectedAccount && selectedAccount === String(acc.id))
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <Label
                      htmlFor={`withdrawal-account-${acc.id}`}
                      className="cursor-pointer"
                    >
                      <div>
                        <div className="font-semibold">{acc.bank}</div>
                        <div className="text-xs text-gray-600">
                          {formatAccountNumber(acc.accountNumber)}
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          <RadioGroupItem
                            value={String(acc.id)}
                            id={`withdrawal-account-${acc.id}`}
                          />
                          <span className="text-xs">
                            {t("common.predetermined")}
                          </span>
                        </div>
                      </div>
                    </Label>
                    <button
                      className="text-gray-400 text-sm"
                      disabled={deleteAccount.isPending}
                      onClick={() => onDeleteAccount(acc.id)}
                    >
                      {t("common.delete")}
                    </button>
                  </div>
                ))}
              </RadioGroup>
            ))
          )}
          <Button
            variant="outline"
            className="mt-3 mb-5 block rounded-full mx-auto"
            disabled={accountsLoading}
            onClick={addAccount}
            type="button"
          >
            + {t("modals.withdrawal.add-account-button")}
          </Button>
          <Button
            className="w-full uppercase rounded-full bg-green-600 hover:bg-green-700"
            type="submit"
            disabled={
              amount === "" ||
              amount === "0" ||
              !availableBalance ||
              parseFloat(amount) > availableBalance ||
              createRequest.isPending
            }
          >
            {t("modals.withdrawal.send-request")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
