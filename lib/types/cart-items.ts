import { IProduct } from "./product";

export type CartItemInResponse = {
  id: number;
  expirey: Date | null;
  product: Pick<
    IProduct,
    | "id"
    | "title"
    | "price"
    | "size"
    | "color"
    | "brand"
    | "isAuction"
    | "images"
    | "bids"
  >;
};
