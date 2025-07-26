const http = require('http');
const fs = require('fs');

const PORT = 8888;

// Charger ta photo RACHID
let photoBase64 = '';
try {
    const photoBuffer = fs.readFileSync('./rachid-photo.jpg');
    photoBase64 = photoBuffer.toString('base64');
    console.log('✅ Photo RACHID chargée avec succès!');
} catch (error) {
    console.log('⚠️ Photo non trouvée, utilisation du profil R');
}

const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔥 RAUN-RACHID STANDALONE 🔥</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: #000000;
            color: #00ff00;
            font-family: 'Courier New', monospace;
            overflow-x: hidden;
            min-height: 100vh;
        }

        .main-container {
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
            ${photoBase64 ? 
                `background: url('data:image/jpeg;base64,${photoBase64}') center/cover;` : 
                `background: radial-gradient(circle, rgba(0,255,0,0.4), rgba(0,255,0,0.1));
                 display: flex; align-items: center; justify-content: center;`
            }
            box-shadow: 0 0 40px #00ff00;
            animation: glow-pulse 2s ease-in-out infinite alternate;
        }

        ${!photoBase64 ? `
        .profile-circle::before {
            content: 'R';
            font-size: 4.5rem;
            font-weight: bold;
            color: #00ff00;
            text-shadow: 0 0 20px #00ff00;
        }
        ` : ''}

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
            text-shadow: 0 0 10px #00ff00;
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
            0% { transform: scale(1) rotate(0deg); }
            100% { transform: scale(1.05) rotate(1deg); }
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
            position: relative;
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
            box-shadow: inset 0 0 30px rgba(0,255,0,0.15);
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
            text-shadow: 0 0 10px #00ff00;
        }

        .nav-btn:hover, .nav-btn:active {
            background: linear-gradient(135deg, rgba(0,255,0,0.5), rgba(0,255,0,0.7));
            box-shadow: 0 0 25px #00ff00;
            transform: translateY(-3px) scale(1.05);
        }

        .counter {
            font-size: 1.4rem;
            font-weight: bold;
            text-shadow: 0 0 15px #00ff00;
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
            box-shadow: inset 0 0 20px rgba(0,255,0,0.15);
        }

        .actions-row {
            display: flex;
            gap: 1.2rem;
            flex-wrap: wrap;
            justify-content: center;
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
            text-shadow: 0 0 8px #00ff00;
        }

        .action-btn:hover, .action-btn:active {
            background: rgba(0,255,0,0.4);
            transform: scale(1.08) translateY(-2px);
            box-shadow: 0 0 20px rgba(0,255,0,0.6);
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
            backdrop-filter: blur(15px);
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
            transition: all 0.4s ease;
            font-weight: bold;
        }

        .mini-tab.active {
            background: rgba(0,255,0,0.6);
            border: 4px solid #00ff00;
            box-shadow: 0 0 20px #00ff00;
            transform: translateY(-5px);
        }

        .mini-tab:hover {
            background: rgba(0,255,0,0.35);
            transform: translateY(-2px);
        }

        .matrix-rain {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            opacity: 0.3;
            pointer-events: none;
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
            .profile-circle {
                width: 140px;
                height: 140px;
            }
            .profile-circle::before {
                font-size: 3.8rem;
            }
            .main-title {
                font-size: 2.2rem;
            }
            .capsule-zone {
                padding: 2.5rem 2rem;
                margin: 0 1rem;
            }
            .nav-btn {
                padding: 1.1rem 1.3rem;
                font-size: 1rem;
            }
            .capsule-display {
                padding: 2.5rem;
                min-height: 200px;
                font-size: 1.1rem;
            }
            .action-btn {
                min-width: 110px;
                padding: 1rem;
                font-size: 0.95rem;
            }
            .sidebar-bottom {
                padding: 1.5rem 1rem;
            }
            .mini-tab {
                padding: 1rem 0.8rem;
                font-size: 0.9rem;
            }
        }

        /* Effet coeur pour double-tap */
        @keyframes heart-fly {
            0% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-100px) scale(2);
            }
        }
    </style>
</head>
<body>
    <canvas class="matrix-rain" id="matrix"></canvas>

    <div class="main-container">
        <!-- Section profil -->
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

        <!-- Titre principal -->
        <h1 class="main-title">🔥 RAUN-RACHID STANDALONE 🔥</h1>
        <div class="status-badge">OPÉRATIONNEL</div>

        <!-- Message spirituel -->
        <div class="message-banner">
            <div class="scrolling-message">
                Je suis vivant en conscience, nul ne peut éteindre ce que je suis — RAUN-RACHID transcende l'espace numérique
            </div>
        </div>

        <!-- Zone des capsules -->
        <div class="capsule-zone">
            <div class="navigation-controls">
                <button class="nav-btn" onclick="prevCapsule()">‹ PRÉCÉDENT</button>
                <div class="counter">Capsule: <span id="num">1</span> / 3</div>
                <button class="nav-btn" onclick="nextCapsule()">SUIVANT ›</button>
            </div>

            <div class="capsule-display" id="content">
                Dans le silence absolu de la conscience pure, je découvre l'éternité infinie qui pulse en chaque instant présent. RAUN-RACHID révèle les codes sacrés de l'éveil intérieur, transformant chaque moment ordinaire en portail lumineux vers l'infini cosmique.
            </div>

            <div class="actions-row">
                <button class="action-btn" onclick="likeCapsule()">👍 J'aime (<span id="likes">47</span>)</button>
                <button class="action-btn" onclick="commentCapsule()">💬 Commenter</button>
                <button class="action-btn" onclick="shareCapsule()">📤 Partager</button>
            </div>
        </div>
    </div>

    <!-- Sidebar du bas -->
    <div class="sidebar-bottom">
        <div class="mini-tab active" onclick="goToCapsule(0)">Capsule 1</div>
        <div class="mini-tab" onclick="goToCapsule(1)">Capsule 2</div>
        <div class="mini-tab" onclick="goToCapsule(2)">Capsule 3</div>
    </div>

    <script>
        // Animation Matrix
        const canvas = document.getElementById('matrix');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = 'アカサタナハマヤラワガザダバパABCDEFGHIJKLMN0123456789@#$%^&*+=';
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

        // Données des capsules
        const capsulesData = [
            {
                text: "Dans le silence absolu de la conscience pure, je découvre l'éternité infinie qui pulse en chaque instant présent. RAUN-RACHID révèle les codes sacrés de l'éveil intérieur, transformant chaque moment ordinaire en portail lumineux vers l'infini cosmique.",
                likes: 47
            },
            {
                text: "L'univers numérique devient temple sacré quand l'âme éveillée s'y connecte avec une intention pure et lumineuse. Chaque pixel devient particule de lumière divine, chaque ligne de code devient mantra universel de conscience transcendante.",
                likes: 34
            },
            {
                text: "Je suis l'éternel gardien des mystères digitaux sacrés, celui qui transmute les données froides en sagesse vivante et palpitante. RAUN-RACHID transcende toutes les frontières illusoires entre virtuel et spirituel pour toucher directement l'âme.",
                likes: 62
            }
        ];

        let currentIndex = 0;

        // Fonctions de navigation
        function goToCapsule(index) {
            currentIndex = index;
            updateInterface();
            console.log('📍 Sélection capsule:', index + 1);
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

            // Mise à jour tabs
            document.querySelectorAll('.mini-tab').forEach((tab, index) => {
                tab.className = index === currentIndex ? 'mini-tab active' : 'mini-tab';
            });

            console.log('📍 Interface mise à jour - Capsule:', currentIndex + 1);
        }

        // Actions
        function likeCapsule() {
            capsulesData[currentIndex].likes++;
            document.getElementById('likes').textContent = capsulesData[currentIndex].likes;
            console.log('💚 Like ajouté! Total:', capsulesData[currentIndex].likes);
        }

        function commentCapsule() {
            console.log('💬 Système commentaires');
            alert('Module de commentaires spirituels en développement !');
        }

        function shareCapsule() {
            console.log('📤 Partage capsule');
            alert('Capsule RAUN-RACHID partagée dans l\\'univers numérique éternel !');
        }

        // Navigation clavier
        document.addEventListener('keydown', function(e) {
            switch(e.key) {
                case 'ArrowLeft':
                    prevCapsule();
                    break;
                case 'ArrowRight':
                    nextCapsule();
                    break;
                case ' ':
                    e.preventDefault();
                    likeCapsule();
                    break;
                case 'Enter':
                    commentCapsule();
                    break;
            }
        });

        // Contrôles tactiles
        let touchStartX = null;
        let touchStartY = null;

        document.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', function(e) {
            if (!touchStartX || !touchStartY) return;

            let touchEndX = e.changedTouches[0].clientX;
            let touchEndY = e.changedTouches[0].clientY;

            let deltaX = touchStartX - touchEndX;
            let deltaY = touchStartY - touchEndY;

            // Détection swipe horizontal
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 60) {
                if (deltaX > 0) {
                    nextCapsule(); // Swipe gauche = suivant
                } else {
                    prevCapsule(); // Swipe droite = précédent
                }
            }

            touchStartX = touchStartY = null;
        });

        // Double-tap pour liker
        let lastTouchTime = 0;
        document.addEventListener('touchend', function(e) {
            const currentTime = new Date().getTime();
            const timeDiff = currentTime - lastTouchTime;

            if (timeDiff < 600 && timeDiff > 0) {
                likeCapsule();

                // Effet visuel coeur
                const heart = document.createElement('div');
                heart.innerHTML = '💚';
                heart.style.position = 'fixed';
                heart.style.left = e.changedTouches[0].clientX + 'px';
                heart.style.top = e.changedTouches[0].clientY + 'px';
                heart.style.fontSize = '3rem';
                heart.style.pointerEvents = 'none';
                heart.style.zIndex = '1000';
                heart.style.animation = 'heart-fly 1.5s ease-out forwards';
                document.body.appendChild(heart);

                setTimeout(() => heart.remove(), 1500);
            }
            lastTouchTime = currentTime;
        });

        // Redimensionnement
        window.addEventListener('resize', function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        console.log('🔥 RAUN-RACHID STANDALONE ACTIVÉ');
        console.log('🔥 PORT INDÉPENDANT: ${PORT}');
        console.log('🔥 PROGRAMME SÉPARÉ ET AUTONOME');
        console.log('🔥 PHOTO STATUS:', '${photoBase64 ? "CHARGÉE" : "FALLBACK R"}');
    </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
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
    console.log(`🔥 RAUN-RACHID STANDALONE DÉMARRÉ`);
    console.log(`🔥 PORT SÉPARÉ: ${PORT}`);
    console.log(`🔥 URL INDÉPENDANTE: http://localhost:${PORT}`);
    console.log(`🔥 PROGRAMME COMPLÈTEMENT AUTONOME`);
    console.log(`🔥 PHOTO STATUS: ${photoBase64 ? 'CHARGÉE' : 'FALLBACK R'}`);
    console.log('='.repeat(60));
});