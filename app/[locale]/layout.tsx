import { hasLocale, NextIntlClientProvider } from "next-intl";

import Footer from "@/components/global/footer";
import Navbar from "@/components/global/navbar";
import GlobalModalsProvider from "@/components/global/modals-provider";
import { QueryProvider } from "@/components/global/query-provider";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Toaster } from "react-hot-toast";

import "react-loading-skeleton/dist/skeleton.css";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import LoginBanner from "@/components/global/login-banner";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <NextIntlClientProvider timeZone="UTC">
      <QueryProvider>
        <Navbar />
        {children}
        <Footer />
        <LoginBanner />
        <GlobalModalsProvider />
        <Toaster />
        <SonnerToaster />
      </QueryProvider>
    </NextIntlClientProvider>
  );
}
