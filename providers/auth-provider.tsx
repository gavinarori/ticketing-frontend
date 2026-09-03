// providers/auth-provider.tsx
"use client";

import { createContext, useContext, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as authApi from "@/lib/api/auth";
import type { LoginInput, RegisterInput } from "@/lib/validators/auth";
import type { User } from "@/types/user";
import { ApiError } from "@/types/api";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  logout: () => Promise<void>;
  isLoggingIn: boolean;
  isRegistering: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_QUERY_KEY = ["session"] as const;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const sessionQuery = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: authApi.getSession,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (user) => queryClient.setQueryData(SESSION_QUERY_KEY, user),
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (user) => queryClient.setQueryData(SESSION_QUERY_KEY, user),
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => queryClient.setQueryData(SESSION_QUERY_KEY, null),
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      user: sessionQuery.data ?? null,
      isLoading: sessionQuery.isLoading,
      login: (input) => loginMutation.mutateAsync(input),
      register: (input) => registerMutation.mutateAsync(input),
      logout: () => logoutMutation.mutateAsync(),
      isLoggingIn: loginMutation.isPending,
      isRegistering: registerMutation.isPending,
    }),
    [sessionQuery.data, sessionQuery.isLoading, loginMutation, registerMutation, logoutMutation]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}

/** Re-exported for callers that just want to distinguish "wrong password" from a network failure. */
export { ApiError };