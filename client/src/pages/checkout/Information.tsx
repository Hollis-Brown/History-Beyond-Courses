import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/context/CartContext";
import { useLocation } from "wouter";
import CheckoutSteps from "@/components/CheckoutSteps";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";

const customerInfoSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(7, {
    message: "Please enter a valid phone number.",
  }),
});

type CustomerInfoValues = z.infer<typeof customerInfoSchema>;

export default function Information() {
  const { customerInfo, setCustomerInformation, cartItems } = useCart();
  const [, navigate] = useLocation();
  
  useEffect(() => {
  // Redirect to cart if cart is empty
  if (cartItems.length === 0) {
    navigate("/checkout/cart");
    }
  }, [cartItems, navigate]);
  
  // Don't render if cart is empty
  if (cartItems.length === 0) {
    return null;
  }
  
  const form = useForm<CustomerInfoValues>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      firstName: customerInfo?.firstName || "",
      lastName: customerInfo?.lastName || "",
      email: customerInfo?.email || "",
      phone: customerInfo?.phone || "",
    },
  });

  function onSubmit(data: CustomerInfoValues) {
    setCustomerInformation(data);
    navigate("/checkout/review");
  }

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
      
      {/* Information Form */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-sans font-bold text-neutral-dark mb-6">Your Information</h2>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <h3 className="text-lg font-sans font-medium text-neutral-dark mb-4">Personal Details</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-sans font-medium text-neutral-dark mb-4">Contact Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input type="tel" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <Button type="submit">
                        Continue to Review
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
