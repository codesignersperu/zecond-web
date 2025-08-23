import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { ASSETS } from "@/lib/constants";

export default function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="bg-[#111111] text-white py-16">
      <div className="container mx-auto px-4">
        {/* Logo and Description */}
        <div className="px-[8%] sm:px-0 flex flex-col items-center text-center mb-16">
          <Image
            src={ASSETS["zecond-logo-white.png"]}
            alt="ZECOND CLOSET SALE"
            width={420}
            height={235}
            className="mb-8"
          />
          <p className="">{t.rich("description", { slot: () => <br /> })}</p>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* ZECOND Column */}
          <div>
            <h3 className="font-bold mb-4 uppercase">{t("second.second")}</h3>
            <ul className="space-y-2 text-[#A4A4A4]">
              <li>
                <Link href="/" className="hover:text-white">
                  {t("second.who-are-we")}
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white">
                  {t("second.work-with-us")}
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white">
                  {t("second.sustainability")}
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white">
                  {t("second.Advertising")}
                </Link>
              </li>
            </ul>
          </div>

          {/* DESCUBRE Column */}
          <div>
            <h3 className="font-bold uppercase mb-4">
              {t("discover.discover")}
            </h3>
            <ul className="space-y-2 text-[#A4A4A4]">
              <li>
                <Link href="/como-funciona" className="hover:text-white">
                  {t("discover.how-does-it-work")}
                </Link>
              </li>
              <li>
                <Link href="/verificacion" className="hover:text-white">
                  {t("discover.item-verification")}
                </Link>
              </li>
              <li>
                <Link href="/app" className="hover:text-white">
                  {t("discover.download-app")}
                </Link>
              </li>
              <li>
                <Link href="/tablon" className="hover:text-white">
                  {t("discover.informative-board")}
                </Link>
              </li>
            </ul>
          </div>

          {/* AYUDA Y SOPORTE Column */}
          <div>
            <h3 className="font-bold uppercase mb-4">{t("help.help")}</h3>
            <ul className="space-y-2 text-[#A4A4A4]">
              <li>
                <Link href="/centro-asistencia" className="hover:text-white">
                  {t("help.help-center")}
                </Link>
              </li>
              <li>
                <Link href="/vender" className="hover:text-white">
                  {t("help.sell")}
                </Link>
              </li>
              <li>
                <Link href="/comprar" className="hover:text-white">
                  {t("help.buy")}
                </Link>
              </li>
              <li>
                <Link href="/confianza" className="hover:text-white">
                  {t("help.privacy")}
                </Link>
              </li>
            </ul>
          </div>

          {/* LEGAL Column */}
          <div>
            <h3 className="font-bold mb-4 uppercase">{t("legal.legal")}</h3>
            <ul className="space-y-2 text-[#A4A4A4]">
              <li>
                <Link href="/app-store" className="hover:text-white">
                  {t("legal.app-store")}
                </Link>
              </li>
              <li>
                <Link href="/condiciones" className="hover:text-white">
                  {t("legal.terms-of-use")}
                </Link>
              </li>
              <li>
                <Link href="/reglas" className="hover:text-white">
                  {t("legal.publishing-rules")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social and App Store Links  */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-[#333333] pt-8">
          <div className="flex gap-4 mb-4 md:mb-0">
            <Link href="https://instagram.com" className="hover:opacity-80">
              <Image
                src={ASSETS["instagram-white.svg"]}
                alt="Instagram"
                width={24}
                height={24}
              />
            </Link>
            <Link href="https://facebook.com" className="hover:opacity-80">
              <Image
                src={ASSETS["facebook-white.svg"]}
                alt="Facebook"
                width={24}
                height={24}
              />
            </Link>
          </div>
          <div className="flex gap-4">
            <Link href="https://apps.apple.com" className="hover:opacity-80">
              <Image
                src={ASSETS["apple-store.svg"]}
                alt="Consíguelo en el App Store"
                width={125}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <Link href="https://play.google.com" className="hover:opacity-80">
              <Image
                src={ASSETS["google-play.svg"]}
                alt="Disponible en Google Play"
                width={140}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="flex flex-wrap justify-center gap-8 mt-8 text-sm text-[#A4A4A4]">
          <Link href="/privacidad" className="hover:text-white">
            {t("privacy-policy")}
          </Link>
          <Link href="/cookies" className="hover:text-white">
            {t("cookies-policy")}
          </Link>
          <Link href="/reclamaciones" className="hover:text-white">
            {t("complaints-center")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
