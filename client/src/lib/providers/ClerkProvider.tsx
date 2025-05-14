import { ClerkProvider as BaseClerkProvider } from "@clerk/clerk-react";
import { ReactNode } from "react";

// Use the provided Clerk publishable key
const CLERK_PUBLISHABLE_KEY = "pk_test_YmVsb3ZlZC1zcGFycm93LTU2LmNsZXJrLmFjY291bnRzLmRldiQ";

export function ClerkProvider({ children }: { children: ReactNode }) {
  return (
    <BaseClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      {children}
    </BaseClerkProvider>
  );
}