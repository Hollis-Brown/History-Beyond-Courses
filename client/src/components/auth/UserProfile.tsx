import { UserProfile as ClerkUserProfile } from "@clerk/clerk-react";
import { Card, CardContent } from "@/components/ui/card";

export function UserProfile() {
  return (
    <div className="flex-grow py-16">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
            <ClerkUserProfile />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}