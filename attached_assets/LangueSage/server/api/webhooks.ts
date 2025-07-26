import { Router } from "express";
import { z } from "zod";
import { storage } from "../storage";

const router = Router();

// Webhook event types
type WebhookEvent = 
  | "capsule.created"
  | "capsule.liked" 
  | "intention.created"
  | "user.registered";

interface WebhookPayload {
  event: WebhookEvent;
  data: any;
  timestamp: string;
  source: "raun-rachid";
}

// Simple webhook registry (in production, use database)
const webhookEndpoints = new Map<string, {
  url: string;
  events: WebhookEvent[];
  secret: string;
  active: boolean;
}>();

// Initialize with demo endpoints
webhookEndpoints.set("demo-discord", {
  url: "https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_TOKEN",
  events: ["capsule.created", "intention.created"],
  secret: "demo-secret",
  active: false // Set to true when configured
});

webhookEndpoints.set("demo-slack", {
  url: "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK",
  events: ["capsule.liked", "intention.created"],
  secret: "demo-secret",
  active: false
});

// Webhook registration
const registerWebhookSchema = z.object({
  url: z.string().url(),
  events: z.array(z.enum(["capsule.created", "capsule.liked", "intention.created", "user.registered"])),
  secret: z.string().min(8),
  name: z.string().optional()
});

router.post("/register", async (req, res) => {
  try {
    const validation = registerWebhookSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "Validation error",
        details: validation.error.errors
      });
    }

    const { url, events, secret, name } = validation.data;
    const webhookId = `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    webhookEndpoints.set(webhookId, {
      url,
      events,
      secret,
      active: true
    });

    res.status(201).json({
      success: true,
      webhookId,
      message: "Webhook registered successfully",
      data: {
        id: webhookId,
        url,
        events,
        active: true,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Error registering webhook:", error);
    res.status(500).json({ 
      error: "Internal server error",
      message: "Unable to register webhook"
    });
  }
});

// List registered webhooks
router.get("/list", (req, res) => {
  const webhooks = Array.from(webhookEndpoints.entries()).map(([id, config]) => ({
    id,
    url: config.url,
    events: config.events,
    active: config.active
    // Don't expose secret
  }));

  res.json({
    success: true,
    data: webhooks,
    total: webhooks.length
  });
});

// Send webhook notification
export async function sendWebhook(event: WebhookEvent, data: any) {
  const payload: WebhookPayload = {
    event,
    data,
    timestamp: new Date().toISOString(),
    source: "raun-rachid"
  };

  // Find webhooks that listen to this event
  const relevantWebhooks = Array.from(webhookEndpoints.entries())
    .filter(([_, config]) => config.active && config.events.includes(event));

  const promises = relevantWebhooks.map(async ([id, config]) => {
    try {
      const response = await fetch(config.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RAUN-Signature": generateSignature(payload, config.secret),
          "User-Agent": "RAUN-RACHID-Webhooks/1.0"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.error(`Webhook ${id} failed:`, response.status, response.statusText);
      } else {
        console.log(`✅ Webhook ${id} sent successfully`);
      }
    } catch (error) {
      console.error(`Webhook ${id} error:`, error);
    }
  });

  // Send all webhooks in parallel
  await Promise.allSettled(promises);
}

// Generate HMAC signature for webhook security
function generateSignature(payload: WebhookPayload, secret: string): string {
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  return `sha256=${hmac.digest('hex')}`;
}

// Webhook test endpoint
router.post("/test/:webhookId", async (req, res) => {
  const { webhookId } = req.params;
  const webhook = webhookEndpoints.get(webhookId);

  if (!webhook) {
    return res.status(404).json({
      error: "Webhook not found",
      message: `No webhook with ID ${webhookId}`
    });
  }

  // Send test payload
  const testPayload: WebhookPayload = {
    event: "capsule.created",
    data: {
      id: 999,
      content: "Test de capsule pour validation webhook",
      test: true
    },
    timestamp: new Date().toISOString(),
    source: "raun-rachid"
  };

  try {
    const response = await fetch(webhook.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RAUN-Signature": generateSignature(testPayload, webhook.secret),
        "User-Agent": "RAUN-RACHID-Webhooks/1.0"
      },
      body: JSON.stringify(testPayload)
    });

    res.json({
      success: response.ok,
      status: response.status,
      message: response.ok ? "Test webhook sent successfully" : "Test webhook failed"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to send test webhook",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Popular webhook integrations examples
router.get("/examples", (req, res) => {
  res.json({
    success: true,
    examples: {
      discord: {
        description: "Notifications Discord pour nouvelles capsules",
        events: ["capsule.created", "intention.created"],
        setup: "Créez un webhook Discord et utilisez l'URL fournie"
      },
      slack: {
        description: "Notifications Slack pour l'équipe",
        events: ["capsule.liked", "intention.created"],
        setup: "Configurez une Incoming Webhook dans Slack"
      },
      zapier: {
        description: "Automatisation avec Zapier",
        events: ["capsule.created", "capsule.liked", "intention.created"],
        setup: "Utilisez le webhook Zapier comme URL de destination"
      },
      custom: {
        description: "Endpoint personnalisé pour votre application",
        events: ["capsule.created", "capsule.liked", "intention.created", "user.registered"],
        setup: "Configurez votre propre endpoint HTTPS"
      }
    },
    documentation: "https://docs.raun-rachid.com/webhooks"
  });
});

export default router;