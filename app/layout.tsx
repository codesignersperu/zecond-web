import { Poppins } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
// Swiper CSS
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "ZECOND | vender/subastar",
  description: "Vende y subasta tu ropa usada",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  return (
    <html lang={locale}>
      <body className={`data-[scroll-locked]:!mr-0 ${poppins.variable}`}>
        {children}
      </body>
    </html>
  );
}
