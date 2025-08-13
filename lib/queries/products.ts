import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getMyProducts,
  getProducts,
  getProduct,
  getFavorites,
  getFavoriteIds,
  getBoughtProducts,
  getMyOffers,
} from "../apis";
import { useGlobalStore } from "../stores";
import type {
  GetProductsSearchParams,
  Pagination,
  PaginationQuery,
} from "../types";

export const GET_MY_PRODUCTS_QUERY_KEY = "get_my_products";

export function useGetMyProducts(params?: Partial<Pagination>) {
  const { user } = useGlobalStore();

  return useQuery({
    queryKey: [GET_MY_PRODUCTS_QUERY_KEY, params],
    queryFn: () => getMyProducts(params),
    enabled: !!user,
  });
}

export const GET_MY_OFFERS_QUERY_KEY = "get_my_offers";

export function useGetMyOffers(
  params: PaginationQuery & { type: "active" | "previous" },
) {
  const { user } = useGlobalStore();

  return useQuery({
    queryKey: [GET_MY_OFFERS_QUERY_KEY, params],
    queryFn: () => getMyOffers(params),
    enabled: !!user,
  });
}

export const GET_MY_BOUGHT_PRODUCTS_QUERY_KEY = "get_my_bought_products";

export function useGetMyBoughtProducts() {
  const { user } = useGlobalStore();

  return useQuery({
    queryKey: [GET_MY_BOUGHT_PRODUCTS_QUERY_KEY],
    queryFn: getBoughtProducts,
    enabled: !!user,
  });
}

export function useGetFavorites(params?: Partial<Pagination>) {
  const { user } = useGlobalStore();

  return useQuery({
    queryKey: ["get_my_favorites"],
    queryFn: () => getFavorites(params),
    enabled: !!user,
  });
}

export const GET_FAVORITE_IDS_QUERY_KEY = "get_my_favorite_ids";

export function useGetFavoriteIds() {
  const { user, setFavorites } = useGlobalStore();

  return useQuery({
    queryKey: [GET_FAVORITE_IDS_QUERY_KEY],
    queryFn: async () => {
      const res = await getFavoriteIds();
      setFavorites(res.data);
      return res;
    },
    enabled: !!user,
  });
}

export function useGetProducts(
  params?: GetProductsSearchParams & { enabled?: boolean; queryKey?: string },
) {
  const enabled =
    params && typeof params.enabled === "boolean" ? params.enabled : true;
  return useQuery({
    queryKey: ["get_products", params],
    queryFn: () => getProducts(params),
    enabled,
  });
}

export function useGetInfiniteProducts(
  params?: GetProductsSearchParams & { enabled?: boolean; queryKey?: string },
) {
  const enabled =
    params && typeof params.enabled === "boolean" ? params.enabled : true;
  return useInfiniteQuery({
    queryKey: ["get_infinite_products", params],
    queryFn: ({ pageParam }) => getProducts({ ...params, page: pageParam }),
    initialPageParam: params?.page || 1,
    getNextPageParam: (lastPage, pages) => {
      const { page, nextPage } = lastPage.data.pagination;
      return nextPage ? page + 1 : undefined;
    },
    enabled,
  });
}

export function useGetProduct(id: number | string) {
  return useQuery({
    queryKey: [`get_product_${id}`],
    queryFn: () => getProduct(id),
    enabled: !!id,
  });
}
