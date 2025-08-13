"use client";

import type React from "react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ASSETS } from "@/lib/constants";
import { useUpdatePassword } from "@/lib/mutations";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

interface UpdatePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpdatePasswordModal({
  isOpen,
  onClose,
}: UpdatePasswordModalProps) {
  const t = useTranslations();
  const updatePassword = useUpdatePassword();
  const updatePasswordFormSchema = z
    .object({
      password: z
        .string({ message: t("modals.signup.password-required") })
        .min(8, { message: t("modals.signup.password-length") })
        .max(100),
      newPassword: z
        .string({ message: t("modals.update-password.new-password-required") })
        .min(8, { message: t("modals.signup.password-length") })
        .max(100),
      confirmPassword: z.string(),
    })
    .superRefine(({ newPassword, confirmPassword }, ctx) => {
      if (newPassword !== confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("modals.signup.passwords-mismatch"),
          path: ["confirmPassword"],
        });
      }
    });

  type UpdatePasswordFormData = z.infer<typeof updatePasswordFormSchema>;
  const updatePasswordForm = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordFormSchema),
  });

  useEffect(() => {
    if (updatePassword.isSuccess) {
      updatePasswordForm.reset();
      onClose();
    }
  }, [updatePassword.isSuccess]);

  function onSubmit(data: UpdatePasswordFormData) {
    updatePassword.mutate(data);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-modal-gradient">
        {/* Close Button */}
        <DialogClose className="absolute  w-10 h-10 right-2 top-2 rounded-full bg-black flex justify-center items-center opacity-100 transition-opacity hover:opacity-70 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <Image
            src={ASSETS["cross-white.svg"] || "/placeholder.svg"}
            alt="ZECOND CLOSET SALE"
            width={14}
            height={14}
          />
          <span className="sr-only">Close</span>
        </DialogClose>

        <div className="p-6 space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src={ASSETS["zecond-logo-black.png"] || "/placeholder.svg"}
              alt="ZECOND CLOSET SALE"
              width={200}
              height={100}
              className="w-60"
            />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center">
            {t("modals.update-password.heading")}
          </h2>

          {/* Form */}
          <Form {...updatePasswordForm}>
            <form
              onSubmit={updatePasswordForm.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={updatePasswordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder={t("modals.update-password.old-password")}
                        className="h-12 px-5 rounded-full bg-transparent border-black focus-visible:ring-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updatePasswordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder={t("modals.update-password.new-password")}
                        className="h-12 px-5 rounded-full bg-transparent border-black focus-visible:ring-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updatePasswordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder={t(
                          "modals.update-password.confirm-password",
                        )}
                        className="h-12 px-5 rounded-full bg-transparent border-black focus-visible:ring-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 bg-black hover:bg-black/90 text-white rounded-full mt-6"
                disabled={updatePassword.isPending}
              >
                {t("common.set-new-password")}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
