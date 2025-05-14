import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useCart } from "@/lib/context/CartContext";
import CheckoutSteps from "@/components/CheckoutSteps";
import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export default function Cart() {
  const { cartItems, courses, removeFromCart, getCartTotal } = useCart();
  const [courseToRemove, setCourseToRemove] = useState<number | null>(null);
  
  const { subtotal, tax, total } = getCartTotal();
  
  const cartCourses = courses.filter(course => 
    cartItems.some(item => item.courseId === course.id)
  );
  
  const handleRemove = (courseId: number) => {
    removeFromCart(courseId);
    setCourseToRemove(null);
  };
  
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
      
      {/* Cart Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-2xl font-sans font-bold text-neutral-dark mb-6">
                  Your Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                </h2>
                
                {cartCourses.length > 0 ? (
                  <div className="space-y-6">
                    {cartCourses.map((course) => (
                      <div key={course.id} className="flex flex-col md:flex-row items-start md:items-center py-4 border-b border-neutral-light">
                        <div className="w-full md:w-24 h-24 bg-neutral-light rounded mb-4 md:mb-0 md:mr-4 flex-shrink-0">
                          <img 
                            src={course.imageUrl}
                            alt={course.title}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        
                        <div className="flex-grow mr-4">
                          <h3 className="text-lg font-sans font-medium text-neutral-dark mb-1">{course.title}</h3>
                          <p className="text-sm text-neutral-medium">{course.duration} course by {course.instructor}</p>
                        </div>
                        
                        <div className="flex items-center mt-4 md:mt-0">
                          <span className="font-semibold text-neutral-dark mr-4">${course.price.toFixed(2)}</span>
                          <AlertDialog open={courseToRemove === course.id} onOpenChange={(open) => {
                            if (!open) setCourseToRemove(null);
                          }}>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setCourseToRemove(course.id)}
                              >
                                <Trash2 className="h-5 w-5 text-neutral-medium hover:text-accent" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove Course</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove "{course.title}" from your cart?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleRemove(course.id)}>Remove</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-neutral-medium mb-4">Your cart is empty</p>
                    <Link href="/catalog">
                      <Button>Browse Courses</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {cartCourses.length > 0 && (
              <>
                {/* Order Summary */}
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-sans font-bold text-neutral-dark mb-4">Order Summary</h2>
                    
                    <div className="space-y-3 mb-6">
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
                  </CardContent>
                </Card>
                
                <div className="flex justify-end">
                  <Link href="/checkout/information">
                    <Button>
                      Continue to Information
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
