import { Link, useLocation } from "wouter";
import logo from "@/assets/logo.png";
import { useCart } from "../lib/context/CartContext";
import { ShoppingCart, UserCircle, LogIn, LogOut, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useUser, useClerk } from "@clerk/clerk-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NavBar() {
  const [location] = useLocation();
  const { getCartItemCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const cartItemCount = getCartItemCount();
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();

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
        <Link href="/" className="flex items-center">
          <img
            src="https://i.imgur.com/pwWPfj8.png"
            alt="HistoryBeyondHeadlines Logo"
            className="h-20 w-auto object-contain"
          />
        </Link>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <div className={`cursor-pointer hover:text-primary transition-colors ${location === "/" ? "text-primary font-semibold" : "text-neutral-dark"
              }`}>
              Home
            </div>
          </Link>
          <Link href="/catalog">
            <div className={`cursor-pointer hover:text-primary transition-colors ${location === "/catalog" ? "text-primary font-semibold" : "text-neutral-dark"
              }`}>
              Course Catalog
            </div>
          </Link>
          <Link href="/contact">
            <div className={`cursor-pointer hover:text-primary transition-colors ${location === "/contact" ? "text-primary font-semibold" : "text-neutral-dark"
              }`}>
              Contact
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
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

          {/* User Menu */}
          {isSignedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle className="h-6 w-6" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user?.firstName || "User"}'s Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                </Link>
                {user?.publicMetadata?.role === "admin" && (
                  <Link href="/admin">
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  </Link>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/sign-in">
              <Button variant="outline" size="sm" className="hidden md:flex">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </Link>
          )}
        </div>

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
                <div className={`text-lg hover:text-primary transition-colors ${location === "/" ? "text-primary font-semibold" : "text-neutral-dark"
                  }`}>
                  Home
                </div>
              </Link>
              <Link href="/catalog">
                <div className={`text-lg hover:text-primary transition-colors ${location === "/catalog" ? "text-primary font-semibold" : "text-neutral-dark"
                  }`}>
                  Course Catalog
                </div>
              </Link>
              <Link href="/contact">
                <div className={`text-lg hover:text-primary transition-colors ${location === "/contact" ? "text-primary font-semibold" : "text-neutral-dark"
                  }`}>
                  Contact
                </div>
              </Link>

              <div className="h-px bg-gray-200 my-2"></div>

              {isSignedIn ? (
                <>
                  <Link href="/profile">
                    <div className="text-lg flex items-center hover:text-primary transition-colors">
                      <UserCircle className="mr-2 h-5 w-5" />
                      Profile
                    </div>
                  </Link>

                  {user?.publicMetadata?.role === "admin" && (
                    <Link href="/admin">
                      <div className="text-lg flex items-center hover:text-primary transition-colors">
                        <Settings className="mr-2 h-5 w-5" />
                        Admin Dashboard
                      </div>
                    </Link>
                  )}

                  <div
                    className="text-lg flex items-center text-destructive cursor-pointer"
                    onClick={() => signOut()}
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    Sign Out
                  </div>
                </>
              ) : (
                <Link href="/sign-in">
                  <div className="text-lg flex items-center hover:text-primary transition-colors">
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign In
                  </div>
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
