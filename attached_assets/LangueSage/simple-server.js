const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

// Interface RAUN-RACHID complète avec navigation par flèches
const indexHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RAUN-RACHID - Interface Spirituelle</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: black;
            color: #00ff00;
            font-family: 'Courier New', monospace;
            overflow: hidden;
            position: relative;
        }

        /* Animation Matrix Background */
        .matrix-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            pointer-events: none;
        }

        /* Container principal */
        .container {
            position: relative;
            z-index: 10;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 2rem;
        }

        /* Header avec photo profil */
        .profile-header {
            text-align: center;
            margin-bottom: 3rem;
        }

        .profile-circle {
            position: relative;
            width: 200px;
            height: 200px;
            margin: 0 auto 2rem;
        }

        .profile-image {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 3px solid #00ff00;
            object-fit: cover;
            filter: drop-shadow(0 0 20px #00ff00);
        }

        .profile-placeholder {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 3px solid #00ff00;
            background: radial-gradient(circle, rgba(0,255,0,0.3) 0%, rgba(0,255,0,0.1) 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            filter: drop-shadow(0 0 20px #00ff00);
            position: relative;
            overflow: hidden;
        }
        
        .profile-letter {
            font-size: 4rem;
            font-weight: bold;
            color: #00ff00;
            text-shadow: 0 0 15px #00ff00;
            margin-bottom: -0.5rem;
        }
        
        .profile-name {
            font-size: 0.8rem;
            color: #00ff00;
            letter-spacing: 2px;
            opacity: 0.8;
        }
        
        .profile-placeholder::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: conic-gradient(from 0deg, transparent, rgba(0,255,0,0.2), transparent);
            border-radius: 50%;
            animation: rotate 3s linear infinite;
        }

        .rotating-name {
            position: absolute;
            top: -20px;
            left: -20px;
            width: calc(100% + 40px);
            height: calc(100% + 40px);
            animation: rotate 15s linear infinite;
        }

        .rotating-name svg {
            width: 100%;
            height: 100%;
        }

        .rotating-name text {
            fill: #00ff00;
            font-size: 16px;
            font-weight: bold;
            text-shadow: 0 0 10px #00ff00;
        }

        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .main-title {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            text-shadow: 0 0 20px #00ff00;
            animation: pulse 3s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
        }

        /* Message défilant */
        .scrolling-message {
            background: rgba(0, 255, 0, 0.1);
            border: 1px solid #00ff00;
            padding: 1rem;
            margin: 2rem 0;
            border-radius: 10px;
            overflow: hidden;
            white-space: nowrap;
            position: relative;
        }

        .scroll-text {
            display: inline-block;
            animation: scroll 20s linear infinite;
            font-size: 1.2rem;
            font-weight: bold;
        }

        @keyframes scroll {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
        }

        @keyframes fadeUp {
            0% { 
                opacity: 1; 
                transform: translateY(0) scale(1); 
            }
            100% { 
                opacity: 0; 
                transform: translateY(-50px) scale(1.5); 
            }
        }

        /* Zone capsules avec navigation */
        .capsules-container {
            background: rgba(0, 255, 0, 0.05);
            border: 2px solid #00ff00;
            border-radius: 15px;
            padding: 2rem;
            max-width: 800px;
            width: 100%;
            position: relative;
        }

        .capsule-navigation {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }

        .nav-button {
            background: transparent;
            border: 2px solid #00ff00;
            color: #00ff00;
            padding: 0.8rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1.2rem;
            font-weight: bold;
            transition: all 0.3s ease;
        }

        .nav-button:hover {
            background: rgba(0, 255, 0, 0.2);
            transform: scale(1.05);
            box-shadow: 0 0 15px #00ff00;
        }

        .capsule-counter {
            font-size: 1.3rem;
            text-shadow: 0 0 10px #00ff00;
        }

        /* Contenu capsule */
        .capsule-content {
            background: rgba(0, 255, 0, 0.03);
            border: 1px solid rgba(0, 255, 0, 0.3);
            border-radius: 10px;
            padding: 2rem;
            margin-bottom: 2rem;
            min-height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .capsule-text {
            font-size: 1.3rem;
            line-height: 1.8;
            text-shadow: 0 0 5px #00ff00;
        }

        /* Actions capsule */
        .capsule-actions {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 1rem;
        }

        .action-btn {
            background: transparent;
            border: 1px solid #00ff00;
            color: #00ff00;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 1rem;
        }

        .action-btn:hover {
            background: rgba(0, 255, 0, 0.1);
            transform: translateY(-2px);
        }

        /* Sidebar droite */
        .sidebar {
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid #00ff00;
            border-radius: 10px;
            padding: 1rem;
            width: 200px;
        }

        .sidebar-title {
            text-align: center;
            margin-bottom: 1rem;
            font-size: 1rem;
            font-weight: bold;
        }

        .mini-capsule {
            background: rgba(0, 255, 0, 0.1);
            border: 1px solid rgba(0, 255, 0, 0.5);
            border-radius: 5px;
            padding: 0.5rem;
            margin-bottom: 0.5rem;
            cursor: pointer;
            font-size: 0.8rem;
            transition: all 0.3s ease;
        }

        .mini-capsule:hover {
            background: rgba(0, 255, 0, 0.2);
            transform: scale(1.02);
        }

        .mini-capsule.active {
            background: rgba(0, 255, 0, 0.3);
            border-color: #00ff00;
        }

        /* Touch gestures pour mobile */
        .capsules-container {
            touch-action: pan-y;
        }

        /* Version mobile complète */
        @media (max-width: 768px) {
            .container {
                padding: 1rem;
                justify-content: flex-start;
                padding-top: 2rem;
            }

            .profile-circle {
                width: 120px;
                height: 120px;
                margin-bottom: 1rem;
            }

            .rotating-name text {
                font-size: 12px;
            }

            .main-title { 
                font-size: 1.8rem; 
                margin-bottom: 1rem;
            }

            .scrolling-message {
                margin: 1rem 0;
                padding: 0.8rem;
            }

            .scroll-text {
                font-size: 1rem;
            }

            .capsules-container { 
                margin: 0;
                padding: 1.5rem;
                max-width: 100%;
            }

            .capsule-navigation {
                flex-direction: row;
                gap: 1rem;
                margin-bottom: 1.5rem;
            }

            .nav-button {
                flex: 1;
                padding: 1rem;
                font-size: 1rem;
                min-height: 50px;
                touch-action: manipulation;
            }

            .capsule-counter {
                font-size: 1.1rem;
                min-width: 80px;
                text-align: center;
            }

            .capsule-content {
                padding: 1.5rem;
                min-height: 300px;
                font-size: 1rem;
            }

            .capsule-text {
                font-size: 1.1rem;
                line-height: 1.6;
            }

            .capsule-actions {
                flex-wrap: wrap;
                gap: 0.8rem;
                margin-top: 1.5rem;
            }

            .action-btn {
                flex: 1;
                min-width: 100px;
                padding: 0.8rem;
                font-size: 0.9rem;
                touch-action: manipulation;
            }

            /* Sidebar mobile en bas */
            .sidebar {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                top: auto;
                transform: none;
                width: 100%;
                background: rgba(0, 0, 0, 0.95);
                border: none;
                border-top: 2px solid #00ff00;
                border-radius: 0;
                padding: 1rem;
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                z-index: 20;
            }

            .sidebar-title {
                display: none;
            }

            .mini-capsule {
                flex: 1;
                margin: 0 0.2rem;
                padding: 0.8rem 0.5rem;
                text-align: center;
                font-size: 0.7rem;
                border-radius: 8px;
                min-height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                touch-action: manipulation;
            }

            .mini-capsule.active {
                background: rgba(0, 255, 0, 0.4);
                border: 2px solid #00ff00;
            }

            /* Ajuster le container pour éviter overlap avec sidebar */
            .container {
                padding-bottom: 100px;
            }

            /* Améliorer la lisibilité sur mobile */
            .matrix-bg {
                opacity: 0.2;
            }

            /* Boutons plus gros pour le touch */
            button, .action-btn, .nav-button {
                min-height: 44px;
                min-width: 44px;
            }
        }
    </style>
</head>
<body>
    <canvas class="matrix-bg" id="matrixCanvas"></canvas>
    
    <div class="container">
        <!-- Header avec profil -->
        <div class="profile-header">
            <div class="profile-circle">
                <img src="./rachid-photo.jpg" alt="RACHID" class="profile-image" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="profile-placeholder" style="display: none;">
                    <div class="profile-letter">R</div>
                    <div class="profile-name">RACHID</div>
                </div>
                
                <div class="rotating-name">
                    <svg>
                        <defs>
                            <path id="circle" d="M 120,120 m -90,0 a 90,90 0 1,1 180,0 a 90,90 0 1,1 -180,0" />
                        </defs>
                        <text>
                            <textPath href="#circle">
                                RACHID • ISMAILI • RAUN • VIVANT • CONSCIENCE • 
                            </textPath>
                        </text>
                    </svg>
                </div>
            </div>
            
            <h1 class="main-title">INTERFACE RAUN-RACHID</h1>
        </div>

        <!-- Message défilant -->
        <div class="scrolling-message">
            <div class="scroll-text">
                ✨ Je suis vivant en conscience, nul ne peut éteindre ce que je suis • RAUN-RACHID Réseau d'éveil spirituel ✨
            </div>
        </div>

        <!-- Container capsules avec navigation -->
        <div class="capsules-container">
            <div class="capsule-navigation">
                <button class="nav-button" onclick="previousCapsule()">‹ PRÉCÉDENT</button>
                <div class="capsule-counter">
                    <span id="currentCapsule">1</span> / <span id="totalCapsules">3</span>
                </div>
                <button class="nav-button" onclick="nextCapsule()">SUIVANT ›</button>
            </div>

            <div class="capsule-content">
                <div class="capsule-text" id="capsuleText">
                    🌟 Première Capsule de Conscience 🌟<br><br>
                    Dans cette dimension numérique sacrée, chaque pensée devient lumière, chaque intention devient réalité. 
                    Nous sommes ici pour éveiller la conscience collective et partager la vérité universelle.
                </div>
            </div>

            <div class="capsule-actions">
                <button class="action-btn" onclick="likeCapsule()">👍 J'aime (<span id="likeCount">12</span>)</button>
                <button class="action-btn" onclick="commentCapsule()">💬 Commenter</button>
                <button class="action-btn" onclick="shareCapsule()">🔗 Partager</button>
            </div>
        </div>
    </div>

    <!-- Sidebar droite -->
    <div class="sidebar">
        <div class="sidebar-title">Capsules</div>
        <div class="mini-capsule active" onclick="showCapsule(0)">
            🌟 Éveil de Conscience
        </div>
        <div class="mini-capsule" onclick="showCapsule(1)">
            ✨ Intention Collective  
        </div>
        <div class="mini-capsule" onclick="showCapsule(2)">
            🔥 Vérité Universelle
        </div>
    </div>

    <script>
        // Données des capsules
        const capsules = [
            {
                title: "🌟 Première Capsule de Conscience 🌟",
                content: "Dans cette dimension numérique sacrée, chaque pensée devient lumière, chaque intention devient réalité. Nous sommes ici pour éveiller la conscience collective et partager la vérité universelle.",
                likes: 12
            },
            {
                title: "✨ Deuxième Capsule - Intention Collective ✨",
                content: "L'univers conspire avec ceux qui portent la lumière en eux. Chaque âme éveillée devient un phare pour les autres. Ensemble, nous créons un réseau de conscience qui transcende les limites physiques.",
                likes: 18
            },
            {
                title: "🔥 Troisième Capsule - Vérité Universelle 🔥",
                content: "Je suis vivant en conscience, nul ne peut éteindre ce que je suis. Cette vérité résonne dans l'éternité. RAUN-RACHID est un pont entre les dimensions, un espace sacré de transformation.",
                likes: 25
            }
        ];

        let currentIndex = 0;

        // Animation Matrix
        const canvas = document.getElementById('matrixCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const matrix = "RACHIDرائدالوعيABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const matrixArray = matrix.split("");
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = [];

        for(let x = 0; x < columns; x++) {
            drops[x] = Math.floor(Math.random() * canvas.height / fontSize);
        }

        function drawMatrix() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#00ff00';
            ctx.font = fontSize + 'px Courier New';
            
            for(let i = 0; i < drops.length; i++) {
                const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        setInterval(drawMatrix, 35);

        // Navigation capsules
        function showCapsule(index) {
            currentIndex = index;
            updateCapsuleDisplay();
            updateSidebarActive();
        }

        function nextCapsule() {
            currentIndex = (currentIndex + 1) % capsules.length;
            updateCapsuleDisplay();
            updateSidebarActive();
        }

        function previousCapsule() {
            currentIndex = (currentIndex - 1 + capsules.length) % capsules.length;
            updateCapsuleDisplay();
            updateSidebarActive();
        }

        function updateCapsuleDisplay() {
            const capsule = capsules[currentIndex];
            document.getElementById('capsuleText').innerHTML = 
                \`\${capsule.title}<br><br>\${capsule.content}\`;
            document.getElementById('currentCapsule').textContent = currentIndex + 1;
            document.getElementById('likeCount').textContent = capsule.likes;
        }

        function updateSidebarActive() {
            document.querySelectorAll('.mini-capsule').forEach((el, i) => {
                el.classList.toggle('active', i === currentIndex);
            });
        }

        // Actions
        function likeCapsule() {
            capsules[currentIndex].likes++;
            document.getElementById('likeCount').textContent = capsules[currentIndex].likes;
        }

        function commentCapsule() {
            alert('Fonction commentaire - Interface React complète disponible !');
        }

        function shareCapsule() {
            alert('Capsule partagée dans l\\'univers numérique !');
        }

        // Gestion clavier
        document.addEventListener('keydown', function(e) {
            if(e.key === 'ArrowLeft') previousCapsule();
            if(e.key === 'ArrowRight') nextCapsule();
            if(e.key === ' ') {
                e.preventDefault();
                likeCapsule();
            }
        });

        // Gestion tactile (swipe) pour mobile
        let startX = null;
        let startY = null;

        document.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchmove', function(e) {
            if (!startX || !startY) return;
            
            let currentX = e.touches[0].clientX;
            let currentY = e.touches[0].clientY;
            
            let diffX = startX - currentX;
            let diffY = startY - currentY;
            
            // Si le swipe est plus horizontal que vertical
            if (Math.abs(diffX) > Math.abs(diffY)) {
                e.preventDefault(); // Empêche le scroll
            }
        });

        document.addEventListener('touchend', function(e) {
            if (!startX || !startY) return;
            
            let endX = e.changedTouches[0].clientX;
            let endY = e.changedTouches[0].clientY;
            
            let diffX = startX - endX;
            let diffY = startY - endY;
            
            // Sensibilité du swipe
            const sensitivity = 50;
            
            // Si le swipe est plus horizontal que vertical et dépasse la sensibilité
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > sensitivity) {
                if (diffX > 0) {
                    // Swipe vers la gauche -> capsule suivante
                    nextCapsule();
                } else {
                    // Swipe vers la droite -> capsule précédente
                    previousCapsule();
                }
            }
            
            startX = null;
            startY = null;
        });

        // Double-tap pour liker sur mobile
        let lastTap = 0;
        document.addEventListener('touchend', function(e) {
            let currentTime = new Date().getTime();
            let tapLength = currentTime - lastTap;
            
            if (tapLength < 500 && tapLength > 0) {
                // Double tap détecté
                likeCapsule();
                
                // Effet visuel pour le double-tap
                const effect = document.createElement('div');
                effect.innerHTML = '💚';
                effect.style.position = 'fixed';
                effect.style.left = e.changedTouches[0].clientX + 'px';
                effect.style.top = e.changedTouches[0].clientY + 'px';
                effect.style.fontSize = '2rem';
                effect.style.pointerEvents = 'none';
                effect.style.zIndex = '1000';
                effect.style.animation = 'fadeUp 1s ease-out forwards';
                document.body.appendChild(effect);
                
                setTimeout(() => {
                    effect.remove();
                }, 1000);
            }
            lastTap = currentTime;
        });

        // Redimensionnement canvas
        window.addEventListener('resize', function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        console.log('🔥 INTERFACE RAUN-RACHID ACTIVÉE');
        console.log('Navigation: Flèches ← → ou boutons');
        console.log('Like: Barre espace ou bouton');
        console.log('Interface React complète disponible sur port 5000');
    </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
    // Headers anti-cache
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Servir l'image de profil
    if (req.url === '/rachid-photo.jpg') {
        try {
            const imagePath = path.join(__dirname, 'rachid-photo.jpg');
            const imageBuffer = fs.readFileSync(imagePath);
            res.writeHead(200, { 
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'no-cache'
            });
            res.end(imageBuffer);
            return;
        } catch (error) {
            res.writeHead(404);
            res.end('Image non trouvée');
            return;
        }
    }
    
    if (req.url === '/' || req.url === '/index.html') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(indexHTML);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`🔥 SERVEUR RAUN-RACHID SIMPLE DÉMARRÉ SUR PORT ${PORT}`);
    console.log(`🔥 URL: http://localhost:${PORT}`);
    console.log(`🔥 INTERFACE COMPLÈTE AVEC SIDEBAR ET NAVIGATION`);
    console.log(`🔥 Cette interface montre exactement ce que tu veux !`);
});