import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addAddress,
  deleteAddress,
  updateAddress,
  updatePassword,
} from "../apis";
import { GET_ADDRESSES_QUERY_KEY } from "../queries";
import toast from "react-hot-toast";
import type { Address, HttpErrorResponse } from "../types";
import { number } from "zod";
import { invalidateQueries } from "../utils";

export function useAddAddress() {
  const client = useQueryClient();

  return useMutation({
    mutationKey: ["add_address"],
    mutationFn: (data: any) =>
      toast.promise(addAddress(data), {
        loading: "Adding Address",
        success: "Address Added",
        error: (e) => (e as HttpErrorResponse)?.message || "Error Occured",
      }),
    onSuccess: () => {
      invalidateQueries(client, [GET_ADDRESSES_QUERY_KEY]);
    },
    onError: () => {
      invalidateQueries(client, [GET_ADDRESSES_QUERY_KEY]);
    },
  });
}

export function useUpdateAddress() {
  const client = useQueryClient();

  return useMutation({
    mutationKey: ["update_address"],
    mutationFn: (data: Partial<Address>) =>
      toast.promise(updateAddress(data), {
        loading: "Updating...",
        success: "Address Updated",
        error: (e) => (e as HttpErrorResponse)?.message || "Error Occured",
      }),
    onSuccess: () => {
      invalidateQueries(client, [GET_ADDRESSES_QUERY_KEY]);
    },
    onError: () => {
      invalidateQueries(client, [GET_ADDRESSES_QUERY_KEY]);
    },
  });
}

export function useDeleteAddress() {
  const client = useQueryClient();

  return useMutation({
    mutationKey: ["delete_address"],
    mutationFn: (id: number | string) =>
      toast.promise(deleteAddress(id), {
        loading: "Deleting...",
        success: "Address Deleted",
        error: (e) => (e as HttpErrorResponse)?.message || "Error Occured",
      }),
    onSuccess: () => {
      invalidateQueries(client, [GET_ADDRESSES_QUERY_KEY]);
    },
    onError: () => {
      invalidateQueries(client, [GET_ADDRESSES_QUERY_KEY]);
    },
  });
}
