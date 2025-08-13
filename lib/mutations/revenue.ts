import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addWithdrawalAccount,
  createWithdrawalRequest,
  deleteWithdrawalAccount,
} from "../apis";
import toast from "react-hot-toast";
import { invalidateQueries } from "../utils";
import {
  GET_WITHDRAWAL_ACCOUNTS_QUERY_KEY,
  GET_BALANCE_QUERY_KEY,
} from "../queries/revenue";

export function useCreateWithdrawalRequest() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: { amount: number; accountId: number }) =>
      toast.promise(() => createWithdrawalRequest(data), {
        loading: "Sending request...",
        success: "Withdrawal request sent successfully!",
        error: "Failed to send withdrawal request.",
      }),
    onSuccess: () =>
      invalidateQueries(client, [
        GET_WITHDRAWAL_ACCOUNTS_QUERY_KEY,
        GET_BALANCE_QUERY_KEY,
      ]),
  });
}
export function useAddWithdrawalAccount() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      toast.promise(() => addWithdrawalAccount(data), {
        loading: "Adding withdrawal account...",
        success: "Withdrawal account added successfully!",
        error: "Failed to add withdrawal account.",
      }),
    onSuccess: () =>
      invalidateQueries(client, [GET_WITHDRAWAL_ACCOUNTS_QUERY_KEY]),
  });
}

export function useDeleteWithdrawalAccount() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      toast.promise(() => deleteWithdrawalAccount(id), {
        loading: "Deleting withdrawal account...",
        success: "Withdrawal account deleted successfully!",
        error: "Failed to delete withdrawal account.",
      }),
    onSuccess: () =>
      invalidateQueries(client, [GET_WITHDRAWAL_ACCOUNTS_QUERY_KEY]),
  });
}
