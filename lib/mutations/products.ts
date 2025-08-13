import { updateProduct, toggleFavorite, bidOnAuction } from "../apis";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { HttpErrorResponse } from "../types";
import {
  GET_FAVORITE_IDS_QUERY_KEY,
  GET_ME_QUERY_KEY,
  GET_MY_PRODUCTS_QUERY_KEY,
} from "../queries";
import toast from "react-hot-toast";
import { invalidateQueries } from "../utils";

export function useUpdateProduct() {
  const router = useRouter();
  const client = useQueryClient();
  return useMutation({
    mutationKey: ["update_product"],
    mutationFn: (params: Record<string, string | boolean>) =>
      toast.promise(
        async function () {
          const res = await updateProduct(params);
          return res;
        },
        {
          loading: `Updating Product...`,
          success: `Product Updated`,
          error: (e) =>
            (e as HttpErrorResponse).message || `Error Updating Product`,
        },
      ),
    onSuccess: () => {
      invalidateQueries(client, [GET_MY_PRODUCTS_QUERY_KEY, GET_ME_QUERY_KEY]);
      router.push("/user-dashboard/sales/publications");
    },
  });
}

export function useToggleFavoriteProducts() {
  const client = useQueryClient();
  return useMutation({
    mutationKey: ["toggle_favorite_products"],
    mutationFn: (productId: number) => toggleFavorite(productId),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [GET_FAVORITE_IDS_QUERY_KEY] });
    },
  });
}
export function useBidOnAuction() {
  return useMutation({
    mutationKey: ["bid_on_auctions"],
    mutationFn: (args: { productId: number; amount: number }) =>
      toast.promise(bidOnAuction(args.productId, args.amount), {
        loading: "Bidding...",
        error: (e) =>
          (e as HttpErrorResponse)?.message || "Error placing offer",
      }),
  });
}
