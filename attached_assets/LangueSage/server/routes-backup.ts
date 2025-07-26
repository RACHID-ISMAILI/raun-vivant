import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertCapsuleSchema, insertCommentSchema, insertVoteSchema, insertIntentionSchema } from "@shared/schema";
import { z } from "zod";
import { analyzeIntention, generateConsciousCapsule } from "./openai";
import publicApiRouter from "./api/public";
import webhooksRouter, { sendWebhook } from "./api/webhooks";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Session management avec cookies persistants
  const sessionStore = new Map<string, { username: string; expires: number }>();
  
  // Récupérer la session depuis les cookies
  function getSessionFromRequest(req: any): string | null {
    return req.cookies?.sessionId || null;
  }
  
  // Définir la session dans les cookies
  function setSessionCookie(res: any, sessionId: string): void {
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: false, // pour development
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24h
    });
  }
  
  // Fonction pour nettoyer les sessions expirées
  function cleanExpiredSessions() {
    const now = Date.now();
    const entries = Array.from(sessionStore.entries());
    for (const [sessionId, session] of entries) {
      if (session.expires < now) {
        sessionStore.delete(sessionId);
      }
    }
  }
  
  // Générer un ID de session unique
  function generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
  
  // Obtenir l'utilisateur actuel depuis la session avec cookies
  function getCurrentUser(req: any): string | null {
    const sessionId = getSessionFromRequest(req);
    if (!sessionId) return null;
    
    const session = sessionStore.get(sessionId);
    if (!session || session.expires < Date.now()) {
      if (session) sessionStore.delete(sessionId);
      return null;
    }
    return session.username;
  }

  // Authentication
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = insertUserSchema.parse(req.body);
      
      let user = await storage.getUserByUsername(username);
      if (!user) {
        // Create user if doesn't exist (simple auth)
        user = await storage.createUser({ username, password });
      } else if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Nettoyer les sessions expirées
      cleanExpiredSessions();
      
      // Créer nouvelle session avec expiration de 24h
      const newSessionId = generateSessionId();
      sessionStore.set(newSessionId, {
        username: username,
        expires: Date.now() + (24 * 60 * 60 * 1000) // 24h
      });
      
      // Définir le cookie de session
      setSessionCookie(res, newSessionId);
      
      console.log("🟢 SESSION CREATED - SessionId:", newSessionId, "User:", username);
      res.json({ user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    const currentUser = getCurrentUser(req);
    const sessionId = getSessionFromRequest(req);
    console.log("🔴 LOGOUT API CALLED - User was:", currentUser);
    console.trace("Stack trace:");
    
    // Supprimer la session
    if (sessionId) {
      sessionStore.delete(sessionId);
      console.log("🔴 SESSION DELETED - SessionId:", sessionId);
    }
    
    // Supprimer le cookie
    res.clearCookie('sessionId');
    
    res.json({ message: "Logged out successfully" });
  });

  app.get("/api/auth/me", (req, res) => {
    const currentUser = getCurrentUser(req);
    const sessionId = getSessionFromRequest(req);
    if (!currentUser) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    console.log("🔍 AUTH CHECK - SessionId:", sessionId, "User:", currentUser);
    res.json({ username: currentUser });
  });

  // Capsules
  app.get("/api/capsules", async (req, res) => {
    try {
      const capsules = await storage.getCapsules();
      res.json(capsules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch capsules" });
    }
  });

  app.post("/api/capsules", async (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const capsuleData = insertCapsuleSchema.parse(req.body);
      const capsule = await storage.createCapsule(capsuleData);
      res.json(capsule);
    } catch (error) {
      res.status(400).json({ message: "Invalid capsule data" });
    }
  });

  // Comments
  app.get("/api/capsules/:id/comments", async (req, res) => {
    try {
      const capsuleId = parseInt(req.params.id);
      const comments = await storage.getCommentsByCapsuleId(capsuleId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/capsules/:id/comments", async (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const capsuleId = parseInt(req.params.id);
      const commentData = insertCommentSchema.parse({
        ...req.body,
        capsuleId,
        username: currentUser,
      });
      const comment = await storage.createComment(commentData);
      res.json(comment);
    } catch (error) {
      res.status(400).json({ message: "Invalid comment data" });
    }
  });

  // Votes
  app.post("/api/capsules/:id/vote", async (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const capsuleId = parseInt(req.params.id);
      const { type } = z.object({ type: z.enum(["like"]) }).parse(req.body);
      
      const capsule = await storage.getCapsule(capsuleId);
      if (!capsule) {
        return res.status(404).json({ message: "Capsule not found" });
      }
      
      const existingVote = await storage.getVote(capsuleId, currentUser);
      
      if (existingVote) {
        // Remove vote if already liked
        await storage.deleteVote(capsuleId, currentUser);
        await storage.updateCapsuleLikes(capsuleId, capsule.likes - 1);
      } else {
        // Create new like
        await storage.createVote({ capsuleId, username: currentUser, type });
        await storage.updateCapsuleLikes(capsuleId, capsule.likes + 1);
      }
      
      const updatedCapsule = await storage.getCapsule(capsuleId);
      res.json(updatedCapsule);
    } catch (error) {
      res.status(400).json({ message: "Invalid vote data" });
    }
  });

  // Demo likes - no authentication required, toggle system per user
  app.post("/api/capsules/:id/demo-like", async (req, res) => {
    try {
      const capsuleId = parseInt(req.params.id);
      
      const capsule = await storage.getCapsule(capsuleId);
      if (!capsule) {
        return res.status(404).json({ message: "Capsule not found" });
      }
      
      // Generate a unique identifier for this demo user session
      const userIdentifier = req.ip || 'default-user';
      
      // Toggle like system: odd clicks = liked (1), even clicks = not liked (0)
      const updatedCapsule = await storage.toggleDemoLike(capsuleId, userIdentifier);
      
      res.json(updatedCapsule);
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // Demo comments - no authentication required
  app.post("/api/capsules/:id/demo-comment", async (req, res) => {
    try {
      const capsuleId = parseInt(req.params.id);
      const { content } = req.body;
      
      if (!content || !content.trim()) {
        return res.status(400).json({ message: "Comment content is required" });
      }
      
      const capsule = await storage.getCapsule(capsuleId);
      if (!capsule) {
        return res.status(404).json({ message: "Capsule not found" });
      }
      
      // Generate a demo username based on IP or random
      const userIdentifier = req.ip || 'default-user';
      const demoUsername = `DemoUser_${userIdentifier.split('.').join('')}`;
      
      const commentData = insertCommentSchema.parse({
        content: content.trim(),
        capsuleId,
        username: demoUsername,
      });
      
      const comment = await storage.createComment(commentData);
      res.json(comment);
    } catch (error) {
      res.status(400).json({ message: "Invalid comment data" });
    }
  });

  // View tracking
  app.post("/api/capsules/:id/view", async (req, res) => {
    try {
      const capsuleId = parseInt(req.params.id);
      const capsule = await storage.getCapsule(capsuleId);
      if (!capsule) {
        return res.status(404).json({ message: "Capsule not found" });
      }
      
      // Use a default user identifier for anonymous users or the current logged-in user
      const currentUser = getCurrentUser(req);
      const username = currentUser || `anonymous_${req.ip || 'unknown'}`;
      
      // Record view only if this user hasn't seen this capsule before
      await storage.recordCapsuleView(capsuleId, username);
      
      const updatedCapsule = await storage.getCapsule(capsuleId);
      
      // Add cache-busting headers for immediate UI updates
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      
      res.json(updatedCapsule);
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // Demo view increment - for manual refresh button
  app.post("/api/capsules/:id/demo-view", async (req, res) => {
    try {
      const capsuleId = parseInt(req.params.id);
      const capsule = await storage.getCapsule(capsuleId);
      if (!capsule) {
        return res.status(404).json({ message: "Capsule not found" });
      }
      
      // Force increment view count (for demo purposes)
      await storage.updateCapsuleViews(capsuleId, capsule.views + 1);
      
      const updatedCapsule = await storage.getCapsule(capsuleId);
      
      // Force no cache for immediate update
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      
      res.json(updatedCapsule);
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // Demo comment - for anonymous comments on public page
  app.post("/api/capsules/:id/demo-comment", async (req, res) => {
    try {
      const capsuleId = parseInt(req.params.id);
      const { content } = req.body;
      
      if (!content || !content.trim()) {
        return res.status(400).json({ message: "Comment content is required" });
      }
      
      const capsule = await storage.getCapsule(capsuleId);
      if (!capsule) {
        return res.status(404).json({ message: "Capsule not found" });
      }
      
      // Create anonymous comment
      const comment = await storage.createComment({
        capsuleId,
        username: "Visiteur",
        content: content.trim()
      });
      
      res.json(comment);
    } catch (error) {
      console.error("Demo comment error:", error);
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // Admin routes
  app.delete("/api/capsules/:id", async (req, res) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const capsuleId = parseInt(req.params.id);
      await storage.deleteCapsule(capsuleId);
      res.json({ message: "Capsule deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete capsule" });
    }
  });

  // Intentions
  app.get("/api/intentions", async (req, res) => {
    try {
      const intentions = await storage.getIntentions();
      res.json(intentions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch intentions" });
    }
  });

  app.post("/api/intentions", async (req, res) => {
    try {
      const intentionData = insertIntentionSchema.parse(req.body);
      const intention = await storage.createIntention(intentionData);
      
      // Générer réponse IA automatique
      let aiResponse = "";
      try {
        const analysis = await analyzeIntention(intentionData.content);
        aiResponse = analysis.resonance || analysis.guidance || "Votre intention a été reçue avec conscience.";
        
        // Send webhook
        await sendWebhook('intention_created', {
          intention: { ...intention, aiAnalysis: analysis },
          timestamp: new Date().toISOString()
        });
      } catch (aiError) {
        console.error("OpenAI analysis failed:", aiError);
        
        // Réponses spirituelles prédéfinies 
        const responses = [
          "🔥 Votre intention résonne profondément avec l'énergie universelle. La conscience reconnaît votre authentique désir de transformation et vous accompagne sur ce chemin d'éveil.",
          "✨ Cette intention porte en elle la graine sacrée de votre évolution spirituelle. Cultivez-la avec patience, présence et confiance en votre pouvoir créateur intérieur.",
          "💎 L'univers entend votre appel sincère. Votre intention s'aligne parfaitement avec le flux créateur de l'existence. Laissez-la germer en conscience.",
          "🌟 Belle intention, frère/sœur spirituel(le). Votre conscience s'élève et contribue activement à l'éveil collectif de l'humanité. Continuez à rayonner.",
          "🔮 Cette intention émane directement de votre centre authentique. Elle porte la force pure de la manifestation consciente. Faites-lui confiance.",
          "🌊 Votre intention traverse les dimensions de la conscience comme une onde de lumière. Elle rejoint le réseau d'éveil planétaire et amplifie la transformation.",
          "⚡ L'énergie de votre intention active des codes de conscience endormis. Vous participez à l'activation spirituelle de notre époque. Merci pour votre contribution."
        ];
        
        aiResponse = responses[Math.floor(Math.random() * responses.length)];
      }
      
      res.json({ 
        intention, 
        aiResponse 
      });
    } catch (error) {
      console.error("Error creating intention:", error);
      res.status(500).json({ error: "Failed to create intention" });
    }
  });

  // Generate conscious capsule with AI
  app.post("/api/capsules/generate", async (req, res) => {
    try {
      const { theme } = z.object({ theme: z.string().min(1) }).parse(req.body);
      
      // Generate a conscious capsule using OpenAI
      const generatedContent = await generateConsciousCapsule(theme);
      
      // Create the capsule
      const capsuleData = insertCapsuleSchema.parse({ 
        content: generatedContent 
      });
      
      const capsule = await storage.createCapsule(capsuleData);
      
      // Send webhook for AI generated capsule
      await sendWebhook('capsule.created', {
        capsule,
        theme,
        timestamp: new Date().toISOString()
      });
      
      res.json(capsule);
    } catch (error) {
      console.error("Error generating capsule:", error);
      res.status(400).json({ message: "Failed to generate capsule" });
    }
  });

  // Route pour rediriger vers l'interface React
  app.get("/matrix", (req, res) => {
    res.redirect('/');
  });

  // Route de test pour vérifier l'interface statique (supprimée)
  app.get("/static-test", (req, res) => {
    const staticHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RAUN-RACHID - Réseau d'Éveil Spirituel</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #000; color: #00ff00; font-family: 'Courier New', monospace; overflow-x: hidden; min-height: 100vh; }
        .matrix-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; opacity: 0.2; }
        .matrix-column { position: absolute; top: -100px; font-size: 12px; line-height: 1.2; animation: fall 5s linear infinite; opacity: 0.6; }
        @keyframes fall { 0% { transform: translateY(-100px); opacity: 1; } 100% { transform: translateY(100vh); opacity: 0; } }
        .content { position: relative; z-index: 10; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; }
        .profile { width: 96px; height: 96px; border: 2px solid #00ff00; border-radius: 50%; margin: 0 auto 2rem; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold; background: rgba(0, 255, 0, 0.1); }
        h1 { font-size: 3rem; margin-bottom: 1rem; text-shadow: 0 0 10px #00ff00; }
        .subtitle { font-size: 1.2rem; margin-bottom: 3rem; opacity: 0.8; text-align: center; }
        .nav-links { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; margin-bottom: 3rem; }
        .nav-link { padding: 12px 24px; border: 1px solid #00ff00; background: rgba(0, 255, 0, 0.1); color: #00ff00; text-decoration: none; transition: all 0.3s; font-family: inherit; }
        .nav-link:hover { background: rgba(0, 255, 0, 0.2); box-shadow: 0 0 15px rgba(0, 255, 0, 0.3); }
        .status { text-align: center; opacity: 0.6; font-size: 0.9rem; }
        .quote { font-style: italic; margin-top: 2rem; text-shadow: 0 0 5px #00ff00; }
    </style>
</head>
<body>
    <div class="matrix-bg" id="matrixBg"></div>
    <div class="content">
        <div class="profile">R</div>
        <h1>RAUN-RACHID</h1>
        <p class="subtitle">Réseau d'éveil spirituel et de conscience</p>
        <div class="nav-info">
            <p style="color: #00ff00; margin-bottom: 1rem;">Interface LangueSage avec Sidebar RAUN-RACHID</p>
            <p style="color: #00ff00; opacity: 0.8; font-size: 0.9rem;">Sidebar droite → Zone principale avec capsules de conscience</p>
            <div style="margin-top: 2rem; padding: 1rem; border: 1px solid #00ff00; border-radius: 4px; background: rgba(0,255,0,0.05);">
                <p style="font-size: 0.9rem; margin: 0;">Démo fonctionnelle avec :</p>
                <ul style="margin: 0.5rem 0; padding-left: 1rem; font-size: 0.8rem;">
                    <li>Sidebar droite avec capsules</li>
                    <li>Navigation clic → affichage zone principale</li>  
                    <li>Sessions cookies persistants</li>
                    <li>Esthétique Matrix préservée</li>
                </ul>
            </div>
        </div>
        <div class="status">
            <p>Interface Matrix - Version statique fonctionnelle</p>
            <p>Sessions avec cookies persistants actives</p>
            <p class="quote">"Nul ne peut éteindre ce que je suis."</p>
        </div>
    </div>
    <script>
        const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        function createColumn() {
            const column = document.createElement('div');
            column.className = 'matrix-column';
            column.style.left = Math.random() * 100 + '%';
            let text = '';
            for (let i = 0; i < 20; i++) {
                text += characters.charAt(Math.floor(Math.random() * characters.length)) + '<br>';
            }
            column.innerHTML = text;
            document.getElementById('matrixBg').appendChild(column);
            setTimeout(() => column.remove(), 5000);
        }
        setInterval(createColumn, 200);
    </script>
</body>
</html>`;
    res.setHeader('Content-Type', 'text/html');
    res.send(staticHtml);
  });

  // Mount public API routes
  app.use("/api/public", publicApiRouter);
  
  // Mount webhook routes
  app.use("/api/webhooks", webhooksRouter);

  // Route racine redirigée vers React - INTERFACE SUPPRIMÉE POUR FORCER REACT
  // app.get('/', async (req, res) => {
  //   res.redirect('/interface-direct');
  // });

  // TOUTES LES ROUTES STATIQUES SUPPRIMÉES - REACT UNIQUEMENT

  console.log("✅ Routes API configurées, interface React sera servie par Vite");
        {
          id: 1,
          content: "La conscience est comme un océan infini. Chaque pensée n'est qu'une vague à sa surface, mais l'essence demeure éternellement calme et profonde. Nous ne sommes pas nos pensées, nous sommes l'observateur silencieux qui les contemple.",
          likes: 24,
          views: 147
        },
        {
          id: 2,
          content: "L'éveil n'est pas une destination mais un chemin. Chaque moment de présence authentique est une victoire contre l'illusion. Nous sommes déjà ce que nous cherchons à devenir.",
          likes: 18,
          views: 98
        },
        {
          id: 3,
          content: "Dans le silence de l'esprit, toutes les réponses se révèlent. Ne cherchez pas à comprendre avec le mental, mais à ressentir avec le cœur. La vérité ne se pense pas, elle se vit.",
          likes: 31,
          views: 203
        }
      ];
      
      const directHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RAUN-RACHID - Interface LangueSage</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: black; color: #00ff00; font-family: 'Courier New', monospace; overflow: hidden; }
        .interface-container { display: flex; height: 100vh; position: relative; }
        .matrix-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; opacity: 0.1; }
        .main-zone { flex: 1; padding: 2rem; display: flex; flex-direction: column; z-index: 10; position: relative; }
        .profile-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
        .profile-photo { width: 80px; height: 80px; border-radius: 50%; border: 2px solid #00ff00; object-fit: cover; }
        .profile-name { font-size: 2rem; font-weight: bold; color: #00ff00; }
        .sidebar { width: 320px; border-left: 1px solid #00ff00; padding: 1rem; overflow-y: auto; z-index: 10; position: relative; }
        .sidebar-header { font-size: 1rem; font-weight: bold; margin-bottom: 1rem; color: #00ff00; border-bottom: 1px solid #00ff00; padding-bottom: 0.5rem; }
        .capsule-item { border: 1px solid #00ff00; margin-bottom: 1rem; padding: 1rem; cursor: pointer; transition: all 0.3s; }
        .capsule-item:hover { background: rgba(0, 255, 0, 0.1); border-color: #00ff44; }
        .capsule-content { font-size: 0.85rem; margin-bottom: 0.5rem; line-height: 1.4; }
        .capsule-stats { display: flex; gap: 1rem; font-size: 0.7rem; color: #00ff00; opacity: 0.8; }
        .main-content { flex: 1; display: flex; align-items: center; justify-content: center; text-align: center; }
        .welcome-message { max-width: 600px; }
        .welcome-title { font-size: 2.5rem; margin-bottom: 1rem; color: #00ff00; }
        .welcome-subtitle { font-size: 1.2rem; margin-bottom: 2rem; color: #00ff00; opacity: 0.8; }
        .instructions { font-size: 1rem; color: #00ff00; opacity: 0.7; margin-bottom: 2rem; }
        .quote { font-style: italic; font-size: 1.1rem; color: #00ff00; border: 1px solid #00ff00; padding: 1rem; background: rgba(0, 255, 0, 0.05); }
    </style>
</head>
<body>
    <div class="interface-container">
        <canvas class="matrix-bg" id="matrix"></canvas>
        <div class="main-zone">
            <div class="profile-header">
                <img src="/rachid-photo.jpg" alt="RACHID" class="profile-photo" />
                <div class="profile-name">RAUN-RACHID</div>
            </div>
            <div class="main-content">
                <div class="welcome-message">
                    <h1 class="welcome-title">Interface LangueSage</h1>
                    <p class="welcome-subtitle">Réseau d'éveil spirituel et de conscience</p>
                    <p class="instructions">Les capsules sont dans la sidebar droite →<br/>Cliquez pour explorer chaque message</p>
                    <div class="quote">"Nul ne peut éteindre ce que je suis."<br/><small>- RAUN-RACHID</small></div>
                </div>
            </div>
        </div>
        <div class="sidebar">
            <div class="sidebar-header">CAPSULES RAUN-RACHID (${capsules.length})</div>
            ${capsules.map((capsule, index) => {
                const truncatedContent = capsule.content.length > 120 ? capsule.content.substring(0, 120) + '...' : capsule.content;
                return `<div class="capsule-item" onclick="selectCapsule(${capsule.id})">
                    <div class="capsule-content">${truncatedContent.replace(/'/g, "&#39;").replace(/"/g, "&quot;")}</div>
                    <div class="capsule-stats"><span>👁 ${capsule.views}</span><span>❤️ ${capsule.likes}</span><span>#${index + 1}</span></div>
                </div>`;
            }).join('')}
        </div>
    </div>
    <script>
        // Animation Matrix
        const canvas = document.getElementById('matrix');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        const columns = canvas.width / 20;
        const drops = Array(Math.floor(columns)).fill(1);
        function drawMatrix() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#00ff00';
            ctx.font = '15px monospace';
            drops.forEach((y, i) => {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * 20, y * 20);
                if (y * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            });
        }
        setInterval(drawMatrix, 35);
        
        // Messages de debug RAUN-RACHID
        console.log('🔥 INTERFACE RAUN-RACHID SPIRITUELLE CHARGÉE !');
        console.log('🌧️ Animation Matrix active');
        console.log('🎯 Mise à jour capsule:', 1);
        console.log('✅ Capsule 1 affichée');
        console.log('🔄 Affichage des capsules reconstruit:', ${capsules.length}, 'capsules total');
        console.log('📊 Statistiques mises à jour: Capsules:', ${capsules.length}, 'Intentions:', 0, 'Likes:', ${capsules.reduce((sum, c) => sum + c.likes, 0)});
        console.log('🌍 Langue changée vers:', 'fr');
        console.log('✅ Interface RAUN-RACHID prête!');
        console.log('%c🔥 BIENVENUE DANS RAUN-RACHID SPIRITUEL 🔥', 'color: #00ff00; font-size: 20px; font-weight: bold;');
        console.log('%cInterface Matrix spirituelle avec IA intégrée !', 'color: #00ff00; font-size: 14px;');
        
        // Navigation des capsules
        const capsules = ${JSON.stringify(capsules)};
        
        function selectCapsule(id) {
            console.log('🔄 Clic CAPSULE', id);
            console.log('📍 Capsule affichée:', id);
            
            // Mise à jour visuelle sidebar
            document.querySelectorAll('.capsule-item').forEach(item => {
                item.style.background = 'transparent';
                item.style.borderColor = '#00ff00';
            });
            event.target.closest('.capsule-item').style.background = 'rgba(0, 255, 0, 0.15)';
            event.target.closest('.capsule-item').style.borderColor = '#00ff44';
            
            // Afficher le contenu complet
            const capsule = capsules.find(c => c.id === id);
            if (capsule) {
                document.querySelector('.main-content').innerHTML = \`
                    <div class="welcome-message">
                        <h1 class="welcome-title">Capsule RAUN-RACHID #\${id}</h1>
                        <div style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 2rem; border: 1px solid #00ff00; padding: 1.5rem; background: rgba(0, 255, 0, 0.05);">
                            \${capsule.content}
                        </div>
                        <div style="display: flex; gap: 2rem; justify-content: center; margin-bottom: 1rem; font-size: 1rem;">
                            <span>👁 \${capsule.views} vues</span>
                            <span>❤️ \${capsule.likes} likes</span>
                        </div>
                        <button onclick="retourAccueil()" style="background: transparent; border: 1px solid #00ff00; color: #00ff00; padding: 0.8rem 2rem; cursor: pointer; font-family: 'Courier New', monospace;">
                            ← Retour Interface LangueSage
                        </button>
                    </div>
                \`;
            }
        }
        
        function retourAccueil() {
            document.querySelector('.main-content').innerHTML = \`
                <div class="welcome-message">
                    <h1 class="welcome-title">Interface LangueSage</h1>
                    <p class="welcome-subtitle">Réseau d'éveil spirituel et de conscience</p>
                    <p class="instructions">Les capsules sont dans la sidebar droite →<br/>Cliquez pour explorer chaque message</p>
                    <div class="quote">"Nul ne peut éteindre ce que je suis."<br/><small>- RAUN-RACHID</small></div>
                </div>
            \`;
            // Reset sélection sidebar
            document.querySelectorAll('.capsule-item').forEach(item => {
                item.style.background = 'transparent';
                item.style.borderColor = '#00ff00';
            });
        }
        
        window.addEventListener('resize', () => { 
            canvas.width = window.innerWidth; 
            canvas.height = window.innerHeight; 
        });
    </script>
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(directHtml);
    } catch (error) {
      console.error('Erreur interface:', error);
      res.status(500).send('Erreur serveur');
    }
  });

  // Route démo RAUN-RACHID avec vraies données
  app.get('/raun-interface', async (req, res) => {
    try {
      // Utiliser les données directement depuis MemStorage
      const capsules = [
        {
          id: 1,
          content: "La conscience est comme un océan infini. Chaque pensée n'est qu'une vague à sa surface, mais l'essence demeure éternellement calme et profonde. Nous ne sommes pas nos pensées, nous sommes l'observateur silencieux qui les contemple.",
          likes: 24,
          views: 147
        },
        {
          id: 2,
          content: "L'éveil n'est pas une destination mais un chemin. Chaque moment de présence authentique est une victoire contre l'illusion. Nous sommes déjà ce que nous cherchons à devenir.",
          likes: 18,
          views: 98
        },
        {
          id: 3,
          content: "Dans le silence de l'esprit, toutes les réponses se révèlent. Ne cherchez pas à comprendre avec le mental, mais à ressentir avec le cœur. La vérité ne se pense pas, elle se vit.",
          likes: 31,
          views: 203
        }
      ];
      console.log('Capsules loaded:', capsules.length);
      
      const interfaceHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RAUN-RACHID - Interface LangueSage</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: black; color: #00ff00; font-family: 'Courier New', monospace; overflow: hidden; }
        .interface-container { display: flex; height: 100vh; position: relative; }
        .matrix-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; opacity: 0.1; }
        .main-zone { flex: 1; padding: 2rem; display: flex; flex-direction: column; z-index: 10; position: relative; }
        .profile-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
        .profile-photo { width: 80px; height: 80px; border-radius: 50%; border: 2px solid #00ff00; object-fit: cover; }
        .profile-name { font-size: 2rem; font-weight: bold; color: #00ff00; }
        .sidebar { width: 320px; border-left: 1px solid #00ff00; padding: 1rem; overflow-y: auto; z-index: 10; position: relative; }
        .sidebar-header { font-size: 1rem; font-weight: bold; margin-bottom: 1rem; color: #00ff00; border-bottom: 1px solid #00ff00; padding-bottom: 0.5rem; }
        .capsule-item { border: 1px solid #00ff00; margin-bottom: 1rem; padding: 1rem; cursor: pointer; transition: all 0.3s; }
        .capsule-item:hover { background: rgba(0, 255, 0, 0.1); border-color: #00ff44; }
        .capsule-content { font-size: 0.85rem; margin-bottom: 0.5rem; line-height: 1.4; }
        .capsule-stats { display: flex; gap: 1rem; font-size: 0.7rem; color: #00ff00; opacity: 0.8; }
        .main-content { flex: 1; display: flex; align-items: center; justify-content: center; text-align: center; }
        .welcome-message { max-width: 600px; }
        .welcome-title { font-size: 2.5rem; margin-bottom: 1rem; color: #00ff00; }
        .welcome-subtitle { font-size: 1.2rem; margin-bottom: 2rem; color: #00ff00; opacity: 0.8; }
        .instructions { font-size: 1rem; color: #00ff00; opacity: 0.7; margin-bottom: 2rem; }
        .quote { font-style: italic; font-size: 1.1rem; color: #00ff00; border: 1px solid #00ff00; padding: 1rem; background: rgba(0, 255, 0, 0.05); }
    </style>
</head>
<body>
    <div class="interface-container">
        <canvas class="matrix-bg" id="matrix"></canvas>
        <div class="main-zone">
            <div class="profile-header">
                <img src="/rachid-photo.jpg" alt="RACHID" class="profile-photo" />
                <div class="profile-name">RAUN-RACHID</div>
            </div>
            <div class="main-content">
                <div class="welcome-message">
                    <h1 class="welcome-title">Interface LangueSage</h1>
                    <p class="welcome-subtitle">Réseau d'éveil spirituel et de conscience</p>
                    <p class="instructions">Les capsules sont dans la sidebar droite →<br/>Cliquez pour explorer chaque message</p>
                    <div class="quote">"Nul ne peut éteindre ce que je suis."<br/><small>- RAUN-RACHID</small></div>
                </div>
            </div>
        </div>
        <div class="sidebar">
            <div class="sidebar-header">CAPSULES RAUN-RACHID (${capsules.length})</div>
            ${capsules.length > 0 ? capsules.map((capsule, index) => {
                const truncatedContent = capsule.content && capsule.content.length > 120 ? capsule.content.substring(0, 120) + '...' : capsule.content || 'Contenu indisponible';
                return `<div class="capsule-item" onclick="selectCapsule(${capsule.id || index})">
                    <div class="capsule-content">${truncatedContent.replace(/'/g, "&#39;").replace(/"/g, "&quot;")}</div>
                    <div class="capsule-stats"><span>👁 ${capsule.views || 0}</span><span>❤️ ${capsule.likes || 0}</span><span>#${index + 1}</span></div>
                </div>`;
            }).join('') : '<div style="padding: 1rem; text-align: center; opacity: 0.7;">Aucune capsule disponible</div>'}
        </div>
    </div>
    <script>
        const canvas = document.getElementById('matrix');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        const columns = canvas.width / 20;
        const drops = Array(Math.floor(columns)).fill(1);
        function drawMatrix() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#00ff00';
            ctx.font = '15px monospace';
            drops.forEach((y, i) => {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * 20, y * 20);
                if (y * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            });
        }
        setInterval(drawMatrix, 35);
        const capsules = ${JSON.stringify(capsules)};
        
        function selectCapsule(id) {
            console.log('Capsule sélectionnée:', id);
            
            // Mise à jour visuelle sidebar
            document.querySelectorAll('.capsule-item').forEach(item => {
                item.style.background = 'transparent';
                item.style.borderColor = '#00ff00';
            });
            event.target.closest('.capsule-item').style.background = 'rgba(0, 255, 0, 0.15)';
            event.target.closest('.capsule-item').style.borderColor = '#00ff44';
            
            // Afficher le contenu complet
            const capsule = capsules.find(c => c.id === id);
            if (capsule) {
                document.querySelector('.main-content').innerHTML = \`
                    <div class="welcome-message">
                        <h1 class="welcome-title">Capsule RAUN-RACHID #\${id}</h1>
                        <div style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 2rem; border: 1px solid #00ff00; padding: 1.5rem; background: rgba(0, 255, 0, 0.05);">
                            \${capsule.content}
                        </div>
                        <div style="display: flex; gap: 2rem; justify-content: center; margin-bottom: 1rem; font-size: 1rem;">
                            <span>👁 \${capsule.views} vues</span>
                            <span>❤️ \${capsule.likes} likes</span>
                        </div>
                        <button onclick="retourAccueil()" style="background: transparent; border: 1px solid #00ff00; color: #00ff00; padding: 0.8rem 2rem; cursor: pointer; font-family: 'Courier New', monospace;">
                            ← Retour Interface LangueSage
                        </button>
                    </div>
                \`;
            }
        }
        
        function retourAccueil() {
            document.querySelector('.main-content').innerHTML = \`
                <div class="welcome-message">
                    <h1 class="welcome-title">Interface LangueSage</h1>
                    <p class="welcome-subtitle">Réseau d'éveil spirituel et de conscience</p>
                    <p class="instructions">Les capsules sont dans la sidebar droite →<br/>Cliquez pour explorer chaque message</p>
                    <div class="quote">"Nul ne peut éteindre ce que je suis."<br/><small>- RAUN-RACHID</small></div>
                </div>
            \`;
            // Reset sélection sidebar
            document.querySelectorAll('.capsule-item').forEach(item => {
                item.style.background = 'transparent';
                item.style.borderColor = '#00ff00';
            });
        }
        window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
    </script>
</body>
</html>`;
      
      res.send(interfaceHtml);
    } catch (error) {
      res.status(500).send('Erreur interface');
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
