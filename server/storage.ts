import { 
  type Course, 
  type InsertCourse, 
  type Order, 
  type InsertOrder, 
  type OrderItem, 
  type InsertOrderItem, 
  type Contact, 
  type InsertContact
} from "@shared/schema";
import { nanoid } from "nanoid";

// Modify the interface with any CRUD methods
export interface IStorage {
  // Courses
  getCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrderByOrderNumber(orderNumber: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  
  // Order Items
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;
}

export class MemStorage implements IStorage {
  private courses: Map<number, Course>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private contacts: Map<number, Contact>;
  private courseIdCounter: number;
  private orderIdCounter: number;
  private orderItemIdCounter: number;
  private contactIdCounter: number;

  constructor() {
    this.courses = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.contacts = new Map();
    
    this.courseIdCounter = 1;
    this.orderIdCounter = 1;
    this.orderItemIdCounter = 1;
    this.contactIdCounter = 1;
    
    // Initialize with sample courses
    this.initializeSampleCourses();
  }

  private initializeSampleCourses() {
    const sampleCourses: InsertCourse[] = [
      {
        title: "Renaissance: Art, Politics & Society",
        description: "Explore the cultural rebirth of Europe from the 14th to 17th century. Learn how art, science, politics, and society transformed during this pivotal era.",
        price: 89.99,
        imageUrl: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        duration: "12 weeks",
        instructor: "Dr. Emily Richards",
      },
      {
        title: "Ancient Civilizations & Their Legacy",
        description: "Journey through the great ancient civilizations of Egypt, Mesopotamia, Greece, and Rome. Discover their innovations, cultures, and lasting influence.",
        price: 79.99,
        imageUrl: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        duration: "10 weeks",
        instructor: "Prof. James Anderson",
      },
      {
        title: "Medieval Europe: Power & Faith",
        description: "Delve into the complex relationships between religion, monarchy, and society during the Middle Ages. Understand the foundations of modern European identities.",
        price: 69.99,
        imageUrl: "https://images.unsplash.com/photo-1568607689150-16e44c3ba638?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        duration: "8 weeks",
        instructor: "Dr. Robert Mills",
      },
      {
        title: "World Wars: Global Impact",
        description: "Analyze the causes, events, and lasting consequences of the two World Wars. Examine how these conflicts reshaped international relations and society.",
        price: 99.99,
        imageUrl: "https://images.unsplash.com/photo-1553176878-54037da3ef48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        duration: "14 weeks",
        instructor: "Prof. Sarah Williams",
      },
    ];

    sampleCourses.forEach(course => this.createCourse(course));
  }

  // Courses
  async getCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const id = this.courseIdCounter++;
    const newCourse: Course = { id, ...course };
    this.courses.set(id, newCourse);
    return newCourse;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrderByOrderNumber(orderNumber: string): Promise<Order | undefined> {
    return Array.from(this.orders.values()).find(
      (order) => order.orderNumber === orderNumber
    );
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderIdCounter++;
    const newOrder: Order = { 
      id, 
      ...order,
      createdAt: new Date(),
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  // Order Items
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      (item) => item.orderId === orderId
    );
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemIdCounter++;
    const newOrderItem: OrderItem = { id, ...orderItem };
    this.orderItems.set(id, newOrderItem);
    return newOrderItem;
  }

  // Contacts
  async createContact(contact: InsertContact): Promise<Contact> {
    const id = this.contactIdCounter++;
    const newContact: Contact = { 
      id, 
      ...contact,
      createdAt: new Date(),
    };
    this.contacts.set(id, newContact);
    return newContact;
  }
}

export const storage = new MemStorage();
