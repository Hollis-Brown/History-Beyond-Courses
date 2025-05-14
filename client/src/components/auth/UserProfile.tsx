import { UserProfile as ClerkUserProfile, UserButton, useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function UserProfile() {
  const { isSignedIn, user } = useAuth();
  const { user: clerkUser } = useUser();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Fetch the user's orders
  const { data: orders, isLoading: isOrdersLoading } = useQuery({
    queryKey: ["/api/user/orders"],
    enabled: !!isSignedIn,
  });
  
  return (
    <div className="flex-grow py-16">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Your Account</h1>
              <UserButton />
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-6">
                <div className="flex items-center space-x-4">
                  {clerkUser?.imageUrl && (
                    <img 
                      src={clerkUser.imageUrl} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h2 className="text-xl font-semibold">
                      {clerkUser?.firstName} {clerkUser?.lastName}
                    </h2>
                    <p className="text-muted-foreground">{clerkUser?.emailAddresses[0]?.emailAddress}</p>
                    {user?.role === "admin" && (
                      <span className="inline-block px-2 py-1 mt-2 text-xs bg-primary text-primary-foreground rounded">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-6">
                  <ClerkUserProfile />
                </div>
              </TabsContent>
              
              <TabsContent value="orders">
                <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
                
                {isOrdersLoading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : orders && orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order: any) => (
                      <Card key={order.id} className="overflow-hidden">
                        <div className="bg-muted px-4 py-2 flex justify-between items-center">
                          <div>
                            <span className="font-medium">Order #{order.orderNumber}</span>
                            <span className="text-sm text-muted-foreground ml-4">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <span className="font-semibold">{formatCurrency(order.total)}</span>
                        </div>
                        <CardContent className="p-4">
                          <div className="grid gap-2">
                            <div className="flex justify-between text-sm">
                              <span>Status:</span>
                              <span className="font-medium text-green-600">Completed</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Subtotal:</span>
                              <span>{formatCurrency(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Tax:</span>
                              <span>{formatCurrency(order.tax)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border rounded-md bg-muted/20">
                    <p className="text-muted-foreground">You haven't made any orders yet.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="settings">
                <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                <p className="text-muted-foreground mb-4">
                  Manage your account settings and preferences.
                </p>
                
                <div className="text-center py-8">
                  <p>Account settings can be managed through your Clerk profile.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}