import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

interface AuthResponse {
  authenticated: boolean;
  user: User | null;
}

export function useAuth() {
  const { data, isLoading } = useQuery<AuthResponse>({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    user: data?.user ?? null,
    isLoading,
    isAuthenticated: data?.authenticated ?? false,
  };
}
