import { useTranslations } from "next-intl";
import { InfoIcon } from "lucide-react";

export default function MaintenanceAlertPage() {
  const t = useTranslations();
  return (
    <main className="py-20 bg-[#f3f3f3]">
      <div className="mx-auto max-w-3xl h-[300px] sm:h-[500px] text-center text-blue-500">
        <h1 className="flex gap-3 justify-center items-center text-2xl mb-5">
          <InfoIcon /> {t("common.maintenance-alert")}
        </h1>
        <p>{t("common.maintenance-alert-description")}</p>
      </div>
    </main>
  );
}
