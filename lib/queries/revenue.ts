import { useQuery } from "@tanstack/react-query";
import {
  getMyBalance,
  getOrderTransactions,
  getWithdrawalAccounts,
  getWithdrawalTransactions,
} from "../apis";
import { useGlobalStore } from "../stores";

export const GET_BALANCE_QUERY_KEY = "get_my_balance";

export function useGetMyBalance() {
  const { user } = useGlobalStore();

  return useQuery({
    queryKey: [GET_BALANCE_QUERY_KEY],
    queryFn: getMyBalance,
    enabled: !!user,
  });
}

export const GET_SALES_QUERY_KEY = "get_my_sales";

export function useGetMySales(props?: { page?: number }) {
  const { user } = useGlobalStore();

  return useQuery({
    queryKey: [GET_SALES_QUERY_KEY, props],
    queryFn: () => getOrderTransactions(props),
    enabled: !!user,
  });
}

export const GET_WITHDRAWAL_REQUESTS_QUERY_KEY = "get_my_withdrawal_requests";

export function useGetMyWithdrawalRequests(props?: { page?: number }) {
  const { user } = useGlobalStore();

  return useQuery({
    queryKey: [GET_WITHDRAWAL_REQUESTS_QUERY_KEY, props],
    queryFn: () => getWithdrawalTransactions(props),
    enabled: !!user,
  });
}

export const GET_WITHDRAWAL_ACCOUNTS_QUERY_KEY = "get_my_withdrawal_accounts";

export function useGetMyWithdrawalAccounts(props?: { page?: number }) {
  const { user } = useGlobalStore();

  return useQuery({
    queryKey: [GET_WITHDRAWAL_ACCOUNTS_QUERY_KEY, props],
    queryFn: getWithdrawalAccounts,
    enabled: !!user,
  });
}
