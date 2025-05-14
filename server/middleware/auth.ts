import { Request, Response, NextFunction } from "express";
import { Webhook } from 'svix';
import { storage } from "../storage";
import { buffer } from "micro";

// Middleware to check if a user is authenticated
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  try {
    const token = req.headers.authorization.split(" ")[1];
    
    // Here we would typically validate the token with Clerk
    // For simplicity, we're just checking if the token is present
    // In a production app, you'd use Clerk's SDK to validate this
    
    if (!token) {
      return res.status(401).json({ error: "Invalid token" });
    }
    
    // Typically you'd have user information from token verification
    // req.user = decodedToken.user;
    
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ error: "Authentication failed" });
  }
};

// Middleware to check if a user is an admin
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await requireAuth(req, res, async () => {
      // Assuming we have the user ID from authentication
      // Check if the user has admin role
      // For simplicity in this version, we're just checking headers
      // In a production app, you'd verify this from the auth token
      
      const userId = req.headers['x-user-id'] as string;
      
      if (!userId) {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      const user = await storage.getUserByClerkId(userId);
      
      if (!user || user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }
      
      next();
    });
  } catch (error) {
    console.error("Admin auth error:", error);
    return res.status(403).json({ error: "Admin verification failed" });
  }
};

// Handler for Clerk webhook events
export const handleClerkWebhook = async (req: Request, res: Response) => {
  // Verify webhook signature
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!WEBHOOK_SECRET) {
    console.error("Missing Clerk webhook secret");
    return res.status(500).json({ error: "Server misconfigured" });
  }
  
  // Get the webhook signature from the request headers
  const svixId = req.headers["svix-id"] as string;
  const svixTimestamp = req.headers["svix-timestamp"] as string;
  const svixSignature = req.headers["svix-signature"] as string;
  
  if (!svixId || !svixTimestamp || !svixSignature) {
    return res.status(400).json({ error: "Missing svix headers" });
  }
  
  // Get the raw body of the request
  const rawBody = await buffer(req);
  
  try {
    // Create a new Svix webhook instance using your webhook secret
    const wh = new Webhook(WEBHOOK_SECRET);
    
    // Verify the webhook payload
    const payload = wh.verify(
      rawBody.toString(),
      {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }
    ) as { type: string; data: any };
    
    // Handle different webhook events
    const { type, data } = payload;
    
    switch (type) {
      case "user.created":
        await handleUserCreated(data);
        break;
      case "user.updated":
        await handleUserUpdated(data);
        break;
      case "user.deleted":
        await handleUserDeleted(data);
        break;
      default:
        console.log(`Unhandled webhook event: ${type}`);
    }
    
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return res.status(400).json({ error: "Invalid webhook payload" });
  }
};

// Helper function to handle user created event
async function handleUserCreated(data: any) {
  try {
    const { id, email_addresses, first_name, last_name, image_url } = data;
    
    // Check if user already exists
    const existingUser = await storage.getUserByClerkId(id);
    
    if (existingUser) {
      return; // User already exists, do nothing
    }
    
    // Create new user
    await storage.createUser({
      clerkId: id,
      email: email_addresses[0]?.email_address || "",
      firstName: first_name || null,
      lastName: last_name || null,
      profileImageUrl: image_url || null,
      role: "user", // Default role
    });
    
    console.log(`User created in database: ${id}`);
  } catch (error) {
    console.error("Error handling user.created webhook:", error);
  }
}

// Helper function to handle user updated event
async function handleUserUpdated(data: any) {
  try {
    const { id, email_addresses, first_name, last_name, image_url } = data;
    
    // Find user in database
    const user = await storage.getUserByClerkId(id);
    
    if (!user) {
      console.log(`User not found for update: ${id}`);
      return;
    }
    
    // Update user information
    await storage.updateUser(user.id, {
      email: email_addresses[0]?.email_address || user.email,
      firstName: first_name || user.firstName,
      lastName: last_name || user.lastName,
      profileImageUrl: image_url || user.profileImageUrl,
    });
    
    console.log(`User updated in database: ${id}`);
  } catch (error) {
    console.error("Error handling user.updated webhook:", error);
  }
}

// Helper function to handle user deleted event
async function handleUserDeleted(data: any) {
  try {
    const { id } = data;
    
    // We would typically soft-delete or anonymize the user here
    // For this example, we're not implementing a full delete
    console.log(`User deleted in Clerk: ${id}`);
  } catch (error) {
    console.error("Error handling user.deleted webhook:", error);
  }
}