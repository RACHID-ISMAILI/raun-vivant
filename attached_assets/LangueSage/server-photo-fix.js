const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

// Interface RAUN-RACHID avec ta vraie photo intégrée en base64
let photoBase64 = '';
try {
    const photoBuffer = fs.readFileSync(path.join(__dirname, 'rachid-photo.jpg'));
    photoBase64 = photoBuffer.toString('base64');
    console.log('✅ Photo RACHID chargée avec succès');
} catch (error) {
    console.log('⚠️ Photo non trouvée, utilisation du profil stylisé');
}

const indexHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔥 RAUN-RACHID - Interface Mobile</title>
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
            overflow-x: hidden;
            position: relative;
            min-height: 100vh;
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
            opacity: 0.3;
        }

        /* Container principal */
        .container {
            position: relative;
            z-index: 10;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding: 2rem 1rem;
            padding-bottom: 120px;
        }

        /* Header avec photo profil */
        .profile-header {
            text-align: center;
            margin-bottom: 2rem;
        }

        .profile-circle {
            width: 150px;
            height: 150px;
            margin: 0 auto 1rem;
            position: relative;
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
            display: none;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            filter: drop-shadow(0 0 20px #00ff00);
            position: relative;
            overflow: hidden;
        }
        
        .profile-letter {
            font-size: 3rem;
            font-weight: bold;
            color: #00ff00;
            text-shadow: 0 0 15px #00ff00;
            margin-bottom: -0.5rem;
        }
        
        .profile-name {
            font-size: 0.7rem;
            color: #00ff00;
            letter-spacing: 2px;
            opacity: 0.8;
        }

        .main-title {
            font-size: 2.5rem;
            font-weight: bold;
            text-align: center;
            margin-bottom: 1rem;
            text-shadow: 0 0 20px #00ff00;
            animation: pulse 2s ease-in-out infinite alternate;
        }

        .status-indicator {
            font-size: 1.2rem;
            color: #00ff00;
            text-align: center;
            margin-bottom: 2rem;
            animation: blink 1s infinite;
        }

        @keyframes pulse {
            0% { text-shadow: 0 0 20px #00ff00; }
            100% { text-shadow: 0 0 30px #00ff00, 0 0 40px #00ff00; }
        }

        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.7; }
        }

        /* Message défilant */
        .scrolling-message {
            width: 100%;
            overflow: hidden;
            background: rgba(0, 255, 0, 0.1);
            border: 1px solid #00ff00;
            border-radius: 10px;
            margin: 2rem 0;
            padding: 1rem;
        }

        .scroll-text {
            display: inline-block;
            white-space: nowrap;
            animation: scroll 15s linear infinite;
            font-size: 1.1rem;
            font-weight: bold;
        }

        @keyframes scroll {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
        }

        /* Navigation et capsules */
        .capsules-container {
            width: 100%;
            max-width: 400px;
            background: rgba(0, 255, 0, 0.05);
            border: 2px solid #00ff00;
            border-radius: 15px;
            padding: 2rem;
            text-align: center;
            touch-action: pan-y;
        }

        .capsule-navigation {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            gap: 1rem;
        }

        .nav-button {
            background: rgba(0, 255, 0, 0.2);
            border: 2px solid #00ff00;
            color: #00ff00;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            min-height: 50px;
            touch-action: manipulation;
        }

        .nav-button:hover, .nav-button:active {
            background: rgba(0, 255, 0, 0.4);
            box-shadow: 0 0 15px #00ff00;
        }

        .capsule-counter {
            font-size: 1.2rem;
            font-weight: bold;
            color: #00ff00;
            min-width: 100px;
        }

        .capsule-content {
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid #00ff00;
            border-radius: 10px;
            padding: 2rem;
            margin-bottom: 2rem;
            min-height: 250px;
        }

        .capsule-text {
            font-size: 1.1rem;
            line-height: 1.6;
            color: #00ff00;
            text-align: left;
        }

        .capsule-actions {
            display: flex;
            justify-content: space-around;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .action-btn {
            background: rgba(0, 255, 0, 0.1);
            border: 2px solid #00ff00;
            color: #00ff00;
            padding: 1rem;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            min-width: 100px;
            touch-action: manipulation;
        }

        .action-btn:hover, .action-btn:active {
            background: rgba(0, 255, 0, 0.3);
            transform: scale(1.05);
        }

        /* Sidebar mobile en bas */
        .sidebar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.95);
            border-top: 2px solid #00ff00;
            padding: 1rem;
            display: flex;
            justify-content: space-around;
            z-index: 20;
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
            cursor: pointer;
            background: rgba(0, 255, 0, 0.1);
            border: 1px solid #00ff00;
            transition: all 0.3s;
            touch-action: manipulation;
        }

        .mini-capsule.active {
            background: rgba(0, 255, 0, 0.4);
            border: 2px solid #00ff00;
            box-shadow: 0 0 10px #00ff00;
        }

        .mini-capsule:hover {
            background: rgba(0, 255, 0, 0.3);
        }

        /* Responsive mobile */
        @media (max-width: 768px) {
            .profile-circle {
                width: 120px;
                height: 120px;
            }

            .main-title { 
                font-size: 1.8rem; 
            }

            .scroll-text {
                font-size: 1rem;
            }

            .capsules-container { 
                padding: 1.5rem;
                max-width: 100%;
            }

            .nav-button {
                padding: 0.8rem;
                font-size: 0.9rem;
            }

            .capsule-content {
                padding: 1.5rem;
                min-height: 200px;
            }

            .action-btn {
                flex: 1;
                min-width: 80px;
                padding: 0.8rem;
                font-size: 0.8rem;
            }
        }

        /* Animation fadeUp pour double-tap */
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
    </style>
</head>
<body>
    <!-- Background Matrix Animation -->
    <canvas id="matrix" class="matrix-bg"></canvas>

    <div class="container">
        <!-- Header avec profil -->
        <div class="profile-header">
            <div class="profile-circle">
                ${photoBase64 ? `<img src="data:image/jpeg;base64,${photoBase64}" alt="RACHID" class="profile-image">` : `
                <div class="profile-placeholder" style="display: flex;">
                    <div class="profile-letter">R</div>
                    <div class="profile-name">RACHID</div>
                </div>`}
            </div>
        </div>

        <!-- Titre principal -->
        <h1 class="main-title">🔥 TEST RAUN-RACHID 🔥</h1>
        <div class="status-indicator">OPÉRATIONNEL</div>

        <!-- Message spirituel défilant -->
        <div class="scrolling-message">
            <div class="scroll-text">Je suis vivant en conscience, nul ne peut éteindre ce que je suis</div>
        </div>

        <!-- Container des capsules -->
        <div class="capsules-container">
            <!-- Navigation -->
            <div class="capsule-navigation">
                <button class="nav-button" onclick="previousCapsule()">‹ PRÉCÉDENT</button>
                <div class="capsule-counter">Capsule: <span id="capsule-num">1</span> / 3</div>
                <button class="nav-button" onclick="nextCapsule()">SUIVANT ›</button>
            </div>

            <!-- Contenu de la capsule -->
            <div class="capsule-content">
                <div class="capsule-text" id="capsule-text">
                    Première capsule de conscience spirituelle
                </div>
            </div>

            <!-- Actions -->
            <div class="capsule-actions">
                <button class="action-btn" onclick="likeCapsule()">👍 J'aime (<span id="likes">0</span>)</button>
                <button class="action-btn" onclick="commentCapsule()">💬 Commenter</button>
                <button class="action-btn" onclick="shareCapsule()">📤 Partager</button>
            </div>
        </div>
    </div>

    <!-- Sidebar mobile -->
    <div class="sidebar">
        <div class="mini-capsule active" onclick="showCapsule(1)">Capsule 1</div>
        <div class="mini-capsule" onclick="showCapsule(2)">Capsule 2</div>
        <div class="mini-capsule" onclick="showCapsule(3)">Capsule 3</div>
    </div>

    <script>
        // Animation Matrix
        const canvas = document.getElementById('matrix');
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
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

            ctx.fillStyle = '#00ff00';
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

        // Données des capsules
        const capsules = [
            {
                text: "Dans le silence de la conscience, je découvre l'éternité qui pulse en chaque instant. RAUN-RACHID révèle les codes sacrés de l'éveil intérieur.",
                likes: 42
            },
            {
                text: "L'univers numérique devient sanctuaire quand l'âme s'y connecte avec intention pure. Chaque pixel devient lumière, chaque code devient prière.",
                likes: 38
            },
            {
                text: "Je suis le gardien des mystères digitaux, celui qui transforme les données en sagesse. RAUN-RACHID transcende les frontières du virtuel.",
                likes: 56
            }
        ];

        let currentCapsule = 0;

        // Fonctions de navigation
        function showCapsule(index) {
            currentCapsule = index - 1;
            updateDisplay();
            console.log('📍 Capsule affichée:', index);
        }

        function nextCapsule() {
            currentCapsule = (currentCapsule + 1) % capsules.length;
            updateDisplay();
            console.log('🔄 Clic SUIVANT');
            console.log('📍 Capsule affichée:', currentCapsule + 1);
        }

        function previousCapsule() {
            currentCapsule = (currentCapsule - 1 + capsules.length) % capsules.length;
            updateDisplay();
            console.log('🔄 Clic PRÉCÉDENT');
            console.log('📍 Capsule affichée:', currentCapsule + 1);
        }

        function updateDisplay() {
            document.getElementById('capsule-text').textContent = capsules[currentCapsule].text;
            document.getElementById('capsule-num').textContent = currentCapsule + 1;
            document.getElementById('likes').textContent = capsules[currentCapsule].likes;

            // Mise à jour sidebar
            document.querySelectorAll('.mini-capsule').forEach((elem, index) => {
                elem.classList.toggle('active', index === currentCapsule);
            });
        }

        // Actions
        function likeCapsule() {
            capsules[currentCapsule].likes++;
            document.getElementById('likes').textContent = capsules[currentCapsule].likes;
            console.log('💚 Like ajouté!');
        }

        function commentCapsule() {
            console.log('💬 Ouverture des commentaires');
            alert('Fonction commentaires à venir dans la version complète !');
        }

        function shareCapsule() {
            console.log('📤 Partage de la capsule');
            alert('Capsule partagée dans l\\'univers numérique !');
        }

        // Navigation clavier
        document.addEventListener('keydown', function(e) {
            if(e.key === 'ArrowLeft') previousCapsule();
            if(e.key === 'ArrowRight') nextCapsule();
            if(e.key === ' ') {
                e.preventDefault();
                likeCapsule();
            }
        });

        // Gestion tactile (swipe)
        let startX = null;

        document.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        });

        document.addEventListener('touchend', function(e) {
            if (!startX) return;
            
            let endX = e.changedTouches[0].clientX;
            let diffX = startX - endX;
            
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    nextCapsule();
                } else {
                    previousCapsule();
                }
            }
            
            startX = null;
        });

        // Double-tap pour liker
        let lastTap = 0;
        document.addEventListener('touchend', function(e) {
            let currentTime = new Date().getTime();
            let tapLength = currentTime - lastTap;
            
            if (tapLength < 500 && tapLength > 0) {
                likeCapsule();
                
                // Effet visuel
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

        console.log('🔥 INTERFACE RAUN-RACHID AVEC PHOTO ACTIVÉE');
        console.log('Navigation: Flèches ← → ou boutons ou swipe');
        console.log('Like: Double-tap ou bouton');
    </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(indexHTML);
});

server.listen(PORT, () => {
    console.log(`🔥 SERVEUR PHOTO RAUN-RACHID DÉMARRÉ SUR PORT ${PORT}`);
    console.log(`🔥 URL: http://localhost:${PORT}`);
    console.log(`🔥 PHOTO INTÉGRÉE DIRECTEMENT EN BASE64`);
    console.log(`🔥 Plus de problème d'image qui ne s'élimine pas !`);
});