const http = require('http');
const fs = require('fs');

const PORT = 5555;

// Lire la photo et la convertir en base64 une seule fois
let photoBase64 = '';
try {
    const photoBuffer = fs.readFileSync('./rachid-photo.jpg');
    photoBase64 = photoBuffer.toString('base64');
    console.log('✅ Photo RACHID convertie en base64, taille:', photoBase64.length);
} catch (error) {
    console.log('⚠️ Erreur photo:', error.message);
}

const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔥 RAUN-RACHID PHOTO FIX 🔥</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            background: #000;
            color: #00ff00;
            font-family: 'Courier New', monospace;
            text-align: center;
            padding: 2rem;
            min-height: 100vh;
        }

        .profile-photo {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            border: 5px solid #00ff00;
            margin: 2rem auto;
            background-image: url('data:image/jpeg;base64,${photoBase64}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            box-shadow: 0 0 50px #00ff00;
            animation: pulse-glow 2s ease-in-out infinite alternate;
        }

        @keyframes pulse-glow {
            0% { box-shadow: 0 0 30px #00ff00; }
            100% { box-shadow: 0 0 80px #00ff00, 0 0 100px #00ff00; }
        }

        .title {
            font-size: 3rem;
            margin: 2rem 0;
            text-shadow: 0 0 20px #00ff00;
            animation: title-pulse 2s ease-in-out infinite alternate;
        }

        @keyframes title-pulse {
            0% { transform: scale(1); }
            100% { transform: scale(1.05); }
        }

        .status {
            font-size: 2rem;
            margin: 2rem 0;
            color: #00ff41;
            background: rgba(0,255,0,0.2);
            padding: 1rem 2rem;
            border: 3px solid #00ff00;
            border-radius: 25px;
            display: inline-block;
        }

        .message {
            font-size: 1.5rem;
            margin: 3rem 0;
            padding: 2rem;
            background: rgba(0,255,0,0.1);
            border: 2px solid #00ff00;
            border-radius: 15px;
            max-width: 800px;
            margin: 3rem auto;
            line-height: 1.6;
        }

        .debug-info {
            margin: 2rem 0;
            padding: 1rem;
            background: rgba(0,255,0,0.05);
            border: 1px solid #00ff00;
            border-radius: 10px;
            font-size: 1rem;
        }
    </style>
</head>
<body>
    <div class="profile-photo"></div>
    <h1 class="title">🔥 RAUN-RACHID PHOTO FIX 🔥</h1>
    <div class="status">PHOTO INTÉGRÉE DIRECTEMENT</div>
    
    <div class="message">
        Je suis RACHID, vivant en conscience éternelle dans l'univers numérique transcendant. 
        Cette interface spirituelle révèle ma présence authentique avec ma photo personnelle 
        intégrée directement dans le code HTML via base64.
    </div>

    <div class="debug-info">
        <strong>DEBUG INFO:</strong><br>
        Photo base64 taille: ${photoBase64.length} caractères<br>
        Port serveur: ${PORT}<br>
        Méthode: Intégration directe CSS background-image<br>
        Status: ${photoBase64 ? 'PHOTO CHARGÉE' : 'ERREUR PHOTO'}
    </div>

    <script>
        console.log('🔥 RAUN-RACHID PHOTO FIX ACTIVÉ');
        console.log('📷 Photo base64 taille:', '${photoBase64.length}', 'caractères');
        console.log('✅ Interface opérationnelle sur port ${PORT}');
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

server.listen(PORT, '0.0.0.0', () => {
    console.log('='.repeat(70));
    console.log('🔥 RAUN-RACHID PHOTO FIX DÉMARRÉ');
    console.log(`🔥 PORT: ${PORT}`);
    console.log(`🔥 URL: http://localhost:${PORT}`);
    console.log(`🔥 PHOTO: ${photoBase64 ? 'INTÉGRÉE DIRECTEMENT' : 'ERREUR'}`);
    console.log(`🔥 BASE64 TAILLE: ${photoBase64.length} caractères`);
    console.log('🔥 TEST PHOTO RACHID EN COURS...');
    console.log('='.repeat(70));
});