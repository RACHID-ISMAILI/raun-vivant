// SERVEUR RAUN-RACHID DIRECT
const { spawn } = require('child_process');

console.log('🔥 DÉMARRAGE SERVEUR RAUN-RACHID...');

// Lancer le serveur simple qui fonctionne
const serverProcess = spawn('node', ['server/simple-direct.js'], {
  stdio: 'inherit'
});

serverProcess.on('error', (err) => {
  console.error('Erreur serveur:', err);
});

process.on('SIGTERM', () => {
  serverProcess.kill();
});

process.on('SIGINT', () => {
  serverProcess.kill();
  process.exit();
});