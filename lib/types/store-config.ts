export type ConfigResponse = {
  auctionCommissionPercentage: number;
  deliveryFee: number;
  minimumWithdrawalAmount: number;
  maximumWithdrawalAmount: number;
  banners: [string, string][];
  mobileBanners: [string, string][];
};

export type BrandsResponse = Array<{ name: string; imageUrl: string }>;

export type CategoriesResponse = Record<
  string,
  { id: number; subcategories: [string, string][] }
>;

export interface SubscriptionPlan {
  id: number;
  planId: string;
  title: string;
  price: number;
  subtitle: string | null;
  features: SubscriptionPlanFeature[];
  auctionsAllowed: boolean;
}

interface SubscriptionPlanFeature {
  heading: string;
  para: string;
}
