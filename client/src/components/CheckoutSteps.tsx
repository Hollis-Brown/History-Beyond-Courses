import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { ProgressSteps } from "./ui/progress-steps";
import { ShoppingCart, User, FileText, CreditCard, Check } from "lucide-react";

export default function CheckoutSteps() {
  const [location] = useLocation();
  
  // Determine current step based on URL
  const getCurrentStep = () => {
    if (location.includes("cart")) return 0;
    if (location.includes("information")) return 1;
    if (location.includes("review")) return 2;
    if (location.includes("payment")) return 3;
    if (location.includes("confirmation")) return 4;
    return 0;
  };

  const currentStep = getCurrentStep();

  const steps = [
    {
      id: "cart",
      label: "Cart",
      href: "/checkout/cart",
      icon: ShoppingCart,
    },
    {
      id: "information",
      label: "Information",
      href: "/checkout/information",
      icon: User,
    },
    {
      id: "review",
      label: "Review",
      href: "/checkout/review",
      icon: FileText,
    },
    {
      id: "payment",
      label: "Payment",
      href: "/checkout/payment",
      icon: CreditCard,
    },
    {
      id: "confirmation",
      label: "Confirmation",
      href: "/checkout/confirmation",
      icon: Check,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <ProgressSteps 
          steps={steps}
          currentStep={currentStep}
        />
      </div>
    </div>
  );
}
