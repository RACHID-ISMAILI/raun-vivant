import express, { type Request, Response } from "express";
import type { Express } from "express";
import { storage } from "./storage";

// Session interface extension  
declare module 'express-session' {
  interface SessionData {
    userId?: string;
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

// Générateur de contenu spirituel basé sur les thèmes
function generateSpiritualContent(theme: string): string {
  const spiritualTemplates = {
    "éveil": [
      "L'éveil n'est pas une destination mais un chemin. Chaque moment de présence authentique est une victoire contre l'illusion. Nous sommes déjà ce que nous cherchons à devenir.",
      "Dans l'éveil, nous découvrons que nous ne sommes pas séparés du divin - nous en sommes l'expression vivante. Chaque respiration est une prière, chaque battement de cœur une affirmation de l'unité."
    ],
    "amour": [
      "L'amour véritable transcende toutes les formes. Il ne demande rien, ne juge personne, et illumine tout ce qu'il touche. Soyez cet amour que vous cherchez dans le monde.",
      "Dans l'amour inconditionnel, nous trouvons la clé de notre libération. Aimez sans attente, donnez sans condition, et recevez avec gratitude tout ce que la vie vous offre."
    ],
    "conscience": [
      "La conscience est comme un océan infini. Chaque pensée n'est qu'une vague à sa surface, mais l'essence demeure éternellement calme et profonde. Nous ne sommes pas nos pensées, nous sommes l'observateur silencieux qui les contemple.",
      "En cultivant la conscience, nous découvrons que nous sommes à la fois l'observateur et l'observé, le rêveur et le rêve. Cette unité révèle la véritable nature de notre être."
    ],
    "paix": [
      "La paix intérieure ne dépend d'aucune circonstance extérieure. Elle réside en permanence au cœur de votre être, attendant simplement d'être reconnue et embrassée.",
      "Dans le silence de l'esprit paisible, toutes les réponses se révèlent. La paix n'est pas l'absence de tempête, mais la tranquillité au centre de celle-ci."
    ],
    "lumière": [
      "Vous êtes la lumière que vous cherchez dans l'obscurité. Cette lumière divine brille en permanence en vous, attendant que vous arrêtiez de la chercher ailleurs pour la reconnaître en vous.",
      "La lumière de la conscience illumine tout ce qu'elle touche. Soyez cette lumière pour vous-même et pour les autres, et regardez le monde se transformer."
    ],
    "default": [
      "Dans le silence de l'esprit, toutes les réponses se révèlent. Ne cherchez pas à comprendre avec le mental, mais à ressentir avec le cœur. La vérité ne se pense pas, elle se vit.",
      "Chaque moment présent est une porte vers l'infini. Quand nous cessons de résister à ce qui est, nous découvrons la beauté parfaite de l'existence telle qu'elle se déploie.",
      "L'univers conspire en votre faveur. Chaque expérience, même difficile, vous guide vers une compréhension plus profonde de votre véritable nature divine."
    ]
  };

  // Trouver le thème correspondant ou utiliser le thème par défaut
  const lowerTheme = theme.toLowerCase();
  let selectedTemplates = spiritualTemplates.default;

  for (const [key, templates] of Object.entries(spiritualTemplates)) {
    if (lowerTheme.includes(key) && key !== 'default') {
      selectedTemplates = templates;
      break;
    }
  }

  // Sélectionner aléatoirement un template
  const randomIndex = Math.floor(Math.random() * selectedTemplates.length);
  return selectedTemplates[randomIndex];
}

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

      req.session.userId = username;
      res.json({ success: true, user: { username } });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
      }
    });
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

  // Route pour générer des capsules avec IA
  app.post("/api/capsules/generate", async (req: Request, res: Response) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const { theme } = req.body;
      if (!theme) {
        return res.status(400).json({ message: "Theme is required" });
      }

      // Génération de contenu spirituel basé sur le thème
      const spiritualContent = generateSpiritualContent(theme);
      
      // Créer et sauvegarder la capsule
      const capsule = await storage.createCapsule({
        content: spiritualContent
      });

      res.json(capsule);
    } catch (error) {
      console.error('Error generating capsule:', error);
      res.status(500).json({ message: "Failed to generate capsule" });
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