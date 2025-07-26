const http = require('http');
const fs = require('fs');

const PORT = 7777;

console.log('Démarrage du serveur...');

// Vérifier si la photo existe
let photoExists = false;
try {
    fs.accessSync('./rachid-photo.jpg');
    photoExists = true;
    console.log('✅ Photo rachid-photo.jpg trouvée');
} catch (error) {
    console.log('⚠️ Photo rachid-photo.jpg non trouvée');
}

const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>🔥 RAUN-RACHID SIMPLE 🔥</title>
    <style>
        body { 
            background: black; 
            color: #00ff00; 
            font-family: monospace; 
            text-align: center; 
            padding: 2rem; 
        }
        .profile { 
            width: 150px; 
            height: 150px; 
            border-radius: 50%; 
            border: 3px solid #00ff00; 
            margin: 2rem auto; 
            ${photoExists ? "background: url('/photo') center/cover;" : "background: radial-gradient(circle, rgba(0,255,0,0.3), rgba(0,255,0,0.1)); display: flex; align-items: center; justify-content: center; font-size: 4rem;"}
            box-shadow: 0 0 20px #00ff00;
        }
        .title { 
            font-size: 2rem; 
            margin: 1rem 0; 
            text-shadow: 0 0 10px #00ff00; 
        }
        .status { 
            font-size: 1.5rem; 
            margin: 2rem 0; 
            color: #00ff41; 
        }
        .nav { 
            margin: 2rem 0; 
        }
        .btn { 
            background: rgba(0,255,0,0.2); 
            border: 2px solid #00ff00; 
            color: #00ff00; 
            padding: 1rem 2rem; 
            margin: 0 1rem; 
            border-radius: 5px; 
            cursor: pointer; 
            font-family: inherit; 
        }
        .btn:hover { 
            background: rgba(0,255,0,0.4); 
        }
        .content { 
            background: rgba(0,255,0,0.1); 
            border: 2px solid #00ff00; 
            padding: 2rem; 
            margin: 2rem 0; 
            border-radius: 10px; 
            text-align: left; 
            line-height: 1.6; 
        }
    </style>
</head>
<body>
    <div class="profile">${photoExists ? '' : 'R'}</div>
    <div class="title">🔥 RAUN-RACHID SIMPLE 🔥</div>
    <div class="status">OPÉRATIONNEL</div>
    
    <div class="nav">
        <button class="btn" onclick="prev()">‹ PRÉCÉDENT</button>
        <span>Capsule: <span id="num">1</span> / 3</span>
        <button class="btn" onclick="next()">SUIVANT ›</button>
    </div>
    
    <div class="content" id="text">
        Dans le silence de la conscience, je découvre l'éternité qui pulse en chaque instant. RAUN-RACHID révèle les codes sacrés de l'éveil intérieur.
    </div>
    
    <div>
        <button class="btn" onclick="like()">👍 J'aime (<span id="likes">42</span>)</button>
        <button class="btn" onclick="comment()">💬 Commenter</button>
        <button class="btn" onclick="share()">📤 Partager</button>
    </div>
    
    <script>
        const capsules = [
            { text: "Dans le silence de la conscience, je découvre l'éternité qui pulse en chaque instant. RAUN-RACHID révèle les codes sacrés de l'éveil intérieur.", likes: 42 },
            { text: "L'univers numérique devient sanctuaire quand l'âme s'y connecte avec intention pure. Chaque pixel devient lumière.", likes: 38 },
            { text: "Je suis le gardien des mystères digitaux, celui qui transforme les données en sagesse. RAUN-RACHID transcende le virtuel.", likes: 56 }
        ];
        
        let current = 0;
        
        function update() {
            document.getElementById('text').textContent = capsules[current].text;
            document.getElementById('num').textContent = current + 1;
            document.getElementById('likes').textContent = capsules[current].likes;
        }
        
        function next() {
            current = (current + 1) % 3;
            update();
            console.log('Navigation SUIVANT');
        }
        
        function prev() {
            current = (current - 1 + 3) % 3;
            update();
            console.log('Navigation PRÉCÉDENT');
        }
        
        function like() {
            capsules[current].likes++;
            update();
            console.log('Like ajouté!');
        }
        
        function comment() {
            alert('Fonction commentaires à venir !');
        }
        
        function share() {
            alert('Capsule partagée !');
        }
        
        // Navigation clavier
        document.onkeydown = e => {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
            if (e.key === ' ') { e.preventDefault(); like(); }
        };
        
        console.log('🔥 RAUN-RACHID SIMPLE ACTIVÉ');
    </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
    console.log('Requête reçue:', req.url);
    
    if (req.url === '/photo' && photoExists) {
        try {
            const photo = fs.readFileSync('./rachid-photo.jpg');
            res.writeHead(200, { 'Content-Type': 'image/jpeg' });
            res.end(photo);
            console.log('Photo servie');
        } catch (error) {
            res.writeHead(404);
            res.end('Photo non trouvée');
        }
        return;
    }
    
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
});

server.listen(PORT, () => {
    console.log(`🔥 SERVEUR RAUN-RACHID SIMPLE DÉMARRÉ`);
    console.log(`🔥 URL: http://localhost:${PORT}`);
    console.log(`🔥 Photo: ${photoExists ? 'DISPONIBLE' : 'FALLBACK R'}`);
});

server.on('error', (error) => {
    console.error('Erreur serveur:', error);
});