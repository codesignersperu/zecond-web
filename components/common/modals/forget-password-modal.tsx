"use client";

import type React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ASSETS } from "@/lib/constants";
import { toast } from "@/components/ui/use-toast";
import { useModalStore, Modal } from "@/lib/stores";

export default function ForgetPasswordModal() {
  const t = useTranslations();
  const { currentOpenedModal, closeModal } = useModalStore();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Error",
        description:
          "Por favor, ingrese su correo electrónico o número de teléfono.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would typically make an API call to send the reset link
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      toast({
        title: "¡Enlace enviado!",
        description:
          "Por favor, revise su correo electrónico para restablecer su contraseña.",
      });
      closeModal();
    } catch (error) {
      toast({
        title: "Error",
        description:
          "No se pudo enviar el enlace. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={currentOpenedModal === Modal.ForgetPassword}
      onOpenChange={closeModal}
    >
      <DialogContent className="max-w-[350px] sm:max-w-md rounded-2xl bg-modal-gradient">
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

        <div className="p-6 space-y-5 sm:space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src={ASSETS["zecond-logo-black.png"] || "/placeholder.svg"}
              alt="ZECOND Logo"
              width={120}
              height={60}
              className="w-36 sm:w-48"
            />
          </div>

          {/* Description */}
          <p className="leading-tight sm:leading-normal text-center text-base font-light ">
            {t("modals.forget-password.para")}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <Input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-6 border-black focus-visible:ring-0 h-12 rounded-full bg-transparent"
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-black hover:bg-black/90 text-white rounded-full"
            >
              {isSubmitting
                ? t("common.sending") + "..."
                : t("common.send-link")}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
