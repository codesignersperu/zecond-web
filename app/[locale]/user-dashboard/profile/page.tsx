"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ASSETS } from "@/lib/constants";
import UpdatePasswordModal from "@/components/common/modals/update-password-modal";
import { useGlobalStore } from "@/lib/stores";
import RatingStars from "@/components/common/rating-stars";
import { useUpdateUser, useDisconnectAccount } from "@/lib/mutations";
import { z } from "zod";
import { useForm } from "react-hook-form";
import type { Entries } from "type-fest";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetConnectedAccounts } from "@/lib/queries";

export default function ProfilePage() {
  const updateProfile = useUpdateUser();
  const t = useTranslations();
  const { user } = useGlobalStore();
  const connectedAccounts = useGetConnectedAccounts();
  const disconnectAccount = useDisconnectAccount();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const updateUserDetailsSchema = z.object({
    firstName: z.string().min(3),
    lastName: z.string().min(3),
    email: z.string().email(),
    username: z.string().min(3),
    phoneNumber: z.string().min(10).nullable(),
  });
  type UpdateUserDetailsSchema = z.infer<typeof updateUserDetailsSchema>;

  const updateForm = useForm<UpdateUserDetailsSchema>({
    resolver: zodResolver(updateUserDetailsSchema),
    defaultValues: useMemo(() => user || {}, [user]),
  });

  useEffect(() => {
    if (user) {
      updateForm.reset(user);
    }
  }, [user]);

  function onRemoveProfilePicture() {
    const confirmation = window.confirm(
      "Are you sure you want to delete the profile picture?",
    );
    if (!confirmation) return;
    updateProfile.mutate({ deleteAvatar: "true" });
  }

  function onSubmit(formValues: UpdateUserDetailsSchema) {
    type FinalObject = Partial<
      Omit<UpdateUserDetailsSchema, "phoneNumber"> & { phoneNumber: string }
    >;
    const finalObject: FinalObject = {};

    (Object.entries(formValues) as Entries<UpdateUserDetailsSchema>).forEach(
      ([key, val]) => {
        if (val && user && user[key] !== val) {
          finalObject[key] = val;
        }
      },
    );

    updateProfile.mutate(finalObject);
  }

  function onDisconnectAccount(provider: string) {
    const confirmation = confirm(t("common.confirm-disconnect-account"));

    if (confirmation) {
      disconnectAccount.mutate(provider);
    }
  }

  return (
    <div className="max-w-[720px]">
      {/* Profile Header */}
      <div className="flex flex-wrap justify-center sm:justify-start items-center gap-8 mb-12">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Image
              src={
                user ? user.avatarUrl : ASSETS["placeholder-profile-pic.png"]
              }
              alt="Profile Picture"
              width={135}
              height={135}
              className="rounded-full w-[135px] h-[135px] object-cover object-center"
            />
          </div>
          <div className="flex-1 min-w-fit">
            <h1 className="text-2xl font-bold mb-2">
              {user?.firstName} {user?.lastName}
            </h1>
            {user && (
              <RatingStars
                noOfReviews={user.noOfReviews}
                rating={user.rating}
              />
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <label
            htmlFor="update-user-profile-pic"
            className="inline-flex w-[130px] px-3 py-2 border rounded-full cursor-pointer"
          >
            <input
              id="update-user-profile-pic"
              type="file"
              className="w-0 h-0 invisible"
              onChange={(e) => {
                e.target.files &&
                  updateProfile.mutate({ avatarUrl: e.target.files[0] });
              }}
            />
            {t("common.change-photo")}
          </label>

          <Button
            variant="ghost"
            className="rounded-full px-6 text-red-500 hover:text-red-600"
            onClick={onRemoveProfilePicture}
          >
            {t("common.delete")}
          </Button>
        </div>
      </div>

      {/* Separator */}
      <hr className="border-none h-[1px] bg-[#DCDCDC] mb-8" />

      {/* Account Data */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold">{t("common.account-details")}</h2>

        <div className="grid sm:grid-cols-2 gap-10">
          {/* Form Fields */}
          <Form {...updateForm}>
            <form
              className="space-y-6"
              onSubmit={updateForm.handleSubmit(onSubmit)}
            >
              <div className="flex gap-3">
                <FormField
                  control={updateForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#898989]">
                        {t("modals.signup.firstName")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="rounded-xl py-3 border border-black focus-visible:ring-none focus-visible:ring-offset-0 h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#898989]">
                        {t("modals.signup.lastName")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="rounded-xl py-3 border border-black focus-visible:ring-none focus-visible:ring-offset-0 h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={updateForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#898989]">
                      {t("common.mail")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-xl py-3 border border-black focus-visible:ring-none focus-visible:ring-offset-0 h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#898989]">
                      {t("common.username")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-xl py-3 border border-black focus-visible:ring-none focus-visible:ring-offset-0 h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={updateForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#898989]">
                      {t("common.phone-number")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        className="rounded-xl py-3 border border-black focus-visible:ring-none focus-visible:ring-offset-0 h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                variant={"outline"}
                className="text-[#1374AA] hover:text-[#1374AA]/90 border border-[#1374AA]"
              >
                {t("common.save-changes")}
              </Button>
            </form>
          </Form>

          {/* Password Update */}
          <div className="space-y-2 flex flex-col justify-center">
            <h3 className="text-lg font-semibold">
              {t("common.update-your-password")}
            </h3>
            <p className="text-[#898989] text-sm mb-4">
              {t("common.update-password-instructions")}
            </p>
            <Button
              variant="outline"
              className="rounded-full flex gap-3 items-center px-6 text-[#1374AA] hover:text-[#1374AA]/90 border border-[#1374AA]"
              onClick={() => setIsPasswordModalOpen(true)}
            >
              <span>{t("common.set-new-password")}</span>
              <Image
                src={ASSETS["out-link.svg"] || "/placeholder.svg"}
                alt="External Link"
                width={20}
                height={20}
              />
            </Button>
          </div>
        </div>

        {/* Separator */}
        <hr className="border-none h-[1px] bg-[#DCDCDC] my-8" />

        {/* Connected Accounts */}
        {connectedAccounts.data && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">
              {t("common.connected-accounts")}
            </h2>
            <p className="text-[#898989] text-sm">
              {t("common.connected-accounts-para")}
            </p>

            {connectedAccounts.isSuccess &&
            connectedAccounts.data?.data?.length ? (
              connectedAccounts.data.data.map((v) => (
                <div className="flex items-center justify-between bg-white rounded-xl p-4 border">
                  <div className="flex items-center gap-3">
                    <Image
                      // @ts-ignore
                      src={ASSETS[v.provider + ".svg"] || "/placeholder.svg"}
                      alt="Google"
                      width={32}
                      height={32}
                    />
                    <span className="font-medium capitalize">{v.provider}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-green-600">
                      {t("common.connected")}
                    </span>
                    <Button
                      variant="outline"
                      className="rounded-full px-6"
                      onClick={() => onDisconnectAccount(v.provider)}
                    >
                      {t("common.disconnect")}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div>
                <p className="text-yellow-400">
                  *{t("common.no-connected-accounts")}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <UpdatePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}
