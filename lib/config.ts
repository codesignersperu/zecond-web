import { loadStripe } from "@stripe/stripe-js";

export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE as string,
  {
    developerTools: {
      assistant: {
        enabled: false,
      },
    },
  },
);

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const API_BASE_URL = API_URL + "/v1";
export const AUTH_TOKEN_KEY = "token";
