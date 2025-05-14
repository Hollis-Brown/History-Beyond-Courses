import { useUser } from "@clerk/clerk-react";
import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [, setLocation] = useLocation();
  
  // Check if the current user is an admin
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["admin-check"],
    queryFn: async () => {
      if (!isSignedIn || !user) return false;
      const response = await apiRequest("GET", `/api/admin/check`);
      return response.ok;
    },
    enabled: isLoaded && isSignedIn,
  });

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setLocation("/sign-in");
    } else if (isLoaded && isSignedIn && !isLoading && isAdmin === false) {
      setLocation("/"); // Redirect non-admin users to home
    }
  }, [isLoaded, isSignedIn, isAdmin, isLoading, setLocation]);

  // Show loading state while checking authentication
  if (!isLoaded || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  // Only render children if user is signed in and is an admin
  return isSignedIn && isAdmin ? <>{children}</> : null;
}