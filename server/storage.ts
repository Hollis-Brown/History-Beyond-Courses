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
    console.log("Starting sample data initialization...");
    // Check if courses exist
    const existingCourses = await this.getCourses();
    console.log("Existing courses:", existingCourses);
    
    if (existingCourses.length === 0) {
      console.log("No courses found, initializing sample data...");
      // Add sample courses
      const sampleCourses: InsertCourse[] = [
        {
          title: "Shadows of the Past: Unpacking US History",
          description: "This seminar course explores key historical events and themes shaping early America, including Indigenous American contributions, the arrival of the Pilgrims and Puritans fleeing the Church of England, the American Revolution, the lasting impact of the Constitution, the enslavement of West Africans and their influence on American culture and politics, waves of European immigration, the religious fervor of the Great Awakening, as well as the catalysts of the Civil War. Participants will gain insights into the American mindset and worldview from 1620 to 1854 through textbooks, academic articles, and videos.",
          price: "175.00",
          imageUrl: "https://i.imgur.com/FtBEdsX.jpeg",
          duration: "Length: 90 minutes",
          instructor: "Kyli Brown",
          startDate: "8 June",
          endDate: "3 August",
          dayOfWeek: "Sunday",
          startTime: "16:00",
          timeZone: "GMT",
        },
        {
          title: "The Obscured Path Shaping the United States from 1900–1950",
          description: "This seminar course examines critical moments that shaped the United States during the first half of the 20th century, including the Second Industrial Revolution, early feminist movement, Jim Crow Laws, the Prohibition era, and the Great Depression. Students will examine America's experiences in both World Wars and how these events influenced U.S. foreign policy toward the UK and Europe. Course materials include textbooks, academic articles, and videos.",
          price: "175.00",
          imageUrl: "https://i.imgur.com/d8bERIs.jpeg",
          duration: "Length: 90 minutes",
          instructor: "Kyli Brown",
          startDate: "10 June",
          endDate: "5 August",
          dayOfWeek: "Tuesday",
          startTime: "7:00",
          timeZone: "GMT",
        },
      ];
      
      // Insert all courses
      for (const course of sampleCourses) {
        try {
          const createdCourse = await this.createCourse(course);
          console.log("Created course:", createdCourse);
        } catch (error) {
          console.error("Error creating course:", error);
        }
      }
      
      console.log("Sample courses initialization completed");
    } else {
      console.log("Courses already exist, skipping initialization");
    }
  }
}

// Create and initialize the database storage
export const storage = new DatabaseStorage();

// Initialize sample data
(async () => {
  try {
    // Wait a bit for the database to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if we can connect to the database
    try {
      await db.select().from(courses).limit(1);
    } catch (error) {
      console.log("Tables not ready yet, skipping sample data initialization");
      return;
    }
    
    await storage.initializeSampleData();
  } catch (error) {
    console.error("Error initializing sample data:", error);
  }
})();
