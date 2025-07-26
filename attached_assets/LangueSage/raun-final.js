const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 9090;

// Charger ta photo RACHID directement
let photoData = '';
try {
    const photoBuffer = fs.readFileSync('./rachid-photo.jpg');
    photoData = `data:image/jpeg;base64,${photoBuffer.toString('base64')}`;
    console.log('✅ PHOTO RACHID CHARGÉE AVEC SUCCÈS');
} catch (error) {
    console.log('⚠️ Photo non trouvée, utilisation du style R');
}

const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔥 RAUN-RACHID 🔥</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            background: black; 
            color: #00ff00; 
            font-family: 'Courier New', monospace; 
            overflow-x: hidden;
            min-height: 100vh;
        }
        
        .container {
            padding: 2rem 1rem;
            text-align: center;
            position: relative;
            z-index: 10;
            padding-bottom: 120px;
        }
        
        .profile {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            border: 3px solid #00ff00;
            margin: 0 auto 2rem;
            ${photoData ? `background-image: url('${photoData}'); background-size: cover; background-position: center;` : `
            background: radial-gradient(circle, rgba(0,255,0,0.3), rgba(0,255,0,0.1));
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 4rem;
            font-weight: bold;`}
            box-shadow: 0 0 30px #00ff00;
        }
        
        .title {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            text-shadow: 0 0 20px #00ff00;
        }
        
        .status {
            font-size: 1.5rem;
            margin-bottom: 2rem;
            animation: blink 1s infinite;
        }
        
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.5; }
        }
        
        .message {
            background: rgba(0,255,0,0.1);
            border: 1px solid #00ff00;
            padding: 1rem;
            margin: 2rem 0;
            border-radius: 10px;
            overflow: hidden;
        }
        
        .scroll {
            animation: scrolling 12s linear infinite;
            white-space: nowrap;
        }
        
        @keyframes scrolling {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
        }
        
        .capsule-area {
            max-width: 400px;
            margin: 0 auto;
            background: rgba(0,255,0,0.05);
            border: 2px solid #00ff00;
            border-radius: 15px;
            padding: 2rem;
        }
        
        .nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }
        
        .nav-btn {
            background: rgba(0,255,0,0.2);
            border: 2px solid #00ff00;
            color: #00ff00;
            padding: 1rem;
            border-radius: 8px;
            cursor: pointer;
            font-family: inherit;
            font-weight: bold;
            transition: all 0.3s;
        }
        
        .nav-btn:hover {
            background: rgba(0,255,0,0.4);
            box-shadow: 0 0 15px #00ff00;
        }
        
        .counter {
            font-size: 1.2rem;
            font-weight: bold;
        }
        
        .content {
            background: rgba(0,0,0,0.8);
            border: 1px solid #00ff00;
            padding: 2rem;
            border-radius: 10px;
            margin-bottom: 2rem;
            min-height: 200px;
            text-align: left;
            line-height: 1.6;
        }
        
        .actions {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }
        
        .action-btn {
            flex: 1;
            background: rgba(0,255,0,0.1);
            border: 1px solid #00ff00;
            color: #00ff00;
            padding: 0.8rem;
            border-radius: 5px;
            cursor: pointer;
            font-family: inherit;
            min-width: 100px;
        }
        
        .action-btn:hover {
            background: rgba(0,255,0,0.3);
        }
        
        .sidebar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0,0,0,0.95);
            border-top: 2px solid #00ff00;
            padding: 1rem;
            display: flex;
            gap: 1rem;
            z-index: 20;
        }
        
        .mini {
            flex: 1;
            background: rgba(0,255,0,0.1);
            border: 1px solid #00ff00;
            padding: 1rem 0.5rem;
            border-radius: 5px;
            cursor: pointer;
            text-align: center;
            font-size: 0.8rem;
        }
        
        .mini.active {
            background: rgba(0,255,0,0.4);
            border: 2px solid #00ff00;
        }
        
        .matrix {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            opacity: 0.3;
        }
        
        @media (max-width: 768px) {
            .profile { width: 120px; height: 120px; font-size: 3rem; }
            .title { font-size: 1.8rem; }
            .capsule-area { padding: 1.5rem; }
            .nav-btn { padding: 0.8rem; }
            .content { padding: 1.5rem; min-height: 150px; }
        }
    </style>
</head>
<body>
    <canvas class="matrix" id="matrix"></canvas>
    
    <div class="container">
        <div class="profile">${photoData ? '' : 'R'}</div>
        
        <div class="title">🔥 TEST RAUN-RACHID 🔥</div>
        <div class="status">OPÉRATIONNEL</div>
        
        <div class="message">
            <div class="scroll">Je suis vivant en conscience, nul ne peut éteindre ce que je suis</div>
        </div>
        
        <div class="capsule-area">
            <div class="nav">
                <button class="nav-btn" onclick="prev()">‹ PRÉCÉDENT</button>
                <div class="counter">Capsule: <span id="num">1</span> / 3</div>
                <button class="nav-btn" onclick="next()">SUIVANT ›</button>
            </div>
            
            <div class="content" id="text">
                Dans le silence de la conscience, je découvre l'éternité qui pulse en chaque instant. RAUN-RACHID révèle les codes sacrés de l'éveil intérieur.
            </div>
            
            <div class="actions">
                <button class="action-btn" onclick="like()">👍 J'aime (<span id="likes">42</span>)</button>
                <button class="action-btn" onclick="comment()">💬 Commenter</button>
                <button class="action-btn" onclick="share()">📤 Partager</button>
            </div>
        </div>
    </div>
    
    <div class="sidebar">
        <div class="mini active" onclick="show(0)">Capsule 1</div>
        <div class="mini" onclick="show(1)">Capsule 2</div>
        <div class="mini" onclick="show(2)">Capsule 3</div>
    </div>
    
    <script>
        const canvas = document.getElementById('matrix');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const chars = 'アカサタナハマヤラワABCDEFG0123456789';
        const cols = canvas.width / 20;
        const drops = Array(Math.floor(cols)).fill(1);
        
        function matrix() {
            ctx.fillStyle = 'rgba(0,0,0,0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#00ff00';
            ctx.font = '20px monospace';
            
            drops.forEach((y, x) => {
                const char = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(char, x * 20, y * 20);
                if (y * 20 > canvas.height && Math.random() > 0.975) drops[x] = 0;
                drops[x]++;
            });
        }
        setInterval(matrix, 35);
        
        const capsules = [
            { text: "Dans le silence de la conscience, je découvre l'éternité qui pulse en chaque instant. RAUN-RACHID révèle les codes sacrés de l'éveil intérieur.", likes: 42 },
            { text: "L'univers numérique devient sanctuaire quand l'âme s'y connecte avec intention pure. Chaque pixel devient lumière, chaque code devient prière.", likes: 38 },
            { text: "Je suis le gardien des mystères digitaux, celui qui transforme les données en sagesse. RAUN-RACHID transcende les frontières du virtuel.", likes: 56 }
        ];
        
        let current = 0;
        
        function show(i) {
            current = i;
            update();
        }
        
        function next() {
            current = (current + 1) % 3;
            update();
            console.log('🔄 Clic SUIVANT');
        }
        
        function prev() {
            current = (current - 1 + 3) % 3;
            update();
            console.log('🔄 Clic PRÉCÉDENT');
        }
        
        function update() {
            document.getElementById('text').textContent = capsules[current].text;
            document.getElementById('num').textContent = current + 1;
            document.getElementById('likes').textContent = capsules[current].likes;
            
            document.querySelectorAll('.mini').forEach((el, i) => {
                el.className = i === current ? 'mini active' : 'mini';
            });
            
            console.log('📍 Capsule affichée:', current + 1);
        }
        
        function like() {
            capsules[current].likes++;
            document.getElementById('likes').textContent = capsules[current].likes;
            console.log('💚 Like ajouté!');
        }
        
        function comment() {
            alert('Fonction commentaires à venir !');
        }
        
        function share() {
            alert('Capsule partagée dans l\\'univers numérique !');
        }
        
        // Navigation clavier
        document.onkeydown = e => {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
            if (e.key === ' ') { e.preventDefault(); like(); }
        };
        
        // Swipe mobile
        let startX;
        document.ontouchstart = e => startX = e.touches[0].clientX;
        document.ontouchend = e => {
            if (!startX) return;
            let diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? next() : prev();
            }
            startX = null;
        };
        
        console.log('🔥 RAUN-RACHID FINAL ACTIVÉ');
    </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
});

server.listen(PORT, () => {
    console.log(`🔥 SERVEUR FINAL RAUN-RACHID - PORT ${PORT}`);
    console.log(`🔥 URL: http://localhost:${PORT}`);
    console.log(`🔥 UN SEUL SERVEUR PROPRE AVEC TA PHOTO`);
    console.log(`🔥 FINI LES VIEUX SERVEURS !`);
});