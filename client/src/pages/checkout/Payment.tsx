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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { nanoid } from "nanoid";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const paymentSchema = z.object({
  paymentMethod: z.enum(["creditCard", "paypal"]),
  cardNumber: z.string().min(13, {
    message: "Card number must be at least 13 digits.",
  }).optional().or(z.literal('')),
  expiryDate: z.string().min(5, {
    message: "Expiry date must be in MM/YY format.",
  }).optional().or(z.literal('')),
  cvv: z.string().min(3, {
    message: "CVV must be at least 3 digits.",
  }).optional().or(z.literal('')),
  nameOnCard: z.string().min(2, {
    message: "Name is required.",
  }).optional().or(z.literal('')),
  address: z.string().min(5, {
    message: "Address is required.",
  }),
  city: z.string().min(2, {
    message: "City is required.",
  }),
  zipCode: z.string().min(4, {
    message: "Zip code is required.",
  }),
  state: z.string().min(2, {
    message: "State is required.",
  }),
  country: z.string().min(2, {
    message: "Country is required.",
  }),
}).refine((data) => {
  // If payment method is credit card, validate card details
  if (data.paymentMethod === 'creditCard') {
    return !!data.cardNumber && !!data.expiryDate && !!data.cvv && !!data.nameOnCard;
  }
  return true;
}, {
  message: "Credit card details are required",
  path: ["paymentMethod"],
});

type PaymentValues = z.infer<typeof paymentSchema>;

export default function Payment() {
  const { cartItems, courses, customerInfo, setPaymentInformation, getCartTotal } = useCart();
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
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
  
  const form = useForm<PaymentValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: "creditCard",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      nameOnCard: "",
      address: "",
      city: "",
      zipCode: "",
      state: "",
      country: "",
    },
  });

  const paymentMethod = form.watch("paymentMethod");
  
  async function onSubmit(data: PaymentValues) {
    setIsSubmitting(true);
    
    try {
      const { subtotal, tax, total } = getCartTotal();
      
      // Create order on server
      const coursesInCart = courses.filter(course => 
        cartItems.some(item => item.courseId === course.id)
      );
      
      const order = {
        id: nanoid(),
        items: coursesInCart.map(course => course.id),
        customerInfo,
        paymentInfo: data,
        subtotal,
        tax,
        total,
        createdAt: new Date().toISOString(),
      };
      
      await apiRequest("POST", "/api/orders", order);
      
      // Save payment info to context
      setPaymentInformation(data);
      
      // Navigate to confirmation
      navigate("/checkout/confirmation");
    } catch (error) {
      toast({
        title: "Payment processing failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
      
      {/* Payment Form */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-sans font-bold text-neutral-dark mb-6">Payment Information</h2>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Payment Method */}
                    <div>
                      <h3 className="text-lg font-sans font-medium text-neutral-dark mb-4">Payment Method</h3>
                      
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-3"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="creditCard" id="creditCard" />
                                  <FormLabel htmlFor="creditCard" className="font-normal">Credit Card</FormLabel>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="paypal" id="paypal" />
                                  <FormLabel htmlFor="paypal" className="font-normal">PayPal</FormLabel>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Card Details - only shown if payment method is credit card */}
                    {paymentMethod === "creditCard" && (
                      <div>
                        <h3 className="text-lg font-sans font-medium text-neutral-dark mb-4">Card Details</h3>
                        
                        <div className="grid grid-cols-1 gap-6">
                          <FormField
                            control={form.control}
                            name="cardNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Card Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="1234 5678 9012 3456" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="expiryDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Expiration Date</FormLabel>
                                  <FormControl>
                                    <Input placeholder="MM/YY" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="cvv"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>CVV</FormLabel>
                                  <FormControl>
                                    <Input placeholder="123" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="nameOnCard"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name on Card</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Billing Address */}
                    <div>
                      <h3 className="text-lg font-sans font-medium text-neutral-dark mb-4">Billing Address</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Zip/Postal Code</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State/Province</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Country" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="us">United States</SelectItem>
                                    <SelectItem value="ca">Canada</SelectItem>
                                    <SelectItem value="uk">United Kingdom</SelectItem>
                                    <SelectItem value="au">Australia</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Processing..." : "Complete Purchase"}
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
