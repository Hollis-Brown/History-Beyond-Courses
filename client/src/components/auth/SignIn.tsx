import { SignIn as ClerkSignIn } from "@clerk/clerk-react";
import { Card, CardContent } from "@/components/ui/card";

export function SignIn() {
  return (
    <div className="flex-grow py-16">
      <div className="container mx-auto px-4">
        <Card className="max-w-lg mx-auto">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
            <ClerkSignIn
              routing="path"
              path="/sign-in"
              redirectUrl="/"
              signUpUrl="/sign-up"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}