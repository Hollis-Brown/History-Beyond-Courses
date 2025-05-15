export interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  duration: string;
  instructor: string;
  startDate: string;
  endDate: string;
  dayOfWeek: string;
  startTime: string;
  timeZone: string;
}

export interface CartItem {
  courseId: number;
  quantity: number;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
  address: string;
  city: string;
  zipCode: string;
  state: string;
  country: string;
}

export interface Order {
  id: string;
  items: Course[];
  customerInfo: CustomerInfo;
  paymentInfo: PaymentInfo;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: Date;
}
