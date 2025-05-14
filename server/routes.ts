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
      const contact = await storage.createContact(contactData);
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
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
