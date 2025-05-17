import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider } from "@/lib/providers/ClerkProvider";
import { CartProvider } from "@/lib/context/CartContext";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import Contact from "@/pages/Contact";
import Cart from "@/pages/checkout/Cart";
import Information from "@/pages/checkout/Information";
import Review from "@/pages/checkout/Review";
import Payment from "@/pages/checkout/Payment";
import Confirmation from "@/pages/checkout/Confirmation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { SignIn } from "@/components/auth/SignIn";
import { SignUp } from "@/components/auth/SignUp";
import { UserProfile } from "@/components/auth/UserProfile";
import AdminDashboard from "@/pages/admin/Dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/catalog" component={Catalog} />
      <Route path="/contact" component={Contact} />
      
      {/* Authentication Routes */}
      <Route path="/sign-in">
        <SignIn />
      </Route>
      <Route path="/sign-up">
        <SignUp />
      </Route>
      
      {/* Protected User Routes */}
      <Route path="/profile">
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      </Route>
      
      {/* Admin Routes */}
      <Route path="/admin">
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      </Route>
      
      {/* Checkout Routes */}
      <Route path="/checkout/cart" component={Cart} />
      <Route path="/checkout/information" component={Information} />
      <Route path="/checkout/review" component={Review} />
      <Route path="/checkout/payment" component={Payment} />
      <Route path="/checkout/confirmation" component={Confirmation} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider>
        <CartProvider>
          <TooltipProvider>
            <div className="flex flex-col min-h-screen">
              <NavBar />
              <main className="flex-grow">
                <Router />
              </main>
              <Footer />
            </div>
            <ScrollToTop />
            <Toaster />
          </TooltipProvider>
        </CartProvider>
      </ClerkProvider>
    </QueryClientProvider>
  );
}

export default App;
