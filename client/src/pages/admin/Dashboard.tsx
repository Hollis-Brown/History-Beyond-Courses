import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AdminRoute } from "@/components/auth/AdminRoute";

// Temporary placeholders until we implement the actual components
const UsersTab = () => (
  <Card>
    <CardContent className="p-6">
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <p className="text-muted-foreground">User management will be implemented here.</p>
    </CardContent>
  </Card>
);

const OrdersTab = () => (
  <Card>
    <CardContent className="p-6">
      <h2 className="text-xl font-semibold mb-4">Orders</h2>
      <p className="text-muted-foreground">Order management will be implemented here.</p>
    </CardContent>
  </Card>
);

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  
  // Fetch analytics data
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/analytics");
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }
      return response.json();
    },
  });

  return (
    <AdminRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to site
            </Button>
          </Link>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Total Users</CardTitle>
              <CardDescription>All registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {isLoading ? (
                  <span className="text-gray-400">...</span>
                ) : (
                  analytics?.userCount || 0
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Total Orders</CardTitle>
              <CardDescription>Completed purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {isLoading ? (
                  <span className="text-gray-400">...</span>
                ) : (
                  analytics?.orderCount || 0
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Total Revenue</CardTitle>
              <CardDescription>From all orders</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {isLoading ? (
                  <span className="text-gray-400">...</span>
                ) : (
                  `$${analytics?.totalRevenue || 0}`
                )}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs for Users and Orders */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <UsersTab />
          </TabsContent>
          
          <TabsContent value="orders">
            <OrdersTab />
          </TabsContent>
        </Tabs>
      </div>
    </AdminRoute>
  );
}

export default AdminDashboard;