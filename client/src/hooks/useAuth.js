import {
  useLogin,
  useLogout,
  useCurrentUser,
} from "../features/auth/auth.hooks.js";

export const useAuth = () => {
  const currentUserQuery = useCurrentUser();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const user =
    currentUserQuery.data?.user ?? null;

  return {
    user,

    isAuthenticated: Boolean(user),

    isLoading: currentUserQuery.isLoading,

    isFetching: currentUserQuery.isFetching,

    isAuthResolved:
      !currentUserQuery.isLoading &&
      !currentUserQuery.isFetching,

    authError: currentUserQuery.error,

    login: loginMutation.mutate,

    loginAsync:
      loginMutation.mutateAsync,

    logout: logoutMutation.mutate,

    logoutAsync:
      logoutMutation.mutateAsync,

    isLoggingIn:
      loginMutation.isPending,

    isLoggingOut:
      logoutMutation.isPending,

    loginError:
      loginMutation.error,

    logoutError:
      logoutMutation.error,

    refetchUser:
      currentUserQuery.refetch,
  };
};