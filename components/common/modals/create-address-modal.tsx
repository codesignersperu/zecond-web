"use client";

import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { ASSETS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Modal, useModalStore, useGlobalStore } from "@/lib/stores";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAddAddress, useUpdateAddress } from "@/lib/mutations";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  useGetAddressCities,
  useGetAddressMunicipalities,
  useGetAddressNeighborhoods,
  useGetAddressStates,
  useGetPostalAddress,
} from "@/lib/queries";
import { Combobox } from "@/components/ui/combobox";

export default function CreateAddressModal() {
  const { currentOpenedModal, closeModal, addAddressModalData } =
    useModalStore();
  const { user } = useGlobalStore();
  const t = useTranslations();
  const addAddress = useAddAddress();
  const updateAddress = useUpdateAddress();
  const addressFormSchema = z.object({
    recipientName: z
      .string()
      .min(5, { message: t("modals.add-address.recipient-name-required") }),
    phoneNumber: z
      .string()
      .min(10, { message: t("modals.add-address.recipient-name-required") }),
    state: z
      .string()
      .min(1, { message: t("modals.add-address.state-required") }),
    municipality: z
      .string()
      .min(1, { message: t("modals.add-address.municipality-required") }),
    city: z.string().min(1, { message: t("modals.add-address.city-required") }),
    neighborhood: z
      .string()
      .min(1, { message: t("modals.add-address.neighborhood-required") }),
    street: z
      .string()
      .min(3, { message: t("modals.add-address.street-required") }),
    exteriorReference: z
      .string()
      .min(3, { message: t("modals.add-address.exterior-required") }),
    interiorReference: z.string().optional(),
    postalCode: z
      .string()
      .min(5, { message: t("modals.add-address.postal-code-required") })
      .transform((v) => Number(v) as any as string),
  });

  type AddressFormData = z.infer<typeof addressFormSchema>;
  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressFormSchema),
  });

  function setPostalData(v: string[]) {
    addressForm.setValue("state", v[3]);
    addressForm.setValue("municipality", v[2]);
    addressForm.setValue("city", v[1]);
    addressForm.setValue("neighborhood", v[0]);
  }

  const {
    data: postalRes,
    isLoading: postalLoading,
    isSuccess: postalSuccess,
  } = useGetPostalAddress(addressForm.watch("postalCode"));
  useEffect(() => {
    if (postalSuccess && postalRes.data.length === 1) {
      setPostalData(postalRes.data[0]);
    }
  }, [postalSuccess]);

  const { data: statesRes } = useGetAddressStates();
  const { data: municipalitiesRes } = useGetAddressMunicipalities(
    addressForm.watch("state"),
  );
  const { data: citiesRes } = useGetAddressCities(
    addressForm.watch("state"),
    addressForm.watch("municipality"),
  );
  const { data: neighborhoodsRes } = useGetAddressNeighborhoods(
    addressForm.watch("state"),
    addressForm.watch("municipality"),
    addressForm.watch("city"),
  );

  function onSelectChange(
    type: "state" | "municipality" | "city" | "neighborhood",
    v,
  ) {
    switch (type) {
      case "state":
        addressForm.setValue("neighborhood", "");
        addressForm.setValue("city", "");
        addressForm.setValue("municipality", "");
        addressForm.setValue("state", v);
        break;
      case "municipality":
        addressForm.setValue("neighborhood", "");
        addressForm.setValue("city", "");
        addressForm.setValue("municipality", v);
        break;
      case "city":
        addressForm.setValue("neighborhood", "");
        addressForm.setValue("city", v);
        break;
      case "neighborhood":
        addressForm.setValue("neighborhood", v);
        break;
    }
  }
  function onFinish() {
    if (addAddress.isSuccess || updateAddress.isSuccess) {
      addressForm.reset();
      closeModal();
    }
  }
  useEffect(() => {
    onFinish();
  }, [addAddress.isSuccess, updateAddress.isSuccess]);

  useEffect(() => {
    if (addAddressModalData && addAddressModalData.mode === "edit") {
      Object.entries(addAddressModalData.address).forEach(([k, v]) => {
        if (["number", "string", "boolean"].includes(typeof v)) {
          // @ts-ignore
          addressForm.setValue(k, v?.toString());
        }
      });
    } else {
      addressForm.reset();
      if (user) {
        addressForm.setValue(
          "recipientName",
          user.firstName + " " + user.lastName,
        );
        if (user.phoneNumber)
          addressForm.setValue("phoneNumber", user.phoneNumber);
      }
    }
  }, [addAddressModalData]);

  function onSubmit(data: AddressFormData) {
    addAddressModalData?.mode === "add"
      ? addAddress.mutate(data)
      : updateAddress.mutate({
          ...data,
          id: addAddressModalData?.address.id,
        } as any);
  }

  return (
    <Dialog
      open={currentOpenedModal === Modal.AddAddress}
      onOpenChange={closeModal}
    >
      <DialogContent
        className="max-w-[350px] sm:max-w-[480px] px-[30px] sm:px-[60px] py-[30px]
      !rounded-[20px] max-h-[80%] overflow-y-auto"
      >
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
        <DialogHeader className="text-center space-y-6">
          <div className="space-y-2 text-center">
            <DialogTitle className="text-2xl font-bold text-[#1C1C1C] tracking-wide leading-[1.1] sm:leading-tight">
              {t("modals.add-address.heading")}
            </DialogTitle>
          </div>
        </DialogHeader>

        <Form {...addressForm}>
          <form
            className="mt-4 sm:mt-6 space-y-4 sm:space-y-4"
            onSubmit={addressForm.handleSubmit(onSubmit)}
          >
            <FormField
              control={addressForm.control}
              name="recipientName"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>
                    {t("modals.add-address.recipient-name")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder={t("modals.add-address.enter-recipient-name")}
                      className="w-full bg-transparent focus-visible:outline-none ring-0 h-[44px] rounded-none border-0 border-b border-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={addressForm.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>{t("modals.add-address.phone-number")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder={t("modals.add-address.enter-phone-number")}
                      className="w-full bg-transparent focus-visible:outline-none ring-0 h-[44px] rounded-none border-0 border-b border-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={addressForm.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>{t("modals.add-address.postal-code")}</FormLabel>
                  <FormControl>
                    <div>
                      <div className="relative">
                        <Input
                          {...field}
                          type="text"
                          placeholder={t(
                            "modals.add-address.enter-postal-code",
                          )}
                          className="appearance-none w-full no-arrows bg-transparent focus-visible:outline-none ring-0 h-[44px] rounded-none border-0 border-b border-black"
                          pattern="^\d{5,}$"
                        />
                        {postalLoading && (
                          <div className="absolute top-1/2 -translate-y-1/2 right-2">
                            <Loader2 className="size-5 animate-spin mr-2" />
                          </div>
                        )}
                      </div>
                      {!addressForm.watch("state") &&
                        !postalLoading &&
                        (postalRes?.data?.length || 0) > 2 && (
                          <>
                            <p className="mt-3 mb-2">
                              {t("modals.add-address.select-your-neighborhood")}
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {(postalRes?.data || []).map((v) => (
                                <div
                                  className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md line-clamp-1 cursor-pointer"
                                  onClick={() => setPostalData(v)}
                                >
                                  {v[0]}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={addressForm.control}
              name="state"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>{t("modals.add-address.state")}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(v) => v && onSelectChange("state", v)}
                      disabled={field.disabled}
                      name={field.name}
                      value={field.value}
                    >
                      <SelectTrigger
                        className={cn(
                          "focus:outline-none focus-visible:ring-0 border-0 border-b border-black rounded-none placeholder:text-sm",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <SelectValue
                          placeholder={t("modals.add-address.select-state")}
                        />
                      </SelectTrigger>
                      <SelectContent className="max-h-80">
                        {(statesRes?.data || []).map((v) => (
                          <SelectItem value={v} key={v}>
                            {v}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={addressForm.control}
              name="municipality"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>{t("modals.add-address.municipality")}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(v) =>
                        v && onSelectChange("municipality", v)
                      }
                      disabled={field.disabled}
                      name={field.name}
                      value={field.value}
                    >
                      <SelectTrigger
                        className={cn(
                          "focus:outline-none focus-visible:ring-0 border-0 border-b border-black rounded-none placeholder:text-sm",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <SelectValue
                          placeholder={t(
                            "modals.add-address.select-municipality",
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent className="max-h-80">
                        {!addressForm.watch("state") ? (
                          <SelectItem value="-" disabled>
                            {t("modals.add-address.select-state-first")}
                          </SelectItem>
                        ) : (
                          (municipalitiesRes?.data || []).map((v) => (
                            <SelectItem value={v} key={v}>
                              {v}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={addressForm.control}
              name="city"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>{t("modals.add-address.city")}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(v) => v && onSelectChange("city", v)}
                      disabled={field.disabled}
                      name={field.name}
                      value={field.value}
                    >
                      <SelectTrigger
                        className={cn(
                          "focus:outline-none focus-visible:ring-0 border-0 border-b border-black rounded-none placeholder:text-sm",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <SelectValue
                          placeholder={t("modals.add-address.select-city")}
                        />
                      </SelectTrigger>
                      <SelectContent className="max-h-80">
                        {!addressForm.watch("municipality") ? (
                          <SelectItem value="-" disabled>
                            {t("modals.add-address.select-municipality-first")}
                          </SelectItem>
                        ) : (
                          (citiesRes?.data || []).map((v) => (
                            <SelectItem value={v} key={v}>
                              {v}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={addressForm.control}
              name="neighborhood"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>{t("modals.add-address.neighborhood")}</FormLabel>
                  <FormControl>
                    <Combobox
                      values={neighborhoodsRes?.data || []}
                      value={addressForm.watch("neighborhood")}
                      setValue={(v) => v && onSelectChange("neighborhood", v)}
                      placeholder={t("modals.add-address.select-neighborhood")}
                      searchPlaceholder={t(
                        "modals.add-address.search-neighborhood",
                      )}
                      selectFirstOption={t(
                        "modals.add-address.select-city-first",
                      )}
                      classNames={{
                        trigger:
                          "w-full border-0 border-b border-black rounded-none hover:bg-transparent",
                        content: "max-h-80",
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={addressForm.control}
              name="street"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>{t("modals.add-address.street")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder={t("modals.add-address.enter-street")}
                      className="w-full no-arrows bg-transparent focus-visible:outline-none ring-0 h-[44px] rounded-none border-0 border-b border-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={addressForm.control}
              name="exteriorReference"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>{t("modals.add-address.exterior")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder={t("modals.add-address.enter-exterior")}
                      className="w-full no-arrows bg-transparent focus-visible:outline-none ring-0 h-[44px] rounded-none border-0 border-b border-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={addressForm.control}
              name="interiorReference"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>
                    {t("modals.add-address.interior")} ({t("common.optional")})
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder={t("modals.add-address.enter-interior")}
                      className="w-full no-arrows bg-transparent focus-visible:outline-none ring-0 h-[44px] rounded-none border-0 border-b border-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full rounded-full h-[44px] border border-black bg-black hover:bg-black/90"
              type="submit"
              disabled={addAddress.isPending || updateAddress.isPending}
            >
              {t("modals.add-address.confirm-address")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
