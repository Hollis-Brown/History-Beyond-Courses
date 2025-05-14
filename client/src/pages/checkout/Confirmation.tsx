import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useCart } from "@/lib/context/CartContext";
import CheckoutSteps from "@/components/CheckoutSteps";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { nanoid } from "nanoid";

export default function Confirmation() {
  const { customerInfo, clearCart, getCartTotal } = useCart();
  const [, navigate] = useLocation();
  
  // Generate order number
  const orderNumber = `HBH-${nanoid(8).toUpperCase()}`;
  const orderDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const { total } = getCartTotal();
  
  // Redirect to cart if customer info is missing (likely coming directly to this page)
  useEffect(() => {
    if (!customerInfo) {
      navigate("/checkout/cart");
    }
    
    // Clear cart after successful order (with a delay to ensure total is calculated)
    const timeout = setTimeout(() => {
      clearCart();
    }, 2000);
    
    return () => clearTimeout(timeout);
  }, [customerInfo, navigate, clearCart]);
  
  if (!customerInfo) return null;
  
  return (
    <div className="flex-grow">
      {/* Checkout Header */}
      <div className="bg-neutral-light py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-sans font-bold text-neutral-dark text-center">Checkout</h1>
          <div className="w-20 h-1 bg-primary mx-auto mt-4"></div>
        </div>
      </div>
      
      {/* Checkout Progress */}
      <CheckoutSteps />
      
      {/* Confirmation */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="text-white text-2xl" />
                </div>
                
                <h2 className="text-2xl font-sans font-bold text-neutral-dark mb-4">Order Confirmed!</h2>
                
                <p className="text-lg text-neutral-dark mb-8">
                  Thank you for your purchase. Your order has been successfully processed.
                </p>
                
                <div className="mb-8">
                  <h3 className="text-lg font-sans font-medium text-neutral-dark mb-4">Order Details</h3>
                  
                  <div className="flex justify-center">
                    <div className="text-left inline-block">
                      <p className="mb-2"><span className="font-medium">Order Number:</span> {orderNumber}</p>
                      <p className="mb-2"><span className="font-medium">Order Date:</span> {orderDate}</p>
                      <p><span className="font-medium">Total Amount:</span> ${total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-neutral-dark mb-8">
                  A confirmation email has been sent to your email address with all the details of your purchase. You can access your courses in your account dashboard.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link href="/">
                    <Button>
                      Return to Home
                    </Button>
                  </Link>
                  <Button variant="link" className="text-primary hover:text-secondary">
                    View My Courses
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
