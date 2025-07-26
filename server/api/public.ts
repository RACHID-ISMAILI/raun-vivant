import { Router } from "express";
import { z } from "zod";
import { storage } from "../storage";

const router = Router();

// API Key validation middleware
const validateApiKey = (req: any, res: any, next: any) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  
  if (!apiKey) {
    return res.status(401).json({ 
      error: "API key required", 
      message: "Include X-API-Key header or api_key query parameter" 
    });
  }

  // For demo purposes, accept "demo" as API key
  // In production, validate against database
  if (apiKey !== "demo" && apiKey !== "raun-rachid-2025") {
    return res.status(403).json({ 
      error: "Invalid API key", 
      message: "Contact admin for API access" 
    });
  }

  next();
};

// Rate limiting middleware (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const rateLimit = (requestsPerMinute: number = 60) => {
  return (req: any, res: any, next: any) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    
    const clientData = rateLimitMap.get(clientIP);
    
    if (!clientData || now > clientData.resetTime) {
      rateLimitMap.set(clientIP, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    if (clientData.count >= requestsPerMinute) {
      return res.status(429).json({
        error: "Rate limit exceeded",
        message: `Maximum ${requestsPerMinute} requests per minute`,
        retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
      });
    }
    
    clientData.count++;
    next();
  };
};

// Public API Documentation
router.get("/", (req, res) => {
  res.json({
    name: "RAUN-RACHID Public API",
    version: "1.0.0",
    description: "API publique pour l'accès aux capsules de conscience et intentions spirituelles",
    authentication: "API Key required (X-API-Key header)",
    endpoints: {
      "GET /api/public/capsules": "Récupérer toutes les capsules publiques",
      "GET /api/public/capsules/:id": "Récupérer une capsule spécifique",
      "GET /api/public/intentions": "Récupérer les intentions publiques",
      "POST /api/public/intentions": "Créer une nouvelle intention",
      "GET /api/public/stats": "Statistiques publiques de la plateforme"
    },
    rateLimit: "60 requests per minute",
    contact: "contact@raun-rachid.com"
  });
});

// Get all public capsules
router.get("/capsules", validateApiKey, rateLimit(), async (req, res) => {
  try {
    const capsules = await storage.getCapsules();
    
    // Filter out sensitive information for public API
    const publicCapsules = capsules.map(capsule => ({
      id: capsule.id,
      content: capsule.content,
      likes: capsule.likes,
      views: capsule.views,
      createdAt: capsule.createdAt,
      // Remove internal fields like username, etc.
    }));

    res.json({
      success: true,
      data: publicCapsules,
      total: publicCapsules.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching capsules:", error);
    res.status(500).json({ 
      error: "Internal server error",
      message: "Unable to fetch capsules"
    });
  }
});

// Get specific capsule
router.get("/capsules/:id", validateApiKey, rateLimit(), async (req, res) => {
  try {
    const capsuleId = parseInt(req.params.id);
    if (isNaN(capsuleId)) {
      return res.status(400).json({ 
        error: "Invalid capsule ID",
        message: "Capsule ID must be a number"
      });
    }

    const capsules = await storage.getCapsules();
    const capsule = capsules.find(c => c.id === capsuleId);
    
    if (!capsule) {
      return res.status(404).json({ 
        error: "Capsule not found",
        message: `No capsule with ID ${capsuleId}`
      });
    }

    // Public version without sensitive data
    const publicCapsule = {
      id: capsule.id,
      content: capsule.content,
      likes: capsule.likes,
      views: capsule.views,
      createdAt: capsule.createdAt
    };

    res.json({
      success: true,
      data: publicCapsule,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching capsule:", error);
    res.status(500).json({ 
      error: "Internal server error",
      message: "Unable to fetch capsule"
    });
  }
});

// Get public intentions
router.get("/intentions", validateApiKey, rateLimit(), async (req, res) => {
  try {
    const intentions = await storage.getIntentions();
    
    // Filter and format for public API
    const publicIntentions = intentions.map(intention => ({
      id: intention.id,
      content: intention.content,
      author: intention.author || "Âme anonyme",
      createdAt: intention.createdAt
    }));

    res.json({
      success: true,
      data: publicIntentions,
      total: publicIntentions.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching intentions:", error);
    res.status(500).json({ 
      error: "Internal server error",
      message: "Unable to fetch intentions"
    });
  }
});

// Create new intention via API
const createIntentionSchema = z.object({
  content: z.string().min(1).max(1000),
  author: z.string().optional()
});

router.post("/intentions", validateApiKey, rateLimit(10), async (req, res) => {
  try {
    const validation = createIntentionSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "Validation error",
        message: "Invalid intention data",
        details: validation.error.errors
      });
    }

    const { content, author } = validation.data;
    const intention = await storage.createIntention({ content, author });

    res.status(201).json({
      success: true,
      data: {
        id: intention.id,
        content: intention.content,
        author: intention.author || "Âme anonyme",
        createdAt: intention.createdAt
      },
      message: "Intention created successfully",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error creating intention:", error);
    res.status(500).json({ 
      error: "Internal server error",
      message: "Unable to create intention"
    });
  }
});

// Public platform statistics
router.get("/stats", validateApiKey, rateLimit(), async (req, res) => {
  try {
    const [capsules, intentions] = await Promise.all([
      storage.getCapsules(),
      storage.getIntentions()
    ]);

    const totalViews = capsules.reduce((sum, capsule) => sum + capsule.views, 0);
    const totalLikes = capsules.reduce((sum, capsule) => sum + capsule.likes, 0);

    const stats = {
      platform: {
        name: "RAUN-RACHID",
        description: "Réseau d'éveil spirituel",
        launchDate: "2025-01-01"
      },
      metrics: {
        totalCapsules: capsules.length,
        totalIntentions: intentions.length,
        totalViews: totalViews,
        totalLikes: totalLikes,
        avgViewsPerCapsule: capsules.length > 0 ? Math.round(totalViews / capsules.length) : 0,
        avgLikesPerCapsule: capsules.length > 0 ? Math.round(totalLikes / capsules.length) : 0
      },
      activity: {
        recentCapsules: capsules.slice(-3).map(c => ({
          id: c.id,
          preview: c.content.substring(0, 100) + "...",
          createdAt: c.createdAt
        })),
        recentIntentions: intentions.slice(-3).map(i => ({
          id: i.id,
          preview: i.content.substring(0, 50) + "...",
          author: i.author || "Âme anonyme",
          createdAt: i.createdAt
        }))
      },
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ 
      error: "Internal server error",
      message: "Unable to fetch platform statistics"
    });
  }
});

export default router;