import { API, api, errorHandler } from ".";
import { OrderInResonse } from "../types";

export function getOrders() {
  return errorHandler<OrderInResonse[]>(api.get(API.orders.get).json);
}

export function getOrder(id: number) {
  return errorHandler<OrderInResonse>(api.get(API.orders.getOne(id)).json);
}

export function getOrderByCheckoutId(id: string) {
  return errorHandler<OrderInResonse>(
    api.get(API.orders.getByCheckoutId(id)).json,
  );
}
