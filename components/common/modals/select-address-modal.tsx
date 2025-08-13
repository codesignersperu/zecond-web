"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ASSETS } from "@/lib/constants";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Modal, useModalStore } from "@/lib/stores";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetAddresses } from "@/lib/queries";
import { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";

export default function SelectAddressModal() {
  const t = useTranslations();
  const {
    currentOpenedModal,
    closeModal,
    openModal,
    selectAddressModalData: modalData,
  } = useModalStore();

  const {
    data: res,
    isLoading: getAddressesLoading,
    isSuccess: getAddressesSuccess,
  } = useGetAddresses({});

  const [currentSelected, setCurrentSelected] = useState(-1);
  useEffect(() => {
    if (getAddressesSuccess) {
      const id = res?.data.find((addr) => addr.isPrimary)?.id;
      if (id) setCurrentSelected(id);
    }
  }, [getAddressesSuccess]);

  function addAddress() {
    openModal({ modal: Modal.AddAddress, data: { mode: "add" } });
  }

  function onClose() {
    closeModal();
    modalData?.onSubmit(currentSelected);
  }

  return (
    <Dialog
      open={currentOpenedModal === Modal.SelectAddress}
      onOpenChange={onClose}
    >
      <DialogContent
        className="max-w-[350px] sm:max-w-[480px] px-[30px] py-[30px]
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
              {t("common.select-address")}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <RadioGroup
            value={currentSelected.toString()}
            onValueChange={(e) => {
              setCurrentSelected(+e);
            }}
          >
            <div className="space-y-4">
              {getAddressesLoading ? (
                <div className="flex py-12 sm:py-16 justify-center items-center">
                  <PulseLoader color="#d9d9d9" />
                </div>
              ) : (
                res?.data.map((address) => (
                  <Label
                    htmlFor={address.id.toString()}
                    className="text-base block text-gray-500 cursor-pointer mt-1"
                  >
                    <div
                      key={address.id}
                      className="rounded-2xl flex gap-5 items-center border border-[#D7D7D7] p-6 shadow-shadow-2"
                    >
                      <RadioGroupItem
                        value={address.id.toString()}
                        id={address.id.toString()}
                        className="w-5 h-5"
                      />
                      <div className="flex flex-col gap-2">
                        <p className="text-[#424242] font-semibold">
                          {address.recipientName}
                        </p>
                        <p className="text-[#424242]">
                          {address.exteriorReference}, {address.street},{" "}
                          {address.neighborhood}, {address.city}
                        </p>
                        <p className="text-[#424242]">
                          {address.municipality}, {address.state}
                        </p>
                        {address.interiorReference && (
                          <p className="text-[#424242]">
                            {address.interiorReference}
                          </p>
                        )}
                        <p className="text-[#424242]">{address.phoneNumber}</p>
                      </div>
                    </div>
                  </Label>
                ))
              )}
            </div>
          </RadioGroup>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-full border-2 px-6 font-medium"
              disabled={getAddressesLoading}
              onClick={addAddress}
            >
              {t("common.add-address")}
            </Button>
            <Button
              variant="default"
              className="flex items-center gap-2 rounded-full border-2 px-6 font-medium"
              disabled={getAddressesLoading}
              onClick={onClose}
            >
              {t("common.continue")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
