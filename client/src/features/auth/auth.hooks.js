import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  registerUser,
  loginUser,
  logoutUser,
  logoutAllDevice,
  verifyEmail,
  resendVerification,
  getCurrentUser,
} from "./auth.api.js";

/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,

    onSuccess: (data) => {
      console.log("LOGIN RESPONSE:", data);

      if (data?.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }

      /*
      |--------------------------------------------------------------------------
      | Backend returns:
      |
      | {
      |   message,
      |   accessToken,
      |   user
      | }
      |
      | refreshToken is HttpOnly cookie.
      |--------------------------------------------------------------------------
      */

      queryClient.setQueryData(["auth", "me"], data);
    },
  });
};

/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,

    onSuccess: () => {
      localStorage.removeItem("accessToken");

      queryClient.removeQueries({
        queryKey: ["auth", "me"],
      });
    },

    onError: () => {
      /*
      |--------------------------------------------------------------------------
      | Even if server logout fails,
      | clear frontend authentication state.
      |--------------------------------------------------------------------------
      */

      localStorage.removeItem("accessToken");

      queryClient.removeQueries({
        queryKey: ["auth", "me"],
      });
    },
  });
};

/*
|--------------------------------------------------------------------------
| LOGOUT ALL DEVICES
|--------------------------------------------------------------------------
*/

export const useLogoutAll = () => {
  return useMutation({
    mutationFn: logoutAllDevice,
  });
};

/*
|--------------------------------------------------------------------------
| VERIFY EMAIL
|--------------------------------------------------------------------------
*/

export const useVerifyEmail = (token) => {
  return useQuery({
    queryKey: ["auth", "verify-email", token],

    queryFn: () => verifyEmail(token),

    enabled: Boolean(token),

    retry: false,
  });
};

/*
|--------------------------------------------------------------------------
| RESEND VERIFICATION
|--------------------------------------------------------------------------
*/

export const useResendVerification = () => {
  return useMutation({
    mutationFn: resendVerification,
  });
};

/*
|--------------------------------------------------------------------------
| CURRENT USER
|--------------------------------------------------------------------------
*/

export const useCurrentUser = () => {
  const hasAccessToken = Boolean(localStorage.getItem("accessToken"));

  return useQuery({
    queryKey: ["auth", "me"],

    queryFn: getCurrentUser,

    enabled: hasAccessToken,

    retry: false,

    staleTime: 5 * 60 * 1000,

    refetchOnWindowFocus: false,
  });
};
