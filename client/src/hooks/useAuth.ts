import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";

export function useAuth() {
  const { user: clerkUser, isSignedIn, isLoaded } = useUser();
  
  // Fetch additional user data from our backend when user is signed in
  const { data: userData, isLoading: isUserDataLoading } = useQuery({
    queryKey: ["/api/users/current"],
    queryFn: async () => {
      if (!isSignedIn) return null;
      const response = await apiRequest("GET", "/api/users/current");
      return response.json() as Promise<User | null>;
    },
    enabled: !!isSignedIn,
  });
  
  return {
    user: userData,
    clerkUser,
    isSignedIn,
    isLoaded,
    isLoading: !isLoaded || isUserDataLoading,
    isAdmin: clerkUser?.publicMetadata?.role === "admin",
  };
}