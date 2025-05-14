import { SignUp as ClerkSignUp } from "@clerk/clerk-react";
import { Card, CardContent } from "@/components/ui/card";

export function SignUp() {
  return (
    <div className="flex-grow py-16">
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
            <ClerkSignUp
              routing="path"
              path="/sign-up"
              redirectUrl="/"
              signInUrl="/sign-in"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}