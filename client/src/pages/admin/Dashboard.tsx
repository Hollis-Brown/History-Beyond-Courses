import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, ShoppingCart, DollarSign, TrendingUp, Calendar } from "lucide-react";
import { UsersTab } from "./components/UsersTab";
import { OrdersTab } from "./components/OrdersTab";

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your courses, users, and orders</p>
        </div>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to site
          </Button>
        </Link>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Total Users
            </CardTitle>
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
            <CardTitle className="text-xl flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2 text-primary" />
              Total Orders
            </CardTitle>
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
            <CardTitle className="text-xl flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-primary" />
              Total Revenue
            </CardTitle>
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

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Average Order
            </CardTitle>
            <CardDescription>Revenue per order</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {isLoading ? (
                <span className="text-gray-400">...</span>
              ) : analytics?.orderCount > 0 ? (
                `$${(parseFloat(analytics?.totalRevenue) / analytics?.orderCount).toFixed(2)}`
              ) : (
                "$0.00"
              )}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for Users and Orders */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Orders
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <UsersTab />
        </TabsContent>
        
        <TabsContent value="orders">
          <OrdersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdminDashboard;