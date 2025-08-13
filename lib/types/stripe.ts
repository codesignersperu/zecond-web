export type DiscountType = "percent" | "amount";

export type PromoCodeFor = "products" | "subscriptions";

type PromoCodeAppliesTo = "products" | "subscriptions" | "all";

export type PromoCode = {
  code: string;
  description: string | null;
  active: boolean;
  usable: boolean;
  invalidReason: string | null;
  discount: {
    type: DiscountType;
    value: number;
  };
  appliesTo: PromoCodeAppliesTo;
  firstTimeTransaction: boolean;
  minimumAmount: number | null;
};
