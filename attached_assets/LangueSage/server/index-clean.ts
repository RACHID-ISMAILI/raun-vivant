import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();

// Configuration basique
app.use((req, res, next) => {
  console.log(`🔥 REQUÊTE REÇUE: ${req.method} ${req.url}`);
  next();
});

// Servir les fichiers statiques
app.use(express.static('.'));

// Route pour la photo de profil
app.get('/rachid-photo.jpg', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'rachid-photo.jpg'));
});

// Route pour l'icône SVG
app.get('/raun-icon.svg', (req, res) => {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.sendFile(path.join(process.cwd(), 'raun-icon.svg'));
});

// Route principale - Interface capsules RAUN-RACHID
app.get('/', (req, res) => {
  console.log('🔥 ROUTE: / - Interface CAPSULES RAUN-RACHID');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  try {
    const capsulesHtml = fs.readFileSync('./raun-capsules-clean.html', 'utf8');
    res.send(capsulesHtml);
    console.log('✅ Interface capsules servie avec succès');
  } catch (error) {
    console.error('❌ Erreur lecture fichier capsules:', error);
    res.status(500).send('Erreur serveur');
  }
});

// Route /raun - Interface capsules directe
app.get('/raun', (req, res) => {
  console.log('🔥 ROUTE: /raun - Interface CAPSULES directe');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  try {
    const capsulesHtml = fs.readFileSync('./raun-capsules-clean.html', 'utf8');
    res.send(capsulesHtml);
    console.log('✅ Interface capsules /raun servie avec succès');
  } catch (error) {
    console.error('❌ Erreur lecture fichier capsules /raun:', error);
    res.status(500).send('Erreur serveur');
  }
});

// Bloquer PWA
app.get('/sw.js', (req, res) => {
  console.log('🚫 REQUÊTE BLOQUÉE: /sw.js - PWA supprimé');
  res.status(404).send('PWA supprimé');
});

app.get('/manifest.json', (req, res) => {
  console.log('🚫 REQUÊTE BLOQUÉE: /manifest.json - PWA supprimé');
  res.status(404).send('PWA supprimé');
});

// Démarrage serveur
const port = parseInt(process.env.PORT || '5000', 10);
app.listen(port, "0.0.0.0", () => {
  console.log(`🔥 SERVEUR RAUN-RACHID CAPSULES DÉMARRÉ SUR PORT ${port}`);
  console.log(`🔥 URL: http://localhost:${port}`);
  console.log(`🔥 Interface CAPSULES STABLE: http://localhost:${port}`);
  console.log(`🔥 Navigation par flèches ‹ › opérationnelle`);
  console.log(`🔥 UNE CAPSULE À LA FOIS - Système simplifié`);
});