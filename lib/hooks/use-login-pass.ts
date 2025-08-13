import { useTranslations } from "next-intl";
import { Modal, useGlobalStore } from "../stores";
import { useModalStore } from "../stores";
import toast from "react-hot-toast";

export function useLoginPass() {
  const t = useTranslations();
  const { openModal } = useModalStore();

  async function loginPass<T extends any>(
    func: () => boolean | Promise<T> | T = () => true,
  ) {
    if (!useGlobalStore.getState().user) {
      toast(t("common.login-first"));
      openModal({ modal: Modal.LoginSignup });
      return false;
    }
    return (await func()) as Promise<T>;
  }

  return loginPass;
}
