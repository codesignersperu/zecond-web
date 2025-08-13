import { api, API, errorHandler } from ".";
import type { PromoCode, PromoCodeFor } from "../types";

export async function createCheckoutSession(
  ids: number[],
  addressId: number,
  promoCode?: string,
) {
  const res = await errorHandler<{ checkoutSessionClientSecret: string }>(
    api.post(API.stripe.createCheckoutSession(ids, addressId, promoCode)).json,
  );
  return res.data.checkoutSessionClientSecret;
}

export async function createSubscriptionCheckout(planId: string) {
  const res = await errorHandler<{ subscriptionSessionClientSecret: string }>(
    api.post(API.stripe.createSubscriptionCheckout(planId)).json,
  );
  return res.data.subscriptionSessionClientSecret;
}

export async function applyPromoCode(code: string, appliedFor: PromoCodeFor) {
  return errorHandler<PromoCode>(
    api.get(API.stripe.applyPromoCode(code, appliedFor)).json,
  );
}
