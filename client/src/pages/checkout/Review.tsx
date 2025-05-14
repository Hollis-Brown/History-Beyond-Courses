import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useCart } from "@/lib/context/CartContext";
import CheckoutSteps from "@/components/CheckoutSteps";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Review() {
  const { cartItems, courses, customerInfo, getCartTotal } = useCart();
  const [, navigate] = useLocation();
  
  const { subtotal, tax, total } = getCartTotal();
  
  // Redirect to information if customer info is missing
  if (!customerInfo) {
    navigate("/checkout/information");
    return null;
  }
  
  // Redirect to cart if cart is empty
  if (cartItems.length === 0) {
    navigate("/checkout/cart");
    return null;
  }
  
  const cartCourses = courses.filter(course => 
    cartItems.some(item => item.courseId === course.id)
  );
  
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
      
      {/* Review Order */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-2xl font-sans font-bold text-neutral-dark mb-6">Review Your Order</h2>
                
                {/* Order Details */}
                <div className="mb-8">
                  <h3 className="text-lg font-sans font-medium text-neutral-dark mb-4">Order Details</h3>
                  
                  <div className="space-y-4">
                    {cartCourses.map((course) => (
                      <div key={course.id} className="flex items-start py-3 border-b border-neutral-light">
                        <div className="flex-grow">
                          <h4 className="font-medium text-neutral-dark">{course.title}</h4>
                          <p className="text-sm text-neutral-medium">{course.duration} course by {course.instructor}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-neutral-dark">${course.price.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Customer Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-sans font-medium text-neutral-dark mb-4">Your Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-neutral-medium">Name</p>
                      <p className="text-neutral-dark">{customerInfo.firstName} {customerInfo.lastName}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-neutral-medium">Email</p>
                      <p className="text-neutral-dark">{customerInfo.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-neutral-medium">Phone</p>
                      <p className="text-neutral-dark">{customerInfo.phone}</p>
                    </div>
                  </div>
                </div>
                
                {/* Order Summary */}
                <div className="mb-6">
                  <h3 className="text-lg font-sans font-medium text-neutral-dark mb-4">Order Summary</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-neutral-dark">Subtotal</span>
                      <span className="text-neutral-dark">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-dark">Tax</span>
                      <span className="text-neutral-dark">${tax.toFixed(2)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between">
                      <span className="font-semibold text-neutral-dark">Total</span>
                      <span className="font-semibold text-neutral-dark">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Link href="/checkout/payment">
                <Button>
                  Proceed to Payment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
