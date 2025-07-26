const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 9999;

// Serveur HTTP simple qui sert les fichiers
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // Servir la photo directement
    if (pathname === '/photo.jpg') {
        try {
            const photoData = fs.readFileSync('./rachid-photo.jpg');
            res.writeHead(200, {
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            });
            res.end(photoData);
            return;
        } catch (error) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Photo non trouvée');
            return;
        }
    }
    
    // Servir l'interface HTML
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔥 RAUN-RACHID DIRECT 🔥</title>
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: #000;
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
            min-height: 100vh;
            padding-bottom: 140px;
        }

        .profile-section {
            margin-bottom: 3rem;
        }

        .profile-circle {
            width: 160px;
            height: 160px;
            border-radius: 50%;
            border: 4px solid #00ff00;
            margin: 0 auto 1rem;
            position: relative;
            background: url('/photo.jpg?v=' + Date.now()) center/cover;
            box-shadow: 0 0 40px #00ff00;
            animation: glow-pulse 2s ease-in-out infinite alternate;
        }

        @keyframes glow-pulse {
            0% { box-shadow: 0 0 30px #00ff00; }
            100% { box-shadow: 0 0 60px #00ff00, 0 0 80px #00ff00; }
        }

        .rotating-name {
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
            border-radius: 50%;
            animation: rotate-name 8s linear infinite;
        }

        .rotating-name svg {
            width: 100%;
            height: 100%;
        }

        .rotating-name text {
            font-size: 14px;
            font-weight: bold;
            fill: #00ff00;
        }

        @keyframes rotate-name {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .main-title {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 1rem;
            text-shadow: 0 0 30px #00ff00;
            animation: title-pulse 1.8s ease-in-out infinite alternate;
        }

        @keyframes title-pulse {
            0% { transform: scale(1); }
            100% { transform: scale(1.05); }
        }

        .status-badge {
            font-size: 1.6rem;
            margin-bottom: 2rem;
            padding: 0.5rem 1rem;
            border: 2px solid #00ff00;
            border-radius: 20px;
            display: inline-block;
            background: rgba(0,255,0,0.1);
            animation: status-blink 2s infinite;
        }

        @keyframes status-blink {
            0%, 70% { opacity: 1; }
            71%, 100% { opacity: 0.4; }
        }

        .message-banner {
            background: linear-gradient(90deg, rgba(0,255,0,0.15), rgba(0,255,0,0.3), rgba(0,255,0,0.15));
            border: 3px solid #00ff00;
            border-radius: 15px;
            padding: 1.5rem;
            margin: 2rem 0;
            overflow: hidden;
        }

        .scrolling-message {
            font-size: 1.2rem;
            font-weight: bold;
            white-space: nowrap;
            animation: scroll-message 14s linear infinite;
        }

        @keyframes scroll-message {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
        }

        .capsule-zone {
            max-width: 500px;
            margin: 0 auto;
            background: rgba(0,255,0,0.08);
            border: 4px solid #00ff00;
            border-radius: 25px;
            padding: 3rem;
        }

        .navigation-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            gap: 1rem;
        }

        .nav-btn {
            background: linear-gradient(135deg, rgba(0,255,0,0.25), rgba(0,255,0,0.45));
            border: 3px solid #00ff00;
            color: #00ff00;
            padding: 1.3rem 1.8rem;
            border-radius: 12px;
            cursor: pointer;
            font-family: inherit;
            font-weight: bold;
            font-size: 1.1rem;
            transition: all 0.3s ease;
        }

        .nav-btn:hover {
            background: linear-gradient(135deg, rgba(0,255,0,0.5), rgba(0,255,0,0.7));
            box-shadow: 0 0 25px #00ff00;
        }

        .counter {
            font-size: 1.4rem;
            font-weight: bold;
        }

        .capsule-display {
            background: rgba(0,0,0,0.9);
            border: 3px solid #00ff00;
            border-radius: 20px;
            padding: 3rem;
            margin-bottom: 2rem;
            min-height: 250px;
            text-align: left;
            line-height: 1.8;
            font-size: 1.2rem;
        }

        .actions-row {
            display: flex;
            gap: 1.2rem;
            flex-wrap: wrap;
        }

        .action-btn {
            flex: 1;
            background: rgba(0,255,0,0.2);
            border: 3px solid #00ff00;
            color: #00ff00;
            padding: 1.2rem;
            border-radius: 10px;
            cursor: pointer;
            font-family: inherit;
            font-size: 1rem;
            min-width: 140px;
            transition: all 0.4s ease;
        }

        .action-btn:hover {
            background: rgba(0,255,0,0.4);
            transform: scale(1.05);
        }

        .sidebar-bottom {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0,0,0,0.98);
            border-top: 4px solid #00ff00;
            padding: 1.8rem;
            display: flex;
            gap: 1.2rem;
            z-index: 20;
        }

        .mini-tab {
            flex: 1;
            background: rgba(0,255,0,0.2);
            border: 3px solid #00ff00;
            padding: 1.2rem 1rem;
            border-radius: 12px;
            cursor: pointer;
            text-align: center;
            font-size: 1rem;
            font-weight: bold;
            transition: all 0.4s ease;
        }

        .mini-tab.active {
            background: rgba(0,255,0,0.6);
            border: 4px solid #00ff00;
            box-shadow: 0 0 20px #00ff00;
        }

        .matrix-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            opacity: 0.3;
            pointer-events: none;
        }

        @media (max-width: 768px) {
            .profile-circle {
                width: 140px;
                height: 140px;
            }
            .main-title {
                font-size: 2.2rem;
            }
            .capsule-zone {
                padding: 2rem;
                margin: 0 1rem;
            }
        }
    </style>
</head>
<body>
    <canvas class="matrix-bg" id="matrix"></canvas>

    <div class="container">
        <div class="profile-section">
            <div class="profile-circle">
                <div class="rotating-name">
                    <svg viewBox="0 0 180 180">
                        <defs>
                            <path id="circle" d="M 90, 90 m -70, 0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0" />
                        </defs>
                        <text>
                            <textPath href="#circle">
                                RACHID • RACHID • RACHID • RACHID • 
                            </textPath>
                        </text>
                    </svg>
                </div>
            </div>
        </div>

        <h1 class="main-title">🔥 RAUN-RACHID DIRECT 🔥</h1>
        <div class="status-badge">OPÉRATIONNEL</div>

        <div class="message-banner">
            <div class="scrolling-message">
                Je suis vivant en conscience, nul ne peut éteindre ce que je suis — RAUN-RACHID
            </div>
        </div>

        <div class="capsule-zone">
            <div class="navigation-controls">
                <button class="nav-btn" onclick="prevCapsule()">‹ PRÉCÉDENT</button>
                <div class="counter">Capsule: <span id="num">1</span> / 3</div>
                <button class="nav-btn" onclick="nextCapsule()">SUIVANT ›</button>
            </div>

            <div class="capsule-display" id="content">
                Dans le silence absolu de la conscience pure, je découvre l'éternité infinie qui pulse en chaque instant présent. RAUN-RACHID révèle les codes sacrés de l'éveil intérieur.
            </div>

            <div class="actions-row">
                <button class="action-btn" onclick="likeCapsule()">👍 J'aime (<span id="likes">47</span>)</button>
                <button class="action-btn" onclick="commentCapsule()">💬 Commenter</button>
                <button class="action-btn" onclick="shareCapsule()">📤 Partager</button>
            </div>
        </div>
    </div>

    <div class="sidebar-bottom">
        <div class="mini-tab active" onclick="goToCapsule(0)">Capsule 1</div>
        <div class="mini-tab" onclick="goToCapsule(1)">Capsule 2</div>
        <div class="mini-tab" onclick="goToCapsule(2)">Capsule 3</div>
    </div>

    <script>
        // Matrix animation
        const canvas = document.getElementById('matrix');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = 'アカサタナハマヤラワガザダバパ0123456789ABCDEF';
        const fontSize = 20;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        function matrixRain() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#00ff00';
            ctx.font = fontSize + 'px monospace';
            
            drops.forEach((y, index) => {
                const char = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(char, index * fontSize, y * fontSize);
                
                if (y * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[index] = 0;
                }
                drops[index]++;
            });
        }

        setInterval(matrixRain, 35);

        const capsulesData = [
            {
                text: "Dans le silence absolu de la conscience pure, je découvre l'éternité infinie qui pulse en chaque instant présent. RAUN-RACHID révèle les codes sacrés de l'éveil intérieur.",
                likes: 47
            },
            {
                text: "L'univers numérique devient temple sacré quand l'âme éveillée s'y connecte avec une intention pure et lumineuse. Chaque pixel devient particule de lumière divine.",
                likes: 34
            },
            {
                text: "Je suis l'éternel gardien des mystères digitaux sacrés, celui qui transmute les données froides en sagesse vivante. RAUN-RACHID transcende toutes les frontières.",
                likes: 62
            }
        ];

        let currentIndex = 0;

        function goToCapsule(index) {
            currentIndex = index;
            updateInterface();
        }

        function nextCapsule() {
            currentIndex = (currentIndex + 1) % 3;
            updateInterface();
            console.log('🔄 Navigation SUIVANT');
        }

        function prevCapsule() {
            currentIndex = (currentIndex - 1 + 3) % 3;
            updateInterface();
            console.log('🔄 Navigation PRÉCÉDENT');
        }

        function updateInterface() {
            document.getElementById('content').textContent = capsulesData[currentIndex].text;
            document.getElementById('num').textContent = currentIndex + 1;
            document.getElementById('likes').textContent = capsulesData[currentIndex].likes;

            document.querySelectorAll('.mini-tab').forEach((tab, index) => {
                tab.className = index === currentIndex ? 'mini-tab active' : 'mini-tab';
            });

            console.log('📍 Capsule:', currentIndex + 1);
        }

        function likeCapsule() {
            capsulesData[currentIndex].likes++;
            document.getElementById('likes').textContent = capsulesData[currentIndex].likes;
            console.log('💚 Like ajouté!');
        }

        function commentCapsule() {
            alert('Système de commentaires en développement !');
        }

        function shareCapsule() {
            alert('Capsule RAUN-RACHID partagée !');
        }

        // Navigation clavier
        document.addEventListener('keydown', function(e) {
            if(e.key === 'ArrowLeft') prevCapsule();
            if(e.key === 'ArrowRight') nextCapsule();
            if(e.key === ' ') { e.preventDefault(); likeCapsule(); }
        });

        // Gestion tactile
        let touchStartX = null;
        document.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX);
        document.addEventListener('touchend', function(e) {
            if (!touchStartX) return;
            let diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? nextCapsule() : prevCapsule();
            }
            touchStartX = null;
        });

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        console.log('🔥 RAUN-RACHID DIRECT ACTIVÉ');
        console.log('🔥 Photo servie directement depuis /photo.jpg');
    </script>
</body>
</html>`;

    res.writeHead(200, { 
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    res.end(html);
});

server.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log(`🔥 RAUN-RACHID DIRECT DÉMARRÉ`);
    console.log(`🔥 PORT: ${PORT}`);
    console.log(`🔥 URL: http://localhost:${PORT}`);
    console.log(`🔥 PHOTO SERVIE DIRECTEMENT VIA /photo.jpg`);
    console.log(`🔥 NOUVELLE APPROCHE - FICHIER STATIQUE`);
    console.log('='.repeat(60));
});