import { useQuery } from "@tanstack/react-query";
import { useGlobalStore } from "../stores";
import { getOrder, getOrders, getOrderByCheckoutId } from "../apis";

export const GET_ORDERS_QUERY_KEY = "get_orders";

export function useGetOrders() {
  const { user } = useGlobalStore();

  return useQuery({
    queryKey: [GET_ORDERS_QUERY_KEY],
    queryFn: getOrders,
    enabled: !!user,
  });
}

export function useGetOrder(id: number) {
  const { user } = useGlobalStore();

  return useQuery({
    queryKey: ["get_order", id],
    queryFn: () => getOrder(id),
    enabled: !!user,
  });
}

export function useGetOrderByCheckoutId(id: string) {
  const { user } = useGlobalStore();

  return useQuery({
    queryKey: ["get_order_by_checkout_id", id],
    queryFn: () => getOrderByCheckoutId(id),
    enabled: !!user,
  });
}
