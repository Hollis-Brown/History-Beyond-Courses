import { Link, useLocation } from "wouter";
import { useCart } from "../lib/context/CartContext";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function NavBar() {
  const [location] = useLocation();
  const { getCartItemCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const cartItemCount = getCartItemCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`sticky top-0 w-full z-50 bg-white transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center">
            <h1 className="font-sans text-xl font-bold">
              <span className="text-secondary">History</span>
              <span className="text-primary">Beyond</span>
            </h1>
          </div>
        </Link>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <div className={`hover:text-primary transition-colors ${
              location === "/" ? "text-primary font-semibold" : "text-neutral-dark"
            }`}>
              Home
            </div>
          </Link>
          <Link href="/catalog">
            <div className={`hover:text-primary transition-colors ${
              location === "/catalog" ? "text-primary font-semibold" : "text-neutral-dark"
            }`}>
              Course Catalog
            </div>
          </Link>
          <Link href="/contact">
            <div className={`hover:text-primary transition-colors ${
              location === "/contact" ? "text-primary font-semibold" : "text-neutral-dark"
            }`}>
              Contact
            </div>
          </Link>
        </div>

        {/* Cart */}
        <Link href="/checkout/cart">
          <div className="relative flex items-center text-neutral-dark hover:text-primary transition-colors">
            <ShoppingCart className="h-6 w-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>
        </Link>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="flex flex-col space-y-4 mt-8">
              <Link href="/">
                <div className={`text-lg hover:text-primary transition-colors ${
                  location === "/" ? "text-primary font-semibold" : "text-neutral-dark"
                }`}>
                  Home
                </div>
              </Link>
              <Link href="/catalog">
                <div className={`text-lg hover:text-primary transition-colors ${
                  location === "/catalog" ? "text-primary font-semibold" : "text-neutral-dark"
                }`}>
                  Course Catalog
                </div>
              </Link>
              <Link href="/contact">
                <div className={`text-lg hover:text-primary transition-colors ${
                  location === "/contact" ? "text-primary font-semibold" : "text-neutral-dark"
                }`}>
                  Contact
                </div>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
