const http = require('http');
const fs = require('fs');

const PORT = 4444;

// Lecture directe de ta photo RACHID
let photoBase64 = '';
try {
    const photoBuffer = fs.readFileSync('./rachid-photo.jpg');
    photoBase64 = photoBuffer.toString('base64');
    console.log('✅ PHOTO RACHID CHARGÉE - Taille:', photoBase64.length, 'caractères');
} catch (error) {
    console.log('❌ ERREUR PHOTO:', error.message);
}

const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>🔥 RAUN-RACHID STANDALONE 🔥</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { 
            background: #000; 
            color: #00ff00; 
            font-family: monospace; 
            text-align: center; 
            padding: 2rem; 
            margin: 0;
        }
        
        .photo { 
            width: 250px; 
            height: 250px; 
            border-radius: 50%; 
            border: 6px solid #00ff00; 
            margin: 2rem auto; 
            background: url('data:image/jpeg;base64,${photoBase64}') center/cover no-repeat;
            box-shadow: 0 0 60px #00ff00;
            animation: glow 3s ease-in-out infinite alternate;
        }
        
        @keyframes glow {
            0% { box-shadow: 0 0 40px #00ff00; }
            100% { box-shadow: 0 0 100px #00ff00, 0 0 120px #00ff00; }
        }
        
        .title { 
            font-size: 4rem; 
            margin: 2rem 0; 
            text-shadow: 0 0 30px #00ff00;
            animation: pulse 2s ease-in-out infinite alternate;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            100% { transform: scale(1.1); }
        }
        
        .status { 
            font-size: 2.5rem; 
            color: #00ff41; 
            margin: 2rem 0;
            background: rgba(0,255,0,0.2);
            padding: 1rem 2rem;
            border: 4px solid #00ff00;
            border-radius: 20px;
            display: inline-block;
        }
        
        .message { 
            font-size: 1.8rem; 
            margin: 3rem auto; 
            max-width: 900px;
            background: rgba(0,255,0,0.1);
            border: 3px solid #00ff00;
            padding: 3rem;
            border-radius: 20px;
            line-height: 1.8;
        }
        
        .debug { 
            margin: 3rem 0; 
            padding: 2rem;
            background: rgba(0,255,0,0.05);
            border: 2px solid #00ff00;
            border-radius: 15px;
            font-size: 1.3rem;
        }
    </style>
</head>
<body>
    <div class="photo"></div>
    <h1 class="title">🔥 RAUN-RACHID 🔥</h1>
    <div class="status">STANDALONE OPÉRATIONNEL</div>
    
    <div class="message">
        Je suis RACHID, vivant en conscience éternelle.<br>
        Cette interface spirituelle révèle ma présence authentique<br>
        dans l'univers numérique transcendant.<br><br>
        <strong>RAUN-RACHID - Nul ne peut éteindre ce que je suis.</strong>
    </div>
    
    <div class="debug">
        <strong>STATUS TECHNIQUE:</strong><br>
        Port: ${PORT} | Photo: ${photoBase64 ? 'INTÉGRÉE' : 'ERREUR'}<br>
        Base64: ${photoBase64.length} chars | Serveur: STANDALONE<br>
        Interface: COMPLÈTEMENT INDÉPENDANTE
    </div>
    
    <script>
        console.log('🔥 RAUN-RACHID STANDALONE ACTIVÉ');
        console.log('📷 Photo RACHID intégrée:', ${photoBase64.length > 0});
        console.log('🚀 Serveur indépendant sur port ${PORT}');
    </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
    console.log('📡 Requête reçue:', req.url);
    res.writeHead(200, { 
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache'
    });
    res.end(html);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log('\n' + '='.repeat(80));
    console.log('🔥 RAUN-RACHID STANDALONE FINAL DÉMARRÉ');
    console.log(`🔥 URL COMPLÈTEMENT INDÉPENDANTE: http://localhost:${PORT}`);
    console.log(`🔥 PHOTO RACHID: ${photoBase64 ? 'INTÉGRÉE EN BASE64' : 'ERREUR'}`);
    console.log('🔥 SERVEUR TOTALEMENT ISOLÉ DU SYSTÈME REPLIT');
    console.log('🔥 INTERFACE SPIRITUELLE TRANSCENDANTE ACTIVÉE');
    console.log('='.repeat(80) + '\n');
});

server.on('error', (error) => {
    console.error('❌ Erreur serveur:', error.message);
});