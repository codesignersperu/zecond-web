"use client";

import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useGetAddresses } from "@/lib/queries";
import { PulseLoader } from "react-spinners";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useUpdateAddress, useDeleteAddress } from "@/lib/mutations";
import { useModalStore, Modal } from "@/lib/stores";
import CreateAddressModal from "@/components/common/modals/create-address-modal";

export default function AddressesPage() {
  const t = useTranslations();
  const {
    data: res,
    isLoading: getAddressesLoading,
    isSuccess: getAddressesSuccess,
  } = useGetAddresses({});
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const { openModal } = useModalStore();
  const [currentSelected, setCurrentSelected] = useState(-1);

  useEffect(() => {
    if (getAddressesSuccess) {
      const id = res?.data.find((addr) => addr.isPrimary)?.id;
      if (id) setCurrentSelected(id);
    }
  }, [getAddressesSuccess]);

  function onDelete(id: number) {
    const confirmation = confirm(t("modals.add-address.delete-confirmation"));

    if (confirmation) deleteAddress.mutate(id);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-center sm:text-left text-2xl font-bold">
        {t("common.my-addresses")}
      </h1>

      <RadioGroup
        value={currentSelected.toString()}
        onValueChange={(e) => {
          setCurrentSelected(+e);
          updateAddress.mutate({ id: +e, isPrimary: true });
        }}
      >
        <div className="space-y-4">
          {getAddressesLoading ? (
            <div className="flex py-12 sm:py-16 justify-center items-center">
              <PulseLoader color="#d9d9d9" />
            </div>
          ) : (
            res?.data.map((address) => (
              <div
                key={address.id}
                className="rounded-2xl border border-[#D7D7D7] p-6 shadow-shadow-2"
              >
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
                <div className="flex flex-wrap mt-4 gap-3 justify-between items-center">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      value={address.id.toString()}
                      id={address.id.toString()}
                      className="w-5 h-5"
                    />
                    <Label
                      htmlFor={address.id.toString()}
                      className="text-base text-gray-500 cursor-pointer mt-1"
                    >
                      {address.isPrimary
                        ? t("common.default")
                        : t("common.change-default")}
                    </Label>
                  </div>
                  <div className="flex gap-2 items-center justify-end">
                    <button
                      className="hover:text-[#424242]"
                      onClick={() =>
                        openModal({
                          modal: Modal.AddAddress,
                          data: {
                            mode: "edit",
                            address: address,
                          },
                        })
                      }
                    >
                      {t("common.edit")}
                    </button>
                    <span>|</span>
                    <button
                      className="hover:text-[#424242]"
                      onClick={() => onDelete(address.id)}
                    >
                      {t("common.delete")}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </RadioGroup>

      <Button
        variant="outline"
        className="flex items-center gap-2 rounded-full border-2 px-6 font-medium"
        disabled={getAddressesLoading}
        onClick={() =>
          openModal({
            modal: Modal.AddAddress,
            data: {
              mode: "add",
            },
          })
        }
      >
        <Plus className="h-5 w-5" />
        {t("common.add-address")}
      </Button>

      <CreateAddressModal />
    </div>
  );
}
