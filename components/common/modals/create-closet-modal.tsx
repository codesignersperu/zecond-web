"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ASSETS } from "@/lib/constants";
import { ChevronRight } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { Modal, useModalStore } from "@/lib/stores";
import Checkbox1 from "../checkbox-1";

export default function CreateClosetModal() {
  const t = useTranslations();
  const [selectedPlan, setSelectedPlan] = useState<number>(1);
  const { currentOpenedModal, closeModal } = useModalStore();

  const closetPlans = [
    {
      id: 1,
      name: t("modals.create-closet.plans.1"),
      price: 5,
    },
    {
      id: 2,
      name: t("modals.create-closet.plans.2"),
      price: 17,
    },
    {
      id: 3,
      name: t("modals.create-closet.plans.3"),
      price: 29,
    },
  ];

  return (
    <Dialog
      open={currentOpenedModal === Modal.CreateCloset}
      onOpenChange={closeModal}
    >
      <DialogContent className="max-w-[350px] sm:max-w-lg px-5 sm:px-[60px] !rounded-[20px] py-[24px] bg-modal-gradient">
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

        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src={ASSETS["zecond-logo-black.png"] || "/placeholder.svg"}
            alt="ZECOND CLOSET SALE"
            width={120}
            height={60}
            className="w-36 sm:w-48"
          />
        </div>

        {/* Title */}
        <div className="text-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">
            {t("modals.create-closet.heading")}
          </h2>
          <p className="text-gray-600">
            {t("modals.create-closet.sub-heading")}
          </p>
        </div>

        {/* Process Steps */}
        <div className="flex justify-between items-center mb-4 px-4">
          <div className="text-center">
            <div className="mb-2 flex justify-center">
              <Image
                src={ASSETS["location.svg"] || "/placeholder.svg"}
                alt="Pickup"
                width={40}
                height={40}
              />
            </div>
            <p className="leading-tight sm:leading-normal text-xs max-w-[80px] font-bold text-black">
              {t("modals.create-closet.steps.we-collect-clothes")}
            </p>
          </div>
          <div className="text-green-500 mt-3 self-start font-bold text-lg">
            <ChevronRight />
          </div>
          <div className="text-center">
            <div className="mb-2 flex justify-center">
              <Image
                src={ASSETS["camera.svg"] || "/placeholder.svg"}
                alt="Photography"
                width={40}
                height={40}
              />
            </div>
            <p className="leading-tight sm:leading-normal text-xs max-w-[80px] font-bold text-black">
              {t("modals.create-closet.steps.we-phtograph-clothes")}
            </p>
          </div>
          <div className="text-green-500 mt-3 self-start font-bold text-lg">
            <ChevronRight />
          </div>
          <div className="text-center">
            <div className="mb-2 flex justify-center">
              <Image
                src={ASSETS["gallery.svg"] || "/placeholder.svg"}
                alt="Upload"
                width={35}
                height={35}
              />
            </div>
            <p className="leading-tight sm:leading-normal text-xs max-w-[80px] font-bold text-black">
              {t("modals.create-closet.steps.we-publish-in-store")}
            </p>
          </div>
        </div>

        {/* Pricing Options */}
        <div className="space-y-3">
          {closetPlans.map((plan) => (
            <PlanCheckBox
              key={plan.id}
              plan={plan}
              currentPlan={selectedPlan}
              setPlan={setSelectedPlan}
            />
          ))}
        </div>

        {/* Action Button */}
        <Button className="w-full uppercase bg-green-600 rounded-2xl h-[55px] hover:bg-green-700 text-white">
          {t("common.create-closet")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function PlanCheckBox(props: {
  plan: any;
  currentPlan: number;
  setPlan: React.Dispatch<React.SetStateAction<number>>;
}) {
  const t = useTranslations();

  return (
    <label
      className={cn(
        "flex items-center justify-between px-4 py-3 border-2  rounded-[15px] cursor-pointer",
        props.plan.id === props.currentPlan
          ? "border-[#009045]"
          : "border-[#B9B9B9]",
      )}
      onClick={() => props.setPlan(props.plan.id)}
    >
      <div className="flex items-center gap-3">
        <Checkbox1
          checked={props.plan.id === props.currentPlan}
          onChange={(checked) => {}}
        />
        <div>
          <div className="text-sm sm:text-base font-semibold">
            {props.plan.name}
          </div>
          <div className="text-xs sm:text-sm text-gray-500">
            {formatCurrency(props.plan.price)} {t("common.monthly")}
          </div>
        </div>
      </div>
    </label>
  );
}
