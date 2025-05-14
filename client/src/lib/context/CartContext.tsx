import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Course, CartItem, CustomerInfo, PaymentInfo } from "../types";
import { apiRequest } from "../queryClient";

// Define a default empty context value to avoid undefined errors
const defaultContextValue = {
  cartItems: [] as CartItem[],
  courses: [] as Course[],
  customerInfo: null as CustomerInfo | null,
  paymentInfo: null as PaymentInfo | null,
  addToCart: (_courseId: number) => {},
  removeFromCart: (_courseId: number) => {},
  clearCart: () => {},
  getCartItemCount: () => 0,
  getCartTotal: () => ({ subtotal: 0, tax: 0, total: 0 }),
  setCustomerInformation: (_info: CustomerInfo) => {},
  setPaymentInformation: (_info: PaymentInfo) => {},
  isItemInCart: (_courseId: number) => false,
};

interface CartContextType {
  cartItems: CartItem[];
  courses: Course[];
  customerInfo: CustomerInfo | null;
  paymentInfo: PaymentInfo | null;
  addToCart: (courseId: number) => void;
  removeFromCart: (courseId: number) => void;
  clearCart: () => void;
  getCartItemCount: () => number;
  getCartTotal: () => { subtotal: number; tax: number; total: number };
  setCustomerInformation: (info: CustomerInfo) => void;
  setPaymentInformation: (info: PaymentInfo) => void;
  isItemInCart: (courseId: number) => boolean;
}

// Create the context with the default value
const CartContext = createContext<CartContextType>(defaultContextValue);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);

  useEffect(() => {
    // Load cart from localStorage
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    }

    // Fetch courses
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses");
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        } else {
          console.error("Failed to fetch courses:", response.statusText);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        // If fetching fails, provide some sample courses
        setCourses([
          {
            id: 1,
            title: "Renaissance: Art, Politics & Society",
            description: "Explore the cultural rebirth of Europe.",
            price: 89.99,
            imageUrl: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
            duration: "12 weeks",
            instructor: "Dr. Emily Richards",
          },
          {
            id: 2,
            title: "Ancient Civilizations & Their Legacy",
            description: "Journey through the great ancient civilizations.",
            price: 79.99,
            imageUrl: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
            duration: "10 weeks",
            instructor: "Prof. James Anderson",
          },
        ]);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cartItems]);

  const addToCart = (courseId: number) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.courseId === courseId);
      if (existingItem) {
        return prev.map((item) =>
          item.courseId === courseId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { courseId, quantity: 1 }];
    });
  };

  const removeFromCart = (courseId: number) => {
    setCartItems((prev) => prev.filter((item) => item.courseId !== courseId));
  };

  const clearCart = () => {
    setCartItems([]);
    setCustomerInfo(null);
    setPaymentInfo(null);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getCartTotal = () => {
    const subtotal = cartItems.reduce((total, item) => {
      const course = courses.find((c) => c.id === item.courseId);
      return total + (course?.price || 0) * item.quantity;
    }, 0);
    const tax = subtotal * 0.06; // 6% tax rate
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const setCustomerInformation = (info: CustomerInfo) => {
    setCustomerInfo(info);
  };

  const setPaymentInformation = (info: PaymentInfo) => {
    setPaymentInfo(info);
  };

  const isItemInCart = (courseId: number) => {
    return cartItems.some((item) => item.courseId === courseId);
  };
  
  // Create the context value object
  const contextValue: CartContextType = {
    cartItems,
    courses,
    customerInfo,
    paymentInfo,
    addToCart,
    removeFromCart,
    clearCart,
    getCartItemCount,
    getCartTotal,
    setCustomerInformation,
    setPaymentInformation,
    isItemInCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  return context;
}
