import { useQuery } from "@tanstack/react-query";
import { useGlobalStore } from "../stores";
import { getCartItems } from "../apis";

export const GET_CART_ITEMS_QUERY_KEY = "get_cart_items";

export function useGetCartItems() {
  const { user } = useGlobalStore();

  return useQuery({
    queryKey: [GET_CART_ITEMS_QUERY_KEY],
    queryFn: getCartItems,
    enabled: !!user,
  });
}
