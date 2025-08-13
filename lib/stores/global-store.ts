import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, IProduct, ConfigResponse } from "../types";
import { imageUrl } from "@/lib/utils";

type RecentViewedProduct = Pick<
  IProduct,
  "id" | "images" | "title" | "isAuction" | "price" | "bids"
>;

type GlobalStore = {
  config: ConfigResponse | null;
  setConfig: (config: ConfigResponse) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  favoriteProducts: number[];
  setFavorites: (ids: number[]) => void;
  recentSearches: string[];
  setRecentSearch: (query: string) => void;
  browsingHistory: RecentViewedProduct[];
  setBrowsingHistory: (product: RecentViewedProduct) => void;
};

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set) => ({
      config: null,
      setConfig: (config: ConfigResponse) => {
        set({ config });
      },
      user: null,
      setUser: (user: User | null) => {
        if (!user) return set({ user, favoriteProducts: [] });
        user.avatarUrl = imageUrl(user.avatarUrl);
        set({ user });
      },
      favoriteProducts: [],
      setFavorites: (ids: number[]) => {
        set({ favoriteProducts: ids });
      },
      recentSearches: [],
      setRecentSearch: (query) =>
        set((state) => {
          let final: string[] = [];
          if (query.length > 0) {
            if (state.recentSearches.includes(query))
              final = [
                query,
                ...state.recentSearches.filter((v) => v === query),
              ];
            else final = [query, ...state.recentSearches];
          }

          if (final.length > 6) final = final.slice(0, 6);

          return {
            recentSearches: final,
          };
        }),
      browsingHistory: [],
      setBrowsingHistory: (product) =>
        set((state) => {
          let final: RecentViewedProduct[] = [];
          if (state.browsingHistory.find((v) => v.id === product.id))
            final = [
              product,
              ...state.browsingHistory.filter((v) => v.id === product.id),
            ];
          else final = [product, ...state.browsingHistory];

          if (final.length > 3) final = final.slice(0, 3);

          return {
            browsingHistory: final,
          };
        }),
    }),
    { name: "global-store" },
  ),
);
