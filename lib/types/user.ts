import type { HttpResponse } from "./http";
import { IProduct, Pagination } from ".";
import { SubscriptionPlan } from "./store-config";

export type LoginRequest = {
  email: string;
  password: string;
};

export type SignupRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export enum UserStatusEnum {
  ACTIVE = "active",
  PENDING_APPROVAL = "pending_approval",
  DISABLED = "disabled",
  DELETED = "deleted",
}

export type UserSubscription = {
  planId: string;
  listingsRemaining: number;
  auctionsAllowed: boolean;
  plan: Pick<SubscriptionPlan, "id" | "title">;
};

export type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  avatarUrl: string;
  isInfluencer: boolean;
  status: UserStatusEnum;
  noOfReviews: number;
  rating: number;
  subscriptions: UserSubscription[];
};

export type UpdateUserRequest = Partial<{
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  phoneNumber: string;
  avatarUrl: File;
  deleteAvatar: "true";
}>;

export type UpdatePasswordRequest = {
  password: string;
  newPassword: string;
};

export type AuthResponse = { token: string };

export type ConnectedAccountsResponse = Array<{
  provider: "google" | "facebook" | "apple";
}>;

export type InfluencerCard = Pick<
  User,
  | "id"
  | "firstName"
  | "lastName"
  | "username"
  | "avatarUrl"
  | "rating"
  | "noOfReviews"
> & {
  liveProducts: number;
};

export type UserFollowingResponse = {
  influencers: Array<InfluencerCard>;
  pagination: Pagination;
};

export type FindInfluencersResponse = Array<
  Pick<User, "username" | "firstName" | "lastName" | "avatarUrl">
>;

export type SellerStats = {
  rating: number;
  noOfReviews: number;
  followers: number;
  following: number;
  products: {
    active: number;
    sold: number;
    draft: number;
  };
  ordersPending: number;
};

export type GetInfluencersReqParams = {
  page?: number;
  limit?: number;
  liveProducts?: boolean;
};

export type Review = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  status: "pending" | "reviewed";
};

export type ReviewInResponse = Review & {
  product: Pick<
    IProduct,
    "id" | "title" | "images" | "price" | "isAuction" | "bids"
  >;
  order: { id: number; createdAt: string };
};

export type ReviewsResponse = Array<ReviewInResponse>;
