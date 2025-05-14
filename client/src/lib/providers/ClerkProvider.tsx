import { ClerkProvider as BaseClerkProvider } from "@clerk/clerk-react";
import { ReactNode } from "react";

// Get the Clerk publishable key
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY environment variable");
}

export function ClerkProvider({ children }: { children: ReactNode }) {
  return (
    <BaseClerkProvider publishableKey={clerkPubKey}>
      {children}
    </BaseClerkProvider>
  );
}