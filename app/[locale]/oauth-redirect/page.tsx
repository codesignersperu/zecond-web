"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OAuthRedirectPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  useEffect(() => {
    if (typeof window !== undefined && token) {
      localStorage.setItem("token", token);
      router.push("/");
    }
  });
  const t = useTranslations();
  return (
    <div className="py-10 flex min-h-[200px] sm:min-h-[400px] lg:min-h-[600px] justify-center items-center">
      <div className="flex flex-col justify-center gap-3 items-center text-neutral-300">
        <KeyRound className="size-16" />
        <p className="text-sm">{t("common.authenticating")}...</p>
      </div>
    </div>
  );
}
