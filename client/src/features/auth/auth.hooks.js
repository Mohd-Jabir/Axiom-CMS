import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  registerUser,
  loginUser,
  logoutUser,
  logoutAllDevice,
  getCurrentUser,
} from "./auth.api.js";


export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,

    onSuccess: (data) => {
      console.log("LOGIN RESPONSE:", data);

      if (data?.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }
      queryClient.setQueryData(["auth", "me"], data);
    },
  });
};


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

      localStorage.removeItem("accessToken");

      queryClient.removeQueries({
        queryKey: ["auth", "me"],
      });
    },
  });
};


export const useLogoutAll = () => {
  return useMutation({
    mutationFn: logoutAllDevice,
  });
};


// export const useVerifyEmail = (token) => {
//   return useQuery({
//     queryKey: ["auth", "verify-email", token],

//     queryFn: () => verifyEmail(token),

//     enabled: Boolean(token),

//     retry: false,
//   });
// };

// export const useResendVerification = () => {
//   return useMutation({
//     mutationFn: resendVerification,
//   });
// };

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
