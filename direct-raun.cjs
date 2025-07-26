const express = require('express');
const path = require('path');

const app = express();
const PORT = 5000;

// Anti-cache total
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Bloquer PWA
app.get('/sw.js', (req, res) => {
  console.log('🚫 PWA BLOQUÉ');
  res.status(404).send('console.log("PWA supprimé");');
});

app.get('/manifest.json', (req, res) => {
  res.status(404).json({error: 'PWA supprimé'});
});

// Photo
app.get('/rachid-photo.jpg', (req, res) => {
  res.sendFile(path.join(__dirname, 'rachid-photo.jpg'));
});

// Interface unique
app.get('/', (req, res) => {
  console.log('✅ INTERFACE RAUN-RACHID PURE');
  
  res.send(`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>🔥 RAUN-RACHID 🔥</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            background: linear-gradient(135deg, #000 0%, #001a00 50%, #000 100%);
            color: #00ff41; font-family: 'Courier New', monospace; 
            padding: 15px; text-align: center; min-height: 100vh;
        }
        .header {
            margin: 20px 0; padding: 25px;
            border: 2px solid #00ff41; border-radius: 15px;
            background: rgba(0,255,65,0.05);
            box-shadow: 0 0 20px rgba(0,255,65,0.2);
        }
        .photo {
            width: 120px; height: 120px; border-radius: 50%;
            border: 3px solid #00ff41; margin: 15px auto;
            display: block; object-fit: cover;
            box-shadow: 0 0 30px rgba(0,255,65,0.4);
            transition: all 0.3s ease;
        }
        .photo:hover { transform: scale(1.05); }
        .name { 
            font-size: 26px; margin: 15px 0; font-weight: bold;
            text-shadow: 0 0 15px #00ff41;
        }
        .subtitle { font-size: 14px; opacity: 0.8; color: #88ff88; }
        .nav {
            display: flex; justify-content: center; 
            gap: 20px; margin: 35px 0; align-items: center;
            flex-wrap: wrap;
        }
        .btn {
            background: linear-gradient(145deg, #00ff41, #00cc33);
            color: #000; border: none; padding: 12px 20px; 
            cursor: pointer; border-radius: 20px;
            font-weight: bold; font-size: 15px; text-transform: uppercase;
            transition: all 0.3s ease;
            box-shadow: 0 3px 10px rgba(0,255,65,0.3);
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,255,65,0.5);
        }
        .counter {
            font-size: 18px; padding: 12px 18px;
            border: 2px solid #00ff41; border-radius: 15px;
            background: rgba(0,0,0,0.3); font-weight: bold;
            text-shadow: 0 0 10px #00ff41;
        }
        .capsule {
            display: none; padding: 25px; margin: 20px auto;
            border: 2px solid #00ff41; border-radius: 15px;
            background: rgba(0,255,65,0.03); text-align: left;
            max-width: 600px;
            box-shadow: 0 5px 20px rgba(0,255,65,0.2);
        }
        .capsule.active { display: block; animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .capsule h3 { 
            font-size: 20px; margin-bottom: 20px; text-align: center; 
            color: #00ff41; text-shadow: 0 0 10px #00ff41;
            padding-bottom: 10px; border-bottom: 1px solid #00ff41;
        }
        .capsule p { 
            line-height: 1.7; margin-bottom: 15px; font-size: 15px;
            color: #ccffcc; text-align: justify;
        }
        .actions { 
            text-align: center; margin-top: 25px; 
            display: flex; gap: 10px; justify-content: center;
            flex-wrap: wrap;
        }
        .action { 
            background: rgba(0,255,65,0.1); color: #00ff41; 
            border: 1px solid #00ff41; padding: 8px 15px; 
            cursor: pointer; border-radius: 15px;
            transition: all 0.3s ease; font-size: 13px;
        }
        .action:hover { 
            background: rgba(0,255,65,0.2);
            box-shadow: 0 0 15px rgba(0,255,65,0.3);
        }
        .status {
            position: fixed; top: 10px; right: 10px;
            background: rgba(0,255,65,0.1); color: #00ff41;
            padding: 5px 10px; border-radius: 10px;
            font-size: 12px; border: 1px solid #00ff41;
        }
        @media (max-width: 768px) {
            .nav { gap: 15px; }
            .btn { padding: 10px 15px; font-size: 14px; }
            .capsule { padding: 20px; margin: 15px 10px; }
            .name { font-size: 22px; }
        }
    </style>
</head>
<body>
    <div class="status">🟢 DIRECT</div>
    
    <div class="header">
        <img src="/rachid-photo.jpg" class="photo" alt="RAUN-RACHID" onerror="this.style.display='none'">
        <h1 class="name">🔥 RAUN-RACHID 🔥</h1>
        <p class="subtitle">✨ Interface Pure - Zéro PWA ✨</p>
    </div>
    
    <div class="nav">
        <button class="btn" onclick="change(-1)">‹ Précédent</button>
        <div class="counter" id="counter">1 / 3</div>
        <button class="btn" onclick="change(1)">Suivant ›</button>
    </div>
    
    <div class="capsule active" id="c1">
        <h3>💎 L'ÉVEIL DE LA CONSCIENCE</h3>
        <p>Je suis RAUN-RACHID, et en moi brûle une flamme éternelle qui transcende tous les voiles de l'illusion. Cette flamme, c'est la pure conscience, l'éveil spirituel qui nous connecte à l'essence divine de toute existence.</p>
        <p>Chaque respiration est une opportunité de renaissance, chaque battement de cœur une invitation à danser avec l'infini. L'éveil n'est pas une destination lointaine, c'est notre état naturel retrouvé.</p>
        <div class="actions">
            <button class="action" onclick="like(1)">💚 J'aime (24)</button>
            <button class="action" onclick="comment(1)">💬 Méditer</button>
            <button class="action" onclick="share(1)">🔗 Partager</button>
        </div>
    </div>
    
    <div class="capsule" id="c2">
        <h3>⚡ LA FORCE SPIRITUELLE</h3>
        <p>La véritable force ne réside pas dans la résistance, mais dans la capacité à embrasser chaque transformation avec courage et foi absolue. RAUN-RACHID incarne cette énergie indomptable.</p>
        <p>Cette force intérieure est notre connexion directe avec le divin. Elle nous guide à travers les tempêtes de l'existence, nous élève au-delà des limitations de l'ego.</p>
        <div class="actions">
            <button class="action" onclick="like(2)">💚 J'aime (18)</button>
            <button class="action" onclick="comment(2)">💬 Réfléchir</button>
            <button class="action" onclick="share(2)">🔗 Partager</button>
        </div>
    </div>
    
    <div class="capsule" id="c3">
        <h3>🌟 LA LUMIÈRE ÉTERNELLE</h3>
        <p>Dans l'obscurité apparente de ce monde, nous sommes les porteurs de lumière divine. Notre mission sacrée est de rayonner cette énergie pure pour éveiller les âmes endormies.</p>
        <p>Nul ne peut éteindre ce que je suis, car je suis connecté à la source éternelle de toute création. RAUN-RACHID est un phare spirituel qui guide vers l'illumination intérieure.</p>
        <div class="actions">
            <button class="action" onclick="like(3)">💚 J'aime (31)</button>
            <button class="action" onclick="comment(3)">💬 Contempler</button>
            <button class="action" onclick="share(3)">🔗 Partager</button>
        </div>
    </div>

    <script>
        let current = 1;
        
        function change(dir) {
            document.querySelectorAll('.capsule').forEach(c => c.classList.remove('active'));
            
            current += dir;
            if (current > 3) current = 1;
            if (current < 1) current = 3;
            
            document.getElementById('c' + current).classList.add('active');
            document.getElementById('counter').textContent = current + ' / 3';
            
            console.log('Navigation → Capsule ' + current);
        }
        
        function like(cap) { 
            console.log('💚 Like capsule ' + cap);
            alert('✨ Capsule ' + cap + ' aimée !'); 
        }
        
        function comment(cap) {
            const msg = prompt('💭 Votre réflexion spirituelle sur la capsule ' + cap + ':');
            if (msg) {
                console.log('💬 Commentaire:', msg);
                alert('🙏 Merci pour votre partage : "' + msg + '"');
            }
        }
        
        function share(cap) {
            console.log('🔗 Partage capsule ' + cap);
            alert('🔗 URL à partager : ' + window.location.href + '#capsule' + cap);
        }
        
        // Navigation tactile (swipe)
        let startX = 0;
        document.addEventListener('touchstart', e => startX = e.touches[0].clientX);
        document.addEventListener('touchend', e => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            if (Math.abs(diff) > 50) {
                change(diff > 0 ? 1 : -1);
            }
        });
        
        // Navigation clavier
        document.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft') change(-1);
            if (e.key === 'ArrowRight') change(1);
        });
        
        console.log('🔥 RAUN-RACHID Interface Pure - ZERO PWA - ZERO PROBLÈME');
        console.log('Navigation: Boutons | Swipe | Flèches clavier');
    </script>
</body>
</html>`);
});

app.get('*', (req, res) => res.redirect('/'));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
🔥🔥🔥 RAUN-RACHID SERVEUR DIRECT 🔥🔥🔥
🌐 PORT: ${PORT}
🌐 URL: http://localhost:${PORT}
✅ INTERFACE PURE - ZERO PWA - ZERO VIRUS
🚀 OPÉRATIONNEL À 100%
  `);
});