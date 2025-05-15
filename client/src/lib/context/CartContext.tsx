import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Course, CartItem, CustomerInfo, PaymentInfo } from "../types";

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
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);

  // Static course data
  const staticCourses: Course[] = [
    {
      id: 1,
      title: "Shadows of the Past: Unpacking US History",
      description: "This seminar course explores key historical events and themes shaping early America, including Indigenous American contributions, the arrival of the Pilgrims and Puritans fleeing the Church of England, the American Revolution, the lasting impact of the Constitution, the enslavement of West Africans and their influence on American culture and politics, waves of European immigration, the religious fervor of the Great Awakening, as well as the catalysts of the Civil War. Participants will gain insights into the American mindset and worldview from 1620 to 1854 through textbooks, academic articles, and videos.",
      price: 175.00,
      imageUrl: "https://i.imgur.com/FtBEdsX.jpeg",
      duration: "Length: 90 minutes",
      instructor: "Kyli Brown",
      startDate: "8 June",
      endDate: "3 August",
      dayOfWeek: "Sunday",
      startTime: "16:00",
      timeZone: "GMT"
    },
    {
      id: 2,
      title: "The Obscured Path Shaping the United States from 1900–1950",
      description: "This seminar course examines critical moments that shaped the United States during the first half of the 20th century, including the Second Industrial Revolution, early feminist movement, Jim Crow Laws, the Prohibition era, and the Great Depression. Students will examine America's experiences in both World Wars and how these events influenced U.S. foreign policy toward the UK and Europe. Course materials include textbooks, academic articles, and videos.",
      price: 175.00,
      imageUrl: "https://i.imgur.com/d8bERIs.jpeg",
      duration: "Length: 90 minutes",
      instructor: "Kyli Brown",
      startDate: "10 June",
      endDate: "5 August",
      dayOfWeek: "Tuesday",
      startTime: "7:00",
      timeZone: "GMT"
    }
  ];

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
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    const subtotal = cartItems.reduce((total, item) => {
      const course = staticCourses.find((c) => c.id === item.courseId);
      return total + (course?.price || 0) * item.quantity;
    }, 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const isItemInCart = (courseId: number) => {
    return cartItems.some((item) => item.courseId === courseId);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        courses: staticCourses,
        customerInfo,
        paymentInfo,
        addToCart,
        removeFromCart,
        clearCart,
        getCartItemCount,
        getCartTotal,
        setCustomerInformation: setCustomerInfo,
        setPaymentInformation: setPaymentInfo,
        isItemInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
