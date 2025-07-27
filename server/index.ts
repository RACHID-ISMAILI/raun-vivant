import express from "express";
import session from "express-session";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { setupVite, log } from "./vite";

const app = express();
const server = createServer(app);

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Session configuration
app.use(session({
  secret: 'raun-rachid-secret-key-for-sessions',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Register API routes first
    await registerRoutes(app);
    
    // Setup Vite middleware for development
    if (process.env.NODE_ENV === "development") {
      await setupVite(app, server);
    }

    server.listen(Number(PORT), "0.0.0.0", () => {
      log(`🚀 Serveur RAUN-RACHID démarré sur le port ${PORT}`);
      log(`🌐 URL: http://localhost:${PORT}`);
      console.log("================================================================================");
      console.log("🔥 RAUN-RACHID SYSTÈME SÉCURISÉ ACTIVÉ");
      console.log(`🔥 PORT: ${PORT}`);
      console.log(`🔥 URL: http://localhost:${PORT}`);
      console.log("🔥 ARCHITECTURE CLIENT/SERVEUR MODERNE");
      console.log("🔥 ZONES D'ÉCRITURE SCIENCES & HUMANITÉ AJOUTÉES");
      console.log("🔥 SYNCHRONISATION CAPSULES ADMIN/PUBLIC CORRIGÉE");
      console.log("🔥 INTERFACE SPIRITUELLE COMPLÈTE");
      console.log("================================================================================");
    });

  } catch (error) {
    console.error("❌ Erreur lors du démarrage du serveur:", error);
    process.exit(1);
  }
}

startServer();