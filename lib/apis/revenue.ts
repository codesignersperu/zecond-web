import { API, api, errorHandler } from ".";
import type {
  Balance,
  OrderTransaction,
  Pagination,
  WithdrawalAccount,
  WithdrawalTransaction,
} from "../types";

export function getMyBalance() {
  return errorHandler<Balance>(api.get(API.revenue.balance).json);
}

export function getOrderTransactions(props?: { page?: number }) {
  const params = new URLSearchParams({ type: "order" });

  if (props?.page) params.append("page", props.page.toString());

  return errorHandler<{
    transactions: OrderTransaction[];
    pagination: Pagination;
  }>(api.get(API.revenue.transactions + `?${params.toString()}`).json);
}

export function getWithdrawalTransactions(props?: { page?: number }) {
  const params = new URLSearchParams({ type: "withdrawal" });

  if (props?.page) params.append("page", props.page.toString());

  return errorHandler<{
    transactions: WithdrawalTransaction[];
    pagination: Pagination;
  }>(api.get(API.revenue.transactions + `?${params.toString()}`).json);
}

export function createWithdrawalRequest(data: any) {
  return errorHandler(
    api.post(API.revenue.withdrawalRequest, { json: data }).json,
  );
}

export function addWithdrawalAccount(
  data: Pick<WithdrawalAccount, "bank" | "accountNumber" | "cciNumber">,
) {
  return errorHandler(
    api.post(API.revenue.withdrawalAccounts, { json: data }).json,
  );
}

export function getWithdrawalAccounts() {
  return errorHandler<WithdrawalAccount[]>(
    api.get(API.revenue.withdrawalAccounts).json,
  );
}

export function deleteWithdrawalAccount(id: number) {
  return errorHandler(
    api.delete(API.revenue.withdrawalAccounts + `/${id}`).json,
  );
}
