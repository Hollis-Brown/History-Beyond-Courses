import { 
  type Course, 
  type InsertCourse, 
  type Order, 
  type InsertOrder, 
  type OrderItem, 
  type InsertOrderItem, 
  type Contact, 
  type InsertContact,
  type User,
  type InsertUser,
  courses,
  orders,
  orderItems,
  contacts,
  users
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

// Modify the interface with any CRUD methods
export interface IStorage {
  // Users
  getUsers(): Promise<User[]>;
  getUser(id: number): Promise<User | undefined>;
  getUserByClerkId(clerkId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  
  // Courses
  getCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  // Orders
  getOrders(): Promise<Order[]>;
  getOrdersByUserId(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrderByOrderNumber(orderNumber: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  
  // Order Items
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByClerkId(clerkId: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.clerkId, clerkId));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User> {
    const result = await db.update(users).set(user).where(eq(users.id, id)).returning();
    return result[0];
  }
  
  // Courses
  async getCourses(): Promise<Course[]> {
    return db.select().from(courses).orderBy(courses.id);
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const result = await db.select().from(courses).where(eq(courses.id, id));
    return result[0];
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const result = await db.insert(courses).values(course).returning();
    return result[0];
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0];
  }

  async getOrderByOrderNumber(orderNumber: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber));
    return result[0];
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  }

  // Order Items
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const result = await db.insert(orderItems).values(orderItem).returning();
    return result[0];
  }

  // Contacts
  async createContact(contact: InsertContact): Promise<Contact> {
    const result = await db.insert(contacts).values(contact).returning();
    return result[0];
  }

  async getContacts(): Promise<Contact[]> {
    return db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  // Initialize sample data if needed
  async initializeSampleData() {
    // Check if courses exist
    const existingCourses = await this.getCourses();
    
    if (existingCourses.length === 0) {
      // Add sample courses
      const sampleCourses: InsertCourse[] = [
        {
          title: "Renaissance: Art, Politics & Society",
          description: "Explore the cultural rebirth of Europe from the 14th to 17th century. Learn how art, science, politics, and society transformed during this pivotal era.",
          price: "89.99",
          imageUrl: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
          duration: "12 weeks",
          instructor: "Dr. Emily Richards",
        },
        {
          title: "Ancient Civilizations & Their Legacy",
          description: "Journey through the great ancient civilizations of Egypt, Mesopotamia, Greece, and Rome. Discover their innovations, cultures, and lasting influence.",
          price: "79.99",
          imageUrl: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
          duration: "10 weeks",
          instructor: "Prof. James Anderson",
        },
        {
          title: "Medieval Europe: Power & Faith",
          description: "Delve into the complex relationships between religion, monarchy, and society during the Middle Ages. Understand the foundations of modern European identities.",
          price: "69.99",
          imageUrl: "https://images.unsplash.com/photo-1568607689150-16e44c3ba638?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
          duration: "8 weeks",
          instructor: "Dr. Robert Mills",
        },
        {
          title: "World Wars: Global Impact",
          description: "Analyze the causes, events, and lasting consequences of the two World Wars. Examine how these conflicts reshaped international relations and society.",
          price: "99.99",
          imageUrl: "https://images.unsplash.com/photo-1553176878-54037da3ef48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
          duration: "14 weeks",
          instructor: "Prof. Sarah Williams",
        },
      ];
      
      // Insert all courses
      for (const course of sampleCourses) {
        await this.createCourse(course);
      }
      
      console.log("Sample courses initialized");
    }
  }
}

// Create and initialize the database storage
export const storage = new DatabaseStorage();

// Initialize sample data
(async () => {
  try {
    await storage.initializeSampleData();
  } catch (error) {
    console.error("Error initializing sample data:", error);
  }
})();
