import { API, api, errorHandler } from ".";
import type { CartItemInResponse } from "../types";

export function addToCart(productId: string | number) {
  return errorHandler(api.post(API.cart.add(productId)).json);
}

export function getCartItems() {
  return errorHandler<CartItemInResponse[]>(api.get(API.cart.getAll).json);
}

export function removeFromCart(productId: string | number) {
  return errorHandler(api.delete(API.cart.delete(productId)).json);
}
