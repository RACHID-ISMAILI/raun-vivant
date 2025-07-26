import express, { type Request, Response } from "express";
import type { Express } from "express";
import { storage } from "./storage";

// Session interface extension
declare module 'express-serve-static-core' {
  interface Request {
    session?: any;
  }
}

// Simple OpenAI fallback without importing the library
const openai = {
  chat: {
    completions: {
      create: async (params: any) => {
        // Fallback response for spiritual intentions
        return {
          choices: [{
            message: {
              content: "Votre intention a été reçue avec gratitude. L'univers conspire en votre faveur. Restez centré sur votre cœur et suivez votre intuition."
            }
          }]
        };
      }
    }
  }
};

export async function registerRoutes(app: Express) {
  // === API ROUTES UNIQUEMENT ===
  
  // Authentication routes
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    try {
      const user = await storage.getUser(username);
      
      if (!user) {
        // Auto-register new users
        await storage.createUser({ username, password });
      } else if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session = { userId: username };
      res.json({ success: true, user: { username } });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session = null;
    res.json({ success: true });
  });

  app.get("/api/auth/me", (req: Request, res: Response) => {
    if (req.session?.userId) {
      res.json({ user: { username: req.session.userId } });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Capsules routes
  app.get("/api/capsules", async (req: Request, res: Response) => {
    try {
      const capsules = await storage.getCapsules();
      res.json(capsules);
    } catch (error) {
      console.error('Error fetching capsules:', error);
      res.status(500).json({ message: "Failed to fetch capsules" });
    }
  });

  app.post("/api/capsules", async (req: Request, res: Response) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const { content } = req.body;
      if (!content) {
        return res.status(400).json({ message: "Content is required" });
      }

      const capsule = await storage.createCapsule({
        content
      });

      res.status(201).json(capsule);
    } catch (error) {
      console.error('Error creating capsule:', error);
      res.status(500).json({ message: "Failed to create capsule" });
    }
  });

  app.delete("/api/capsules/:id", async (req: Request, res: Response) => {
    if (!req.session?.userId || req.session.userId !== 'rachid') {
      return res.status(403).json({ message: "Admin access required" });
    }

    try {
      const id = parseInt(req.params.id);
      await storage.deleteCapsule(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting capsule:', error);
      res.status(500).json({ message: "Failed to delete capsule" });
    }
  });

  app.post("/api/capsules/:id/vote", async (req: Request, res: Response) => {
    const capsuleId = parseInt(req.params.id);
    const userId = req.ip || 'anonymous';

    try {
      await storage.toggleVote(capsuleId, userId, 'like');
      const capsules = await storage.getCapsules();
      const capsule = capsules.find(c => c.id === capsuleId);
      
      res.json({ 
        success: true, 
        likes: capsule?.likes || 0 
      });
    } catch (error) {
      console.error('Error voting:', error);
      res.status(500).json({ message: "Failed to vote" });
    }
  });

  app.post("/api/capsules/:id/view", async (req: Request, res: Response) => {
    const capsuleId = parseInt(req.params.id);

    try {
      await storage.incrementViews(capsuleId);
      const capsules = await storage.getCapsules();
      const capsule = capsules.find(c => c.id === capsuleId);
      
      res.json({ 
        success: true, 
        views: capsule?.views || 0 
      });
    } catch (error) {
      console.error('Error incrementing views:', error);
      res.status(500).json({ message: "Failed to increment views" });
    }
  });

  // Comments routes
  app.get("/api/capsules/:id/comments", async (req: Request, res: Response) => {
    try {
      const capsuleId = parseInt(req.params.id);
      const comments = await storage.getComments(capsuleId);
      res.json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/capsules/:id/comments", async (req: Request, res: Response) => {
    try {
      const capsuleId = parseInt(req.params.id);
      const { content } = req.body;
      const username = req.session?.userId || 'Anonyme';

      if (!content) {
        return res.status(400).json({ message: "Content is required" });
      }

      const comment = await storage.createComment({
        capsuleId,
        username,
        content
      });

      res.status(201).json(comment);
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Intentions routes
  app.get("/api/intentions", async (req: Request, res: Response) => {
    try {
      const intentions = await storage.getIntentions();
      res.json(intentions);
    } catch (error) {
      console.error('Error fetching intentions:', error);
      res.status(500).json({ message: "Failed to fetch intentions" });
    }
  });

  app.post("/api/intentions", async (req: Request, res: Response) => {
    try {
      const { content, author } = req.body;

      if (!content) {
        return res.status(400).json({ message: "Content is required" });
      }

      // Create intention with basic data
      const intention = await storage.createIntention({
        content,
        author: author || null
      });

      // Try to get AI response (with fallback)
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [{
            role: "system",
            content: "Tu es un guide spirituel bienveillant. Réponds aux intentions avec sagesse et amour."
          }, {
            role: "user", 
            content: `Intention reçue: "${content}"`
          }],
          max_tokens: 150
        });

        if (response.choices?.[0]?.message?.content) {
          await storage.updateIntention(intention.id, {
            response: response.choices[0].message.content
          });
        }
      } catch (openaiError) {
        console.log('OpenAI unavailable, using fallback response');
        // Already have the fallback response from our mock openai
      }

      res.status(201).json(intention);
    } catch (error) {
      console.error('Error creating intention:', error);
      res.status(500).json({ message: "Failed to create intention" });
    }
  });
}