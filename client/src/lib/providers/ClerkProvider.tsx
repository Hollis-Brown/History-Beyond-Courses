import { ClerkProvider as BaseClerkProvider } from "@clerk/clerk-react";
import { ReactNode } from "react";

// Get the Clerk publishable key - let it default to a placeholder in development
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_placeholder";

export function ClerkProvider({ children }: { children: ReactNode }) {
  return (
    <BaseClerkProvider publishableKey={clerkPubKey}>
      {children}
    </BaseClerkProvider>
  );
}