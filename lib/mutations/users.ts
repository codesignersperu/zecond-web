import {
  updateUser,
  updatePassword,
  signup,
  logout,
  login,
  toggleFollow,
  disconnectAccount,
  updateReview,
} from "../apis";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  HttpErrorResponse,
  UpdateUserRequest,
  UpdatePasswordRequest,
  SignupRequest,
  LoginRequest,
} from "../types";
import {
  GET_ME_QUERY_KEY,
  GET_FAVORITE_IDS_QUERY_KEY,
  USER_FOLLOWING_IDS_QUERY_KEY,
  CONNECTED_ACCOUNTS_QUERY_KEY,
  MY_REVIEWS_QUERY_KEY,
} from "../queries";
import toast from "react-hot-toast";
import { useGlobalStore } from "../stores";
import { invalidateQueries } from "../utils";
import { AUTH_TOKEN_KEY } from "../config";

export function useSignup() {
  const client = useQueryClient();
  return useMutation({
    mutationKey: ["user_signup"],
    mutationFn: (params: SignupRequest) =>
      toast.promise(signup(params), {
        loading: "Signing up...",
        success: "Signed Up",
        error: (e) => (e as HttpErrorResponse)?.message || "Error signing up",
      }),
    onSuccess: (response) => {
      localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
      invalidateQueries(client, [GET_ME_QUERY_KEY, GET_FAVORITE_IDS_QUERY_KEY]);
    },
  });
}

export function useLogin() {
  const client = useQueryClient();

  return useMutation({
    mutationKey: ["user_login"],
    mutationFn: (params: LoginRequest) =>
      toast.promise(login(params), {
        loading: "Logging in...",
        success: "Logged In",
        error: (e) => (e as HttpErrorResponse)?.message || "Error logging in",
      }),
    onSuccess: (response) => {
      localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
      invalidateQueries(client, [GET_ME_QUERY_KEY, GET_FAVORITE_IDS_QUERY_KEY]);
    },
  });
}

export function useToggleFollow() {
  const client = useQueryClient();

  return useMutation({
    mutationKey: ["user_login"],
    mutationFn: (id: string | number) => toggleFollow(id),
    onSuccess: () => {
      invalidateQueries(client, [USER_FOLLOWING_IDS_QUERY_KEY]);
    },
  });
}

export function useUpdateUser() {
  const client = useQueryClient();

  return useMutation({
    mutationKey: ["user_update"],
    mutationFn: (params: UpdateUserRequest) =>
      toast.promise(
        async function () {
          const formData = new FormData();
          Object.entries(params).forEach(([key, value]) => {
            formData.append(key, value);
          });
          const res = await updateUser(formData);
          return res;
        },
        {
          loading: "Updating Profile...",
          success: "Profile Updated",
          error: (e) =>
            (e as HttpErrorResponse)?.message || "Error Updating Profile",
        },
      ),
    onSuccess: () => {
      invalidateQueries(client, [GET_ME_QUERY_KEY, GET_FAVORITE_IDS_QUERY_KEY]);
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationKey: ["user_update"],
    mutationFn: (params: UpdatePasswordRequest) =>
      toast.promise(updatePassword(params), {
        loading: "Updating Password...",
        success: "Password Updated",
        error: (e) =>
          (e as HttpErrorResponse)?.message || "Error Updating Password",
      }),
  });
}

export function useDisconnectAccount() {
  const client = useQueryClient();

  return useMutation({
    mutationKey: ["disconnect_account"],
    mutationFn: (provider: string) =>
      toast.promise(disconnectAccount(provider), {
        loading: "Disconnecting Account...",
        success: "Account Disconnected",
        error: (e) => (e as HttpErrorResponse)?.message || "Error Occured",
      }),
    onSuccess: () => {
      invalidateQueries(client, [CONNECTED_ACCOUNTS_QUERY_KEY]);
    },
  });
}

export function useUpdateReview() {
  const client = useQueryClient();

  return useMutation({
    mutationKey: ["update_review"],
    mutationFn: ({ id, rating }: { id: number; rating: number }) =>
      toast.promise(updateReview(id, rating), {
        loading: "Reviewing...",
        success: "Rated successfully",
        error: (e) => (e as HttpErrorResponse)?.message || "Error Occured",
      }),
    onSuccess: () => {
      invalidateQueries(client, [MY_REVIEWS_QUERY_KEY]);
    },
  });
}

export function useLogout() {
  const { setUser } = useGlobalStore();
  return useMutation({
    mutationKey: ["user_logout"],
    mutationFn: () =>
      toast.promise(logout(), {
        loading: "Logging out...",
        success: "Logged out",
        error: (e) => (e as HttpErrorResponse)?.message || "Error logging out",
      }),
    onSuccess: () => {
      setUser(null);
      localStorage.removeItem(AUTH_TOKEN_KEY);
    },
  });
}
