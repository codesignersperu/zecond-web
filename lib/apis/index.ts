import ky, { type KyInstance } from "ky";
import {
  GetAddressParms,
  HttpErrorResponse,
  HttpResponse,
  PromoCodeFor,
} from "../types";
import { HTTPError } from "ky";
import { io } from "socket.io-client";
import { API_URL, API_BASE_URL, AUTH_TOKEN_KEY } from "@/lib/config";

export const auctionsSocket = io(API_URL + "/products", {
  autoConnect: false,
  transports: ["websocket", "polling"],
});

export const API = {
  auth: {
    signup: "users/signup",
    login: "users/login",
    googleLogin: "users/google/login",
    getMe: "users/me",
    isSubscriptionUpdated: (sessionId: string) =>
      `users/subscription-updated-check?session-id=${sessionId}`,
    logout: "users/logout",
    update: "users/update",
    updatePassword: "users/update-password",
    connectedAccounts: "users/connected-accounts",
    disconnectAccount: (provider: string) =>
      "users/connected-accounts/" + provider,
    toggleFollow: (influencerId: number | string) =>
      "users/influencers/follow/" + influencerId,
    following: "users/influencers/following",
    followingIds: "users/influencers/following-ids",
    influencers: "users/influencers/",
    findInfluencers: (query: string) =>
      `users/influencers/find/${encodeURIComponent(query)}`,
    influencerById: (id: number | string) => "users/influencers/id/" + id,
    influencerByUsername: (username: string) =>
      "users/influencers/username/" + username,
    myReviews: "users/reviews",
    updateReview: (id: number | string) => `users/reviews/${id}`,
    sellerStats: "users/seller-stats",
  },
  product: {
    mine: "products/mine",
    myOffers: "products/my-offers",
    bought: "products/bought",
    update: "products",
    get: "products",
    getOne: (id: number | string) => `products/${id}`,
    favorites: "products/favorites",
    favoriteIds: "products/favorite-ids",
    toggleFavorite: (id: number | string) => `products/favorites/${id}`,
    bid: "products/bid",
  },
  config: {
    get: "store-config",
    brands: {
      getAll: "store-config/brands",
    },
    categories: {
      getAll: "store-config/categories-subcategories",
    },
    subscriptionPlans: {
      getAll: "store-config/subscription-plans",
    },
    colors: "store-config/colors",
    address: {
      postalCode: (code: number | string) =>
        "store-config/address/post-code/" + code,
      states: "store-config/address/states",
      municipalities: (state: string | null) =>
        "store-config/address/municipalities?state=" + state,
      cities: (state: string | null, municipality: string | null) =>
        `store-config/address/cities?state=${state}&municipality=${municipality}`,
      neighborhoods: (
        state: string | null,
        municipality: string | null,
        city: string | null,
      ) =>
        `store-config/address/neighborhoods?state=${state}&municipality=${municipality}&city=${city}`,
    },
  },
  cart: {
    add: (productId: string | number) => `cart-items/${productId}`,
    getAll: "cart-items",
    delete: (productId: string | number) => `cart-items/${productId}`,
  },
  addresses: {
    get: (params: GetAddressParms) =>
      `addresses?id=${params.id}&primary=${params.primary}`,
    add: "addresses",
    update: "addresses",
    delete: (id: number | string) => "addresses/" + id,
  },
  stripe: {
    createCheckoutSession: (
      productIds: number[],
      addressId: number,
      promoCode?: string,
    ) =>
      `stripe/create-checkout-session?product-ids=${productIds.join(",")}&address-id=${addressId}&promo=${promoCode}`,
    createSubscriptionCheckout: (planId: string) =>
      `stripe/create-subscription-checkout?plan-id=${planId}`,
    applyPromoCode: (code: string, appliedFor: PromoCodeFor) =>
      `stripe/promo-code/${code}?for=${appliedFor}`,
  },
  revenue: {
    balance: "revenue/balance",
    transactions: "revenue/transactions",
    withdrawalAccounts: "revenue/withdrawal/accounts",
    withdrawalRequest: "revenue/withdrawal/request",
  },
  orders: {
    get: "orders",
    getOne: (id: number) => "orders/" + id,
    getByCheckoutId: (id: string) => "orders/by-checkout-id/" + id,
  },
};

export let api: KyInstance = ky.create({
  prefixUrl: API_BASE_URL,
  retry: 0,
  hooks: {
    beforeRequest: [
      (options) => {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
          options.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
  },
});

export async function errorHandler<T extends {}>(func: any) {
  try {
    return (await func()) as HttpResponse<T>;
  } catch (e) {
    let error = e as HTTPError<HttpErrorResponse>;
    error = await error.response.json();
    throw error as unknown as HttpErrorResponse;
  }
}

// Users
export * from "./users";

// products
export * from "./products";

// Store Config
export * from "./store-config";

// Cart Items
export * from "./cart-items";

// Addresses
export * from "./addresses";

// Stripe
export * from "./stripe";

// Orders
export * from "./orders";

// Transactions
export * from "./revenue";
