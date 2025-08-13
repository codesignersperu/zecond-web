import { routing } from "@/i18n/routing";
import messages from "@/i18n/messages/en.json";
import "@tanstack/react-query";
import { HttpErrorResponse } from "./lib/types";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: HttpErrorResponse;
  }
}

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
