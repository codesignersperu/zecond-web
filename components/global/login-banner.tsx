"use client";

import { Modal, useModalStore, useGlobalStore } from "@/lib/stores";
import { useTranslations } from "next-intl";

export default function LoginBanner() {
  const t = useTranslations();
  const user = useGlobalStore((state) => state.user);
  const { openModal } = useModalStore();

  if (!user) {
    return (
      <div className="py-5 bg-black/80 fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-3xl text-sm sm:text-base font-semibold tracking-wide mx-auto px-4 flex justify-center items-start sm:items-center gap-1 sm:gap-4 ">
          <p className="text-white">{t("common.signin-for-best-experience")}</p>
          <button
            className="bg-white text-black rounded-full text-nowrap px-3 py-2"
            onClick={() => openModal({ modal: Modal.LoginSignup })}
          >
            {t("modals.signup.login")}
          </button>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}
