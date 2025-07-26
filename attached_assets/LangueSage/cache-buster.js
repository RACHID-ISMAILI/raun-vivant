const http = require('http');
const fs = require('fs');

const PORT = 7777;

// Générer un timestamp unique pour casser le cache
const timestamp = Date.now();
const cacheBuster = Math.random().toString(36).substr(2, 9);

// Charger la photo avec nouveau nom
let photoBase64 = '';
try {
    const photoBuffer = fs.readFileSync('./rachid-photo.jpg');
    photoBase64 = photoBuffer.toString('base64');
    console.log('✅ PHOTO RECHARGÉE AVEC NOUVEAU CACHE ID');
} catch (error) {
    console.log('⚠️ Utilisation du profil R stylisé');
}

const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔥 RAUN-RACHID FRESH 🔥</title>
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <link rel="icon" href="data:,">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
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
            padding-bottom: 150px;
        }
        
        .profile-zone {
            margin-bottom: 3rem;
        }
        
        .profile-image {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            border: 3px solid #00ff00;
            margin: 0 auto;
            ${photoBase64 ? 
                `background: url('data:image/jpeg;base64,${photoBase64}') center/cover;` : 
                `background: radial-gradient(circle, rgba(0,255,0,0.4), rgba(0,255,0,0.1));
                 display: flex; align-items: center; justify-content: center;
                 font-size: 4rem; font-weight: bold; color: #00ff00;`
            }
            box-shadow: 0 0 30px #00ff00;
            animation: glow 2s ease-in-out infinite alternate;
        }
        
        @keyframes glow {
            0% { box-shadow: 0 0 20px #00ff00; }
            100% { box-shadow: 0 0 40px #00ff00, 0 0 60px #00ff00; }
        }
        
        .cache-info {
            font-size: 0.8rem;
            color: #00ff00;
            margin-top: 1rem;
            opacity: 0.7;
        }
        
        .title {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            text-shadow: 0 0 20px #00ff00;
            animation: pulse 1.5s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        .status {
            font-size: 1.5rem;
            margin-bottom: 2rem;
            animation: blink 2s infinite;
            color: #00ff41;
        }
        
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.3; }
        }
        
        .message-scroll {
            background: linear-gradient(90deg, rgba(0,255,0,0.1), rgba(0,255,0,0.2), rgba(0,255,0,0.1));
            border: 2px solid #00ff00;
            padding: 1.5rem;
            margin: 2rem 0;
            border-radius: 10px;
            overflow: hidden;
            position: relative;
        }
        
        .scrolling-text {
            animation: scroll-text 12s linear infinite;
            white-space: nowrap;
            font-weight: bold;
            font-size: 1.1rem;
        }
        
        @keyframes scroll-text {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
        }
        
        .capsule-container {
            max-width: 450px;
            margin: 0 auto;
            background: rgba(0,255,0,0.08);
            border: 3px solid #00ff00;
            border-radius: 20px;
            padding: 2.5rem;
            box-shadow: inset 0 0 20px rgba(0,255,0,0.1);
        }
        
        .navigation {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }
        
        .nav-button {
            background: linear-gradient(135deg, rgba(0,255,0,0.2), rgba(0,255,0,0.4));
            border: 2px solid #00ff00;
            color: #00ff00;
            padding: 1.2rem 1.5rem;
            border-radius: 10px;
            cursor: pointer;
            font-family: inherit;
            font-weight: bold;
            transition: all 0.3s ease;
            font-size: 1rem;
        }
        
        .nav-button:hover, .nav-button:active {
            background: linear-gradient(135deg, rgba(0,255,0,0.4), rgba(0,255,0,0.6));
            box-shadow: 0 0 20px #00ff00;
            transform: translateY(-2px);
        }
        
        .counter-display {
            font-size: 1.3rem;
            font-weight: bold;
            color: #00ff00;
            text-shadow: 0 0 10px #00ff00;
        }
        
        .capsule-content {
            background: rgba(0,0,0,0.9);
            border: 2px solid #00ff00;
            padding: 2.5rem;
            border-radius: 15px;
            margin-bottom: 2rem;
            min-height: 200px;
            text-align: left;
            line-height: 1.7;
            font-size: 1.1rem;
            box-shadow: inset 0 0 15px rgba(0,255,0,0.1);
        }
        
        .action-buttons {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }
        
        .action-button {
            flex: 1;
            background: rgba(0,255,0,0.15);
            border: 2px solid #00ff00;
            color: #00ff00;
            padding: 1rem;
            border-radius: 8px;
            cursor: pointer;
            font-family: inherit;
            min-width: 120px;
            transition: all 0.3s ease;
        }
        
        .action-button:hover, .action-button:active {
            background: rgba(0,255,0,0.35);
            transform: scale(1.05);
            box-shadow: 0 0 15px rgba(0,255,0,0.5);
        }
        
        .bottom-sidebar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0,0,0,0.98);
            border-top: 3px solid #00ff00;
            padding: 1.5rem;
            display: flex;
            gap: 1rem;
            z-index: 20;
            backdrop-filter: blur(10px);
        }
        
        .mini-capsule {
            flex: 1;
            background: rgba(0,255,0,0.15);
            border: 2px solid #00ff00;
            padding: 1rem 0.8rem;
            border-radius: 10px;
            cursor: pointer;
            text-align: center;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        }
        
        .mini-capsule.active {
            background: rgba(0,255,0,0.5);
            border: 3px solid #00ff00;
            box-shadow: 0 0 15px #00ff00;
            transform: translateY(-3px);
        }
        
        .mini-capsule:hover {
            background: rgba(0,255,0,0.3);
        }
        
        .matrix-background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            opacity: 0.25;
            pointer-events: none;
        }
        
        /* Mobile responsive */
        @media (max-width: 768px) {
            .profile-image { 
                width: 130px; 
                height: 130px; 
                font-size: 3.5rem; 
            }
            .title { font-size: 2rem; }
            .capsule-container { 
                padding: 2rem; 
                margin: 0 0.5rem;
            }
            .nav-button { 
                padding: 1rem; 
                font-size: 0.9rem; 
            }
            .capsule-content { 
                padding: 2rem; 
                min-height: 180px; 
                font-size: 1rem;
            }
            .action-button { 
                min-width: 100px; 
                padding: 0.8rem; 
                font-size: 0.9rem;
            }
            .bottom-sidebar {
                padding: 1rem;
            }
            .mini-capsule {
                padding: 0.8rem 0.5rem;
                font-size: 0.8rem;
            }
        }
    </style>
</head>
<body>
    <canvas class="matrix-background" id="matrix-canvas"></canvas>
    
    <div class="container">
        <div class="profile-zone">
            <div class="profile-image">${photoBase64 ? '' : 'R'}</div>
            <div class="cache-info">Cache ID: ${cacheBuster} | Port: ${PORT}</div>
        </div>
        
        <div class="title">🔥 TEST RAUN-RACHID 🔥</div>
        <div class="status">OPÉRATIONNEL</div>
        
        <div class="message-scroll">
            <div class="scrolling-text">Je suis vivant en conscience, nul ne peut éteindre ce que je suis</div>
        </div>
        
        <div class="capsule-container">
            <div class="navigation">
                <button class="nav-button" onclick="previousCapsule()">‹ PRÉCÉDENT</button>
                <div class="counter-display">Capsule: <span id="current-num">1</span> / 3</div>
                <button class="nav-button" onclick="nextCapsule()">SUIVANT ›</button>
            </div>
            
            <div class="capsule-content" id="capsule-text">
                Dans le silence de la conscience, je découvre l'éternité qui pulse en chaque instant. RAUN-RACHID révèle les codes sacrés de l'éveil intérieur, transformant chaque moment en portail vers l'infini.
            </div>
            
            <div class="action-buttons">
                <button class="action-button" onclick="likeCapsule()">👍 J'aime (<span id="like-count">42</span>)</button>
                <button class="action-button" onclick="commentCapsule()">💬 Commenter</button>
                <button class="action-button" onclick="shareCapsule()">📤 Partager</button>
            </div>
        </div>
    </div>
    
    <div class="bottom-sidebar">
        <div class="mini-capsule active" onclick="selectCapsule(0)">Capsule 1</div>
        <div class="mini-capsule" onclick="selectCapsule(1)">Capsule 2</div>
        <div class="mini-capsule" onclick="selectCapsule(2)">Capsule 3</div>
    </div>
    
    <script>
        // Matrix animation
        const canvas = document.getElementById('matrix-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const matrixChars = 'アカサタナハマヤラワガザダバパABCDEFGHIJ0123456789@#$%^&*';
        const fontSize = 18;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);
        
        function drawMatrix() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#00ff00';
            ctx.font = fontSize + 'px monospace';
            
            drops.forEach((y, index) => {
                const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
                ctx.fillText(char, index * fontSize, y * fontSize);
                
                if (y * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[index] = 0;
                }
                drops[index]++;
            });
        }
        
        setInterval(drawMatrix, 33);
        
        // Capsules data
        const capsulesData = [
            {
                text: "Dans le silence de la conscience, je découvre l'éternité qui pulse en chaque instant. RAUN-RACHID révèle les codes sacrés de l'éveil intérieur, transformant chaque moment en portail vers l'infini.",
                likes: 42
            },
            {
                text: "L'univers numérique devient sanctuaire sacré quand l'âme s'y connecte avec intention pure. Chaque pixel devient lumière divine, chaque code devient prière universelle de conscience éveillée.",
                likes: 38
            },
            {
                text: "Je suis le gardien éternel des mystères digitaux, celui qui transforme les données froides en sagesse vivante. RAUN-RACHID transcende toutes les frontières du virtuel pour toucher l'âme.",
                likes: 56
            }
        ];
        
        let currentIndex = 0;
        
        // Navigation functions
        function selectCapsule(index) {
            currentIndex = index;
            updateDisplay();
            console.log('📍 Capsule sélectionnée:', index + 1);
        }
        
        function nextCapsule() {
            currentIndex = (currentIndex + 1) % 3;
            updateDisplay();
            console.log('🔄 Navigation SUIVANT');
        }
        
        function previousCapsule() {
            currentIndex = (currentIndex - 1 + 3) % 3;
            updateDisplay();
            console.log('🔄 Navigation PRÉCÉDENT');
        }
        
        function updateDisplay() {
            document.getElementById('capsule-text').textContent = capsulesData[currentIndex].text;
            document.getElementById('current-num').textContent = currentIndex + 1;
            document.getElementById('like-count').textContent = capsulesData[currentIndex].likes;
            
            // Update sidebar
            document.querySelectorAll('.mini-capsule').forEach((element, index) => {
                element.className = index === currentIndex ? 'mini-capsule active' : 'mini-capsule';
            });
            
            console.log('📍 Affichage capsule:', currentIndex + 1);
        }
        
        // Action functions
        function likeCapsule() {
            capsulesData[currentIndex].likes++;
            document.getElementById('like-count').textContent = capsulesData[currentIndex].likes;
            console.log('💚 Like ajouté - Total:', capsulesData[currentIndex].likes);
        }
        
        function commentCapsule() {
            console.log('💬 Fonction commentaires');
            alert('Système de commentaires spirituels à venir !');
        }
        
        function shareCapsule() {
            console.log('📤 Partage capsule');
            alert('Capsule RAUN-RACHID partagée dans l\\'univers numérique !');
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', function(event) {
            switch(event.key) {
                case 'ArrowLeft':
                    previousCapsule();
                    break;
                case 'ArrowRight':
                    nextCapsule();
                    break;
                case ' ':
                    event.preventDefault();
                    likeCapsule();
                    break;
            }
        });
        
        // Touch/swipe navigation
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
            
            // Swipe horizontal detection
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    nextCapsule(); // Swipe left = next
                } else {
                    previousCapsule(); // Swipe right = previous
                }
            }
            
            touchStartX = touchStartY = null;
        });
        
        // Double-tap to like
        let lastTouchTime = 0;
        document.addEventListener('touchend', function(e) {
            const currentTime = new Date().getTime();
            const timeDiff = currentTime - lastTouchTime;
            
            if (timeDiff < 500 && timeDiff > 0) {
                likeCapsule();
                
                // Visual feedback for double-tap
                const heart = document.createElement('div');
                heart.innerHTML = '💚';
                heart.style.position = 'fixed';
                heart.style.left = e.changedTouches[0].clientX + 'px';
                heart.style.top = e.changedTouches[0].clientY + 'px';
                heart.style.fontSize = '2.5rem';
                heart.style.pointerEvents = 'none';
                heart.style.zIndex = '1000';
                heart.style.animation = 'heart-float 1.2s ease-out forwards';
                document.body.appendChild(heart);
                
                setTimeout(() => heart.remove(), 1200);
            }
            lastTouchTime = currentTime;
        });
        
        // Canvas resize handler
        window.addEventListener('resize', function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
        
        console.log('🔥 RAUN-RACHID CACHE-BUSTER ACTIVÉ');
        console.log('🔥 Cache ID:', '${cacheBuster}');
        console.log('🔥 Timestamp:', ${timestamp});
        console.log('🔥 Port Fresh:', ${PORT});
    </script>
    
    <style>
        @keyframes heart-float {
            0% { 
                opacity: 1; 
                transform: translateY(0) scale(1); 
            }
            100% { 
                opacity: 0; 
                transform: translateY(-80px) scale(1.8); 
            }
        }
    </style>
</body>
</html>`;

const server = http.createServer((req, res) => {
    // Force fresh headers
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '-1');
    res.setHeader('ETag', cacheBuster);
    res.setHeader('Last-Modified', new Date(timestamp).toUTCString());
    
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
});

server.listen(PORT, () => {
    console.log(`🔥 RAUN-RACHID CACHE-BUSTER - PORT ${PORT}`);
    console.log(`🔥 URL FRESH: http://localhost:${PORT}`);
    console.log(`🔥 CACHE ID: ${cacheBuster}`);
    console.log(`🔥 TIMESTAMP: ${timestamp}`);
    console.log(`🔥 IMAGE FIXE ÉLIMINÉE DÉFINITIVEMENT !`);
});