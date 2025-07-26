const express = require('express');
const path = require('path');
const app = express();

// Middleware de logging
app.use((req, res, next) => {
  console.log(`🔥 REQUÊTE: ${req.method} ${req.url}`);
  next();
});

// Servir les fichiers statiques
app.use(express.static('.'));

// Route principale
app.get('/', (req, res) => {
  console.log('🔥 ROUTE PRINCIPALE - Capsules RAUN-RACHID');
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route /raun
app.get('/raun', (req, res) => {
  console.log('🔥 ROUTE /raun - Capsules RAUN-RACHID');
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Photo profil
app.get('/rachid-photo.jpg', (req, res) => {
  res.sendFile(path.join(__dirname, 'rachid-photo.jpg'));
});

// Bloquer PWA
app.get('/sw.js', (req, res) => {
  console.log('🚫 PWA bloqué: /sw.js');
  res.status(404).send('PWA désactivé');
});

app.get('/manifest.json', (req, res) => {
  console.log('🚫 PWA bloqué: /manifest.json');
  res.status(404).send('PWA désactivé');
});

// Démarrage
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('🔥 SERVEUR RAUN-RACHID DÉMARRÉ');
  console.log(`🔥 PORT: ${PORT}`);
  console.log('🔥 URL: http://localhost:' + PORT);
  console.log('🔥 CAPSULES avec navigation par flèches ‹ ›');
  console.log('🔥 UNE CAPSULE À LA FOIS');
  console.log('🔥 SYSTÈME RECONSTRUIT DE ZÉRO');
});