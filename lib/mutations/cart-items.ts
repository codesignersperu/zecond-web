import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addToCart, removeFromCart } from "../apis";
import { HttpErrorResponse } from "../types";
import { GET_CART_ITEMS_QUERY_KEY } from "../queries";

export function useAddToCart() {
  const client = useQueryClient();
  return useMutation({
    mutationKey: ["cart_add"],
    mutationFn: (productId: string | number) =>
      toast.promise(addToCart(productId), {
        loading: "Adding to cart...",
        error: (e) =>
          (e as HttpErrorResponse)?.message || "Error adding to cart",
      }),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [GET_CART_ITEMS_QUERY_KEY] });
    },
  });
}

export function useRemoveFromCart() {
  const client = useQueryClient();
  return useMutation({
    mutationKey: ["cart_remove"],
    mutationFn: (productId: string | number) =>
      toast.promise(removeFromCart(productId), {
        loading: "Removing from cart...",
        success: "Product removed from cart",
        error: (e) =>
          (e as HttpErrorResponse)?.message || "Error removing from cart",
      }),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [GET_CART_ITEMS_QUERY_KEY] });
    },
  });
}
