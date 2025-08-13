import { useQuery } from "@tanstack/react-query";
import { useGlobalStore } from "../stores";
import { getAddresses } from "../apis";
import type { GetAddressParms } from "../types";

export const GET_ADDRESSES_QUERY_KEY = "get_addresses";

export function useGetAddresses(params: GetAddressParms) {
  const { user } = useGlobalStore();

  return useQuery({
    queryKey: [GET_ADDRESSES_QUERY_KEY, params],
    queryFn: () => getAddresses(params),
    enabled: !!user,
  });
}
