import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFollowing,
  getFollowingIds,
  getMe,
  getConnectedAccounts,
  getInfluencer,
  getSellerStats,
  getInfluencers,
  isSubscriptionUpdated,
  findInfluencers,
  getMyReviews,
} from "../apis";
import { useGlobalStore } from "../stores";
import { GetInfluencersReqParams, HttpErrorResponse } from "../types";
import { invalidateQueries } from "../utils";
import { usePathname, useRouter } from "next/navigation";
import { AUTH_TOKEN_KEY } from "../config";

export const USER_FOLLOWING_QUERY_KEY = "get_user_following";

export function useGetUserFollowing() {
  const { user } = useGlobalStore();

  return useQuery({
    queryKey: [USER_FOLLOWING_QUERY_KEY],
    queryFn: getFollowing,
    enabled: !!user,
  });
}

export const USER_FOLLOWING_IDS_QUERY_KEY = "get_user_following_ids";

export function useGetUserFollowingIds() {
  const { user } = useGlobalStore();

  return useQuery({
    queryKey: [USER_FOLLOWING_IDS_QUERY_KEY],
    queryFn: getFollowingIds,
    enabled: !!user,
  });
}

export function useGetInfluencers(params?: GetInfluencersReqParams) {
  return useQuery({
    queryKey: ["get_influencers", params],
    queryFn: () => getInfluencers(params),
  });
}

export function useFindInfluencers(query: string) {
  return useQuery({
    queryKey: ["find_influencers", query],
    queryFn: () => findInfluencers(query),
    enabled: !!query,
  });
}

export function useGetInfluencer(
  args:
    | { mode: "id"; id: number | string }
    | { mode: "username"; username: string },
) {
  const { user } = useGlobalStore();

  return useQuery({
    queryKey: ["get_influencer_by_id_username", args],
    queryFn: () => getInfluencer(args),
    retry: 0,
  });
}

export const GET_ME_QUERY_KEY = "get_me";

export function useGetMe() {
  const { setUser } = useGlobalStore();
  const router = useRouter();
  let pathname = usePathname();
  pathname = pathname.slice(3);

  let redirect: string | null = null;
  return useQuery({
    queryKey: [GET_ME_QUERY_KEY],
    queryFn: async () => {
      try {
        const response = await getMe();
        setUser(response.data);
        if (pathname === "/maintenance-alert") {
          redirect = "/";
        }
        return response;
      } catch (e) {
        if ((e as HttpErrorResponse).statusCode === 401) {
          setUser(null);
          if (localStorage) localStorage.removeItem(AUTH_TOKEN_KEY);
        }
        if ((e as HttpErrorResponse).statusCode === 503) {
          redirect = "/maintenance-alert";
        } else if (pathname === "/maintenance-alert") {
          redirect = "/";
        }
        return e;
      } finally {
        if (redirect) router.push(redirect);
      }
    },
    retry: 1,
  });
}

export function useIsSubscriptionUpdated(sessionId: string | null) {
  const client = useQueryClient();
  return useQuery({
    queryKey: ["is_subscription_updated"],
    queryFn: async () => {
      const res = await isSubscriptionUpdated(sessionId as string);
      if (res.status === "success") {
        invalidateQueries(client, [GET_ME_QUERY_KEY]);
      }
      return res;
    },
    retry: 10,
    enabled: !!sessionId,
  });
}

export const MY_REVIEWS_QUERY_KEY = "get_my_reviews";

export function useGetMyReviews() {
  const { user } = useGlobalStore();

  return useQuery({
    queryKey: [MY_REVIEWS_QUERY_KEY],
    queryFn: getMyReviews,
    enabled: !!user,
  });
}

export const CONNECTED_ACCOUNTS_QUERY_KEY = "get_connected_accounts";

export function useGetConnectedAccounts() {
  const { user } = useGlobalStore();

  return useQuery({
    queryKey: [CONNECTED_ACCOUNTS_QUERY_KEY],
    queryFn: getConnectedAccounts,
    enabled: !!user,
  });
}

export function useGetSellerStats() {
  const { user } = useGlobalStore();

  return useQuery({
    queryKey: ["get_seller_stats"],
    queryFn: getSellerStats,
    enabled: !!user,
  });
}
