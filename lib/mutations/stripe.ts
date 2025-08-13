import { useMutation } from "@tanstack/react-query";
import {
  createCheckoutSession,
  createSubscriptionCheckout,
  applyPromoCode,
} from "../apis";
import type { PromoCodeFor } from "../types";

export function useCheckoutProducts() {
  return useMutation({
    mutationKey: ["checkout_products"],
    mutationFn: async (params: {
      itemsToCheckout: number[];
      selectedAddress: number;
      promoCode?: string;
    }) => {
      const res = await createCheckoutSession(
        params.itemsToCheckout,
        params.selectedAddress,
        params.promoCode,
      );
      return res;
    },
  });
}

export function useSubscriptionCheckout() {
  return useMutation({
    mutationKey: ["subscription_checkout"],
    mutationFn: async (planId: string) => {
      const res = await createSubscriptionCheckout(planId);
      return res;
    },
  });
}

export function useApplyPromoCode() {
  return useMutation({
    mutationKey: ["apply_promo_code"],
    mutationFn: (args: { promoCode: string; for: PromoCodeFor }) =>
      applyPromoCode(args.promoCode, args.for),
  });
}
