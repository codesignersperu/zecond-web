import { ProductsResponse } from "./product";
import { Address } from "./addresses";
import { Review, User } from "./user";

export type OrderItem = {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product: ProductsResponse & { reviews: Review[] };
};

export type OrderInResonse = {
  id: number;
  buyerId: number;
  subTotal: number;
  total: number;
  shippingAddressId: number;
  status:
    | "pending"
    | "processing_payment"
    | "placed"
    | "processing"
    | "shipped"
    | "canceled"
    | "on_hold"
    | "completed";
  paymentStatus: "processing" | "paid" | "failed" | "refunded" | "unpaid";
  stripeCheckoutSessionId: string;
  shippingCarrier: string | null;
  shippingServiceLevel: string | null;
  deliveredAt: string | null;
  shippingCost: number | null;
  shipmentTrackingUrl: string | null;

  discountType: "percent" | "amount";
  discountAmount: number | null;
  discountCode: string | null;

  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  buyer: Pick<User, "firstName" | "lastName">;
  shippingAddress: Address;
};
