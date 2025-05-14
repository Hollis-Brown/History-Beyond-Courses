import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { isSignedIn, isAdmin, isLoaded, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isLoaded && !isLoading && (!isSignedIn || !isAdmin)) {
      setLocation("/");
    }
  }, [isSignedIn, isAdmin, isLoaded, isLoading, setLocation]);

  if (isLoading || !isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isSignedIn || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}