import express, { type Request, Response } from "express";
import type { Express } from "express";
import { storage } from "./storage";
import publicApiRouter from "./api/public";
import webhooksRouter from "./api/webhooks";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-fake-key-for-fallback'
});

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
        content,
        likes: 0,
        views: 0,
        createdAt: new Date()
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
      res.json({ success: true });
    } catch (error) {
      console.error('Error recording view:', error);
      res.status(500).json({ message: "Failed to record view" });
    }
  });

  // Comments routes
  app.get("/api/capsules/:id/comments", async (req: Request, res: Response) => {
    const capsuleId = parseInt(req.params.id);

    try {
      const comments = await storage.getComments(capsuleId);
      res.json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/capsules/:id/comments", async (req: Request, res: Response) => {
    const capsuleId = parseInt(req.params.id);
    const { content, username } = req.body;

    if (!content || !username) {
      return res.status(400).json({ message: "Content and username required" });
    }

    try {
      const comment = await storage.createComment({
        capsuleId,
        username,
        content,
        createdAt: new Date()
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
    const { content, author } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    try {
      const intention = await storage.createIntention({
        content,
        author: author || 'Anonyme',
        response: '',
        createdAt: new Date()
      });

      // Génération automatique de réponse spirituelle avec IA
      let aiResponse = '';
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "Tu es RAUN-RACHID, un guide spirituel sage qui répond aux intentions sacrées avec profondeur et bienveillance. Réponds en français avec sagesse spirituelle, 2-3 phrases maximum."
            },
            {
              role: "user",
              content: `Intention reçue: "${content}"`
            }
          ],
        });
        aiResponse = response.choices[0].message.content || '';
      } catch (error) {
        // Fallback spirituel intelligent
        const mots = content.toLowerCase();
        if (mots.includes('paix')) {
          aiResponse = "La paix véritable naît du silence intérieur. Elle ne dépend d'aucune circonstance extérieure.";
        } else if (mots.includes('amour')) {
          aiResponse = "L'amour authentique commence par l'acceptation de soi. Il rayonne ensuite naturellement vers tous les êtres.";
        } else if (mots.includes('guide') || mots.includes('chemin')) {
          aiResponse = "Le chemin spirituel n'est pas une destination mais un éveil constant à ce qui EST déjà en vous.";
        } else {
          aiResponse = "Votre intention est reçue avec gratitude. Que la conscience éclaire votre chemin, frère/sœur en éveil.";
        }
      }

      // Mise à jour avec la réponse
      await storage.updateIntention(intention.id, { response: aiResponse });

      res.status(201).json({ ...intention, response: aiResponse });
    } catch (error) {
      console.error('Error creating intention:', error);
      res.status(500).json({ message: "Failed to create intention" });
    }
  });



  // Mount public API and webhooks
  app.use("/api/public", publicApiRouter);
  app.use("/api/webhooks", webhooksRouter);

  // Return the server instance
  const { createServer } = await import('http');
  return createServer(app);
}