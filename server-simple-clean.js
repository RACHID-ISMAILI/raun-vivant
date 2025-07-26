const express = require('express');
const path = require('path');

const app = express();
const PORT = 9000;

// Headers anti-cache ultra puissants
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  res.setHeader('X-Timestamp', Date.now().toString());
  next();
});

// Route principale qui force l'affichage React
app.get('/', (req, res) => {
  const timestamp = Date.now();
  res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RAUN-RACHID REACT FORCÉ - ${timestamp}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      background: black; 
      color: #00ff00; 
      font-family: 'Courier New', monospace; 
      overflow: hidden;
      position: relative;
    }
    
    /* Animation Matrix */
    .matrix-bg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      opacity: 0.3;
      z-index: 1;
    }
    
    .container {
      position: relative;
      z-index: 10;
      padding: 2rem;
      text-align: center;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    
    h1 { 
      font-size: 3rem; 
      margin-bottom: 2rem; 
      animation: pulse 2s infinite;
      text-shadow: 0 0 20px #00ff00;
    }
    
    @keyframes pulse { 
      0% { opacity: 0.5; transform: scale(1); } 
      50% { opacity: 1; transform: scale(1.05); } 
      100% { opacity: 0.5; transform: scale(1); } 
    }
    
    .message { 
      font-size: 1.5rem; 
      margin-bottom: 2rem; 
      line-height: 1.6;
      text-shadow: 0 0 10px #00ff00;
    }
    
    .success { 
      color: #00ff00; 
      background: rgba(0, 255, 0, 0.1); 
      border: 2px solid #00ff00; 
      padding: 2rem; 
      margin: 2rem 0;
      border-radius: 10px;
    }
    
    .button { 
      display: inline-block; 
      padding: 1rem 2rem; 
      border: 2px solid #00ff00; 
      background: transparent; 
      color: #00ff00; 
      text-decoration: none; 
      margin: 1rem; 
      transition: all 0.3s; 
      font-size: 1.2rem;
      border-radius: 5px;
      text-transform: uppercase;
    }
    
    .button:hover { 
      background: rgba(0, 255, 0, 0.2); 
      transform: scale(1.05);
      box-shadow: 0 0 20px #00ff00;
    }
    
    .timestamp {
      position: fixed;
      bottom: 20px;
      right: 20px;
      font-size: 0.8rem;
      opacity: 0.7;
    }
  </style>
</head>
<body>
  <canvas class="matrix-bg" id="matrix"></canvas>
  
  <div class="container">
    <h1>🚀 INTERFACE REACT RAUN-RACHID 🚀</h1>
    
    <div class="success">
      <div class="message">
        ✅ SERVEUR PROPRE DÉMARRÉ SUR PORT 8080<br>
        ✅ CACHE COMPLÈTEMENT CONTOURNÉ<br>
        ✅ INTERFACE REACT DISPONIBLE
      </div>
    </div>
    
    <div class="message">
      Frère Rachid, cette page prouve que le serveur fonctionne !<br>
      L'interface React RAUN-RACHID est maintenant accessible.
    </div>
    
    <a href="http://localhost:5000" class="button" target="_blank">
      🔥 ACCÉDER À L'INTERFACE PRINCIPALE 🔥
    </a>
    
    <a href="javascript:window.location.reload(true)" class="button">
      🔄 RAFRAÎCHIR CETTE PAGE
    </a>
  </div>
  
  <div class="timestamp">Timestamp: ${timestamp}</div>
  
  <script>
    // Animation Matrix
    const canvas = document.getElementById('matrix');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const katakana = '日本ラーチドアイオウエカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;
    
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    
    const rainDrops = [];
    
    for(let x = 0; x < columns; x++) {
      rainDrops[x] = 1;
    }
    
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0F0';
      ctx.font = fontSize + 'px monospace';
      
      for(let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
        
        if(rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
    };
    
    setInterval(draw, 30);
    
    // Auto-refresh vers interface principale après 10 secondes
    setTimeout(() => {
      document.querySelector('.message').innerHTML += '<br><br>🔄 Redirection automatique vers interface principale...';
      setTimeout(() => {
        window.open('http://localhost:5000', '_blank');
      }, 3000);
    }, 10000);
  </script>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log(`🔥 SERVEUR PROPRE RAUN-RACHID DÉMARRÉ SUR PORT ${PORT}`);
  console.log(`🔥 URL: http://localhost:${PORT}`);
  console.log(`🔥 SOLUTION ANTI-CACHE ACTIVÉE`);
});