import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSchema, 
  insertOrderSchema, 
  insertOrderItemSchema
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { nanoid } from "nanoid";
import { requireAuth, requireAdmin, handleClerkWebhook } from "./middleware/auth";
import { sendContactEmail } from "./services/email";
import { createPaymentIntent, confirmPayment } from "./services/payment";

export async function registerRoutes(app: Express): Promise<Server> {
  // Courses API
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid course ID" });
      }

      const course = await storage.getCourse(id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  // Contact API
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      
      // Save contact to database
      const contact = await storage.createContact(contactData);
      
      // Send email notification
      try {
        await sendContactEmail({
          name: contactData.name,
          email: contactData.email,
          subject: contactData.subject,
          message: contactData.message,
        });
        console.log("Contact email sent successfully");
      } catch (emailError) {
        console.error("Failed to send contact email:", emailError);
        // Continue with the response even if email fails
      }
      
      res.status(201).json({ 
        message: "Message sent successfully",
        contactId: contact.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Orders API
  app.post("/api/orders", async (req, res) => {
    try {
      // Handle the complex order structure from the client
      const orderData = req.body;
      
      // Create payment intent first
      const { clientSecret } = await createPaymentIntent(orderData.total);
      
      // Create the order
      const orderNumber = `HBH-${nanoid(8).toUpperCase()}`;
      
      const parsedOrder = insertOrderSchema.parse({
        orderNumber,
        customerFirstName: orderData.customerInfo.firstName,
        customerLastName: orderData.customerInfo.lastName,
        customerEmail: orderData.customerInfo.email,
        customerPhone: orderData.customerInfo.phone,
        subtotal: orderData.subtotal,
        tax: orderData.tax,
        total: orderData.total,
      });
      
      const order = await storage.createOrder(parsedOrder);
      
      // Create order items for each course in the order
      const orderItemPromises = orderData.items.map(async (courseId: number) => {
        const course = await storage.getCourse(courseId);
        if (course) {
          const orderItemData = insertOrderItemSchema.parse({
            orderId: order.id,
            courseId: course.id,
            price: course.price,
          });
          return storage.createOrderItem(orderItemData);
        }
      });
      
      await Promise.all(orderItemPromises);
      
      res.status(201).json({ 
        message: "Order created successfully",
        orderId: order.id,
        orderNumber: order.orderNumber,
        clientSecret,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Order creation error:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Payment confirmation endpoint
  app.post("/api/payment/confirm", async (req, res) => {
    try {
      const { paymentIntentId } = req.body;
      
      if (!paymentIntentId) {
        return res.status(400).json({ message: "Payment intent ID is required" });
      }
      
      const paymentIntent = await confirmPayment(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ 
          message: "Payment not successful",
          status: paymentIntent.status 
        });
      }
      
      res.json({ 
        message: "Payment confirmed",
        status: paymentIntent.status 
      });
    } catch (error) {
      console.error("Payment confirmation error:", error);
      res.status(500).json({ message: "Failed to confirm payment" });
    }
  });

  // Auth and Admin API
  app.get("/api/admin/check", requireAuth, async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      
      if (!userId) {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      const user = await storage.getUserByClerkId(userId);
      
      if (!user || user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }
      
      res.status(200).json({ isAdmin: true });
    } catch (error) {
      console.error("Admin check error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Admin Analytics
  app.get("/api/admin/analytics", requireAdmin, async (req, res) => {
    try {
      // Get user count
      const users = await storage.getUsers();
      const userCount = users.length;
      
      // Get order count
      const orders = await storage.getOrders();
      const orderCount = orders.length;
      
      // Calculate total revenue
      const totalRevenue = orders.reduce((sum, order) => {
        return sum + parseFloat(order.total.toString());
      }, 0);
      
      res.json({
        userCount,
        orderCount,
        totalRevenue: totalRevenue.toFixed(2),
      });
    } catch (error) {
      console.error("Analytics error:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });
  
  // Admin Users List
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      console.error("Users list error:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });
  
  // Admin Orders List
  app.get("/api/admin/orders", requireAdmin, async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Orders list error:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });
  
  // Clerk webhook handler
  app.post("/api/webhooks/clerk", handleClerkWebhook);
  
  const httpServer = createServer(app);
  return httpServer;
}
