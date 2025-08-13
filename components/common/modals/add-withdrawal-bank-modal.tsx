import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useTranslations } from "next-intl";
import { ASSETS, MexicanBanks } from "@/lib/constants";
import Image from "next/image";
import { useAddWithdrawalAccount } from "@/lib/mutations";

export function AddWithdrawalBankModal({
  open,
  onChange,
}: {
  open: boolean;
  onChange: (v: boolean) => void;
}) {
  const t = useTranslations();
  const add = useAddWithdrawalAccount();

  const formSchema = z.object({
    bank: z.string().min(1, t("modals.add-bank.bank-name-required")),
    accountNumber: z
      .string()
      .min(1, t("modals.add-bank.account-number-required"))
      .regex(/^\d+$/, t("common.numbers-only")),
    cciNumber: z
      .string()
      .min(1, t("modals.add-bank.cci-number-required"))
      .regex(/^\d+$/, t("common.numbers-only")),
  });

  type FormValues = z.infer<typeof formSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bank: "",
      accountNumber: "",
      cciNumber: "",
    },
  });

  function closeModal() {
    form.reset();
    onChange(false);
  }

  async function onSubmit(data: FormValues) {
    try {
      await add.mutateAsync(data);
      closeModal();
    } catch {}
  }

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="max-w-sm w-full rounded-2xl px-0">
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

        <DialogHeader className="px-6 pt-6">
          <div className="flex items-center justify-center gap-4 mb-2">
            <img
              src={ASSETS["bank-black.svg"]}
              alt="bank icon"
              className="size-[30px]"
            />
            <DialogTitle className="text-xl font-bold">
              {t("modals.add-bank.title")}
            </DialogTitle>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 px-6"
          >
            <FormField
              control={form.control}
              name="bank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("modals.add-bank.bank-name")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-0 border-b rounded-none border-black focus-visible:ring-0">
                        <SelectValue
                          placeholder={t("modals.add-bank.select-bank-name")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MexicanBanks.map((bank) => (
                        <SelectItem key={bank} value={bank}>
                          {bank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("modals.add-bank.account-number")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-0 border-b rounded-none border-black focus-visible:ring-0"
                      placeholder={t("modals.add-bank.enter-account-number")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cciNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("modals.add-bank.cci-number")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-0 border-b rounded-none border-black focus-visible:ring-0"
                      placeholder={t("modals.add-bank.enter-cci-number")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full uppercase py-6 rounded-full text-base tracking-widest"
            >
              {t("modals.add-bank.confirm-account")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
