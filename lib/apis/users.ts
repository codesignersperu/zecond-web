import { API, api, errorHandler } from ".";
import type {
  InfluencerCard,
  UserFollowingResponse,
  UpdatePasswordRequest,
  SignupRequest,
  AuthResponse,
  User,
  LoginRequest,
  ConnectedAccountsResponse,
  SellerStats,
  Pagination,
  GetInfluencersReqParams,
  FindInfluencersResponse,
  ReviewsResponse,
} from "../types";

export function toggleFollow(id: string | number) {
  return errorHandler(api.post(API.auth.toggleFollow(id)).json);
}

export function getFollowing() {
  return errorHandler<UserFollowingResponse>(api.get(API.auth.following).json);
}

export function getFollowingIds() {
  return errorHandler<number[]>(api.get(API.auth.followingIds).json);
}

export function getInfluencer(
  args:
    | { mode: "id"; id: number | string }
    | { mode: "username"; username: string },
) {
  return errorHandler<InfluencerCard>(
    api.get(
      args.mode === "id"
        ? API.auth.influencerById(args.id)
        : API.auth.influencerByUsername(args.username),
    ).json,
  );
}

export function updateUser(data: FormData) {
  return errorHandler(api.patch(API.auth.update, { body: data }).json);
}

export function updatePassword(data: UpdatePasswordRequest) {
  return errorHandler(api.patch(API.auth.updatePassword, { json: data }).json);
}

export function signup(data: SignupRequest) {
  return errorHandler<AuthResponse>(
    api.post(API.auth.signup, { json: data }).json,
  );
}

export function getMe() {
  return errorHandler<User>(api.get(API.auth.getMe).json);
}

export function isSubscriptionUpdated(sessionId: string) {
  return errorHandler<User>(
    api.get(API.auth.isSubscriptionUpdated(sessionId)).json,
  );
}

export function getInfluencers(params?: GetInfluencersReqParams) {
  return errorHandler<{
    influencers: InfluencerCard[];
    pagination: Pagination;
  }>(api.get(API.auth.influencers, { searchParams: params }).json);
}

export function findInfluencers(query: string) {
  return errorHandler<FindInfluencersResponse>(
    api.get(API.auth.findInfluencers(query)).json,
  );
}

export function logout() {
  return errorHandler(api.post(API.auth.logout, {}).json);
}

export function login(data: LoginRequest) {
  return errorHandler<AuthResponse>(
    api.post(API.auth.login, { json: data }).json,
  );
}

export function getMyReviews() {
  return errorHandler<ReviewsResponse>(api.get(API.auth.myReviews).json);
}

export function updateReview(id: number, rating: number) {
  return errorHandler(
    api.patch(API.auth.updateReview(id), { json: { rating } }).json,
  );
}

export function getConnectedAccounts() {
  return errorHandler<ConnectedAccountsResponse>(
    api.get(API.auth.connectedAccounts).json,
  );
}

export function disconnectAccount(provider: string) {
  return errorHandler(api.delete(API.auth.disconnectAccount(provider)).json);
}

export function getSellerStats() {
  return errorHandler<SellerStats>(api.get(API.auth.sellerStats).json);
}
