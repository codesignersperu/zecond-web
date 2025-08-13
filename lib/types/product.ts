import type { IBid, ISeller, Pagination } from ".";

export enum ProductStatus {
  DRAFT = "draft",
  PENDING_APPROVAL = "pending_approval",
  LIVE = "live",
  SOLD = "sold",
  ARCHIVED = "archived",
}

export enum ProductCondition {
  New = "new",
  LikeNew = "like_new",
  Excellent = "excellent",
  VeryGood = "very_good",
  Good = "good",
  Fair = "fair",
  Poor = "poor",
  Used = "used",
}

export enum ProductSize {
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL",
  XXXL = "XXXL",
  OneSize = "One Size",
}

export type IProduct = {
  id: number;
  title: string;
  description: string | null;
  category: string;
  subcategory: string;
  price: number;
  size: ProductSize;
  color: string | null;
  colorCode: string | null;
  material: string | null;
  brand: string;
  brandImage: string;
  condition: ProductCondition;
  status: ProductStatus;
  isAuction: boolean;
  startDate: string | null;
  endDate: string | null;
  productHeight: number | null;
  chestMeasurement: number | null;
  waistMeasurement: number | null;
  hipsMeasurement: number | null;
  createdAt: string;
  updatedAt: string;
  totalBids: number;
  myHighestBid: string | null;
  images: { url: string; id: number }[]; // only get image id on get product by id response
  bids: IBid[];
  seller: ISeller;
};

export type ProductsResponse = Pick<
  IProduct,
  | "id"
  | "title"
  | "price"
  | "isAuction"
  | "startDate"
  | "endDate"
  | "size"
  | "color"
  | "brand"
  | "condition"
  | "status"
  | "totalBids"
  | "myHighestBid"
  | "seller"
  | "images"
  | "bids"
>;

export type ProductsInResponse = {
  products: ProductsResponse[];
  pagination: Pagination;
};

export type AuctionStatus = "has-to-start-yet" | "started" | "ended";

export type GetProductsSearchParams = Partial<Pagination> & {
  sort?: "asc" | "desc" | "price-asc" | "price-desc" | null;
  query?: string | null;
  ids?: number[] | null;
  userId?: number | null;
  excludeProduct?: number | null;
  version?: "full" | null;
  category?: string | null;
  subcategory?: string | null;
  size?: string | null;
  color?: string | null;
  brand?: string | null;
  isAuction?: boolean | null;
  isFeatured?: boolean | null;
  isPremium?: boolean | null;
  mode?: "checkout" | "fetch" | null;
};

export type BidsWsResponse = {
  bidderId: number;
  amount: number;
  bidderName: string;
  at: Date;
};

export type AuctionWinnerWsResponse = {
  productId: number;
  bidderId: number;
  amount: number;
  productTitle: string;
  productImage: string;
};

export type UserBoughtProducts = Pick<
  IProduct,
  | "id"
  | "title"
  | "price"
  | "isAuction"
  | "startDate"
  | "endDate"
  | "size"
  | "color"
  | "brand"
  | "condition"
  | "status"
  | "seller"
  | "images"
  | "bids"
>[];
