import { API, api, errorHandler } from ".";
import type {
  ProductsInResponse,
  IProduct,
  GetProductsSearchParams,
  UserBoughtProducts,
  Pagination,
  PaginationQuery,
} from "../types";
import { generateQueryParams } from "../utils";

export function getMyOffers(
  params?: PaginationQuery & { type: "active" | "previous" },
) {
  const q = generateQueryParams(params || {});
  return errorHandler<ProductsInResponse>(
    api.get(API.product.myOffers + `?${q}`).json,
  );
}

export function getMyProducts(params?: Partial<Pagination>) {
  const q = generateQueryParams(params || {});
  return errorHandler<ProductsInResponse>(
    api.get(API.product.mine + `?${q}`).json,
  );
}

export function getBoughtProducts() {
  return errorHandler<UserBoughtProducts>(api.get(API.product.bought).json);
}

export function updateProduct(data: any) {
  return errorHandler(api.patch(API.product.update, { json: data }).json);
}

export function getProducts(searchParams?: GetProductsSearchParams) {
  const q = generateQueryParams({
    ...searchParams,
    ids: searchParams?.ids ? searchParams?.ids.join(",") : undefined,
  });
  return errorHandler<ProductsInResponse>(
    api.get(API.product.get + `?${q}`).json,
  );
}

export function getProduct(id: number | string) {
  return errorHandler<IProduct>(api.get(API.product.getOne(id)).json);
}

export function toggleFavorite(productId: number) {
  return errorHandler(api.post(API.product.toggleFavorite(productId)).json);
}

export function getFavorites(params?: Partial<Pagination>) {
  const q = generateQueryParams(params || {});
  return errorHandler<ProductsInResponse>(
    api.get(API.product.favorites + `?${q}`).json,
  );
}

export function getFavoriteIds() {
  return errorHandler<number[]>(api.get(API.product.favoriteIds).json);
}

export function bidOnAuction(productId: number, amount: number) {
  return errorHandler(
    api.post(API.product.bid, { json: { productId, amount } }).json,
  );
}
