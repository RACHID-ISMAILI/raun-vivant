// Script de démarrage direct pour contourner les problèmes Replit
const express = require('express');
const app = express();

app.use(express.static('.'));
app.use(express.static('public'));

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 RAUN-RACHID INTERFACE ACTIVE PORT ${PORT}`);
});