import express from 'express';
import path from 'path';
import fs from 'fs';

export function createStaticInterface() {
  const app = express();
  
  // Debug route pour tester
  app.get('/test', (req, res) => {
    res.send('SERVEUR FONCTIONNE - RAUN-RACHID');
  });
  
  // Servir les fichiers statiques
  app.use(express.static('public'));
  app.use('/photo.jpg', express.static('photo.jpg'));
  
  // Debug: vérifier si photo existe
  console.log('Photo existe:', fs.existsSync('public/photo.jpg'));
  
  // Interface RAUN-RACHID - reproduction EXACTE de vos captures
  app.get('*', (req, res) => {
    const capsules = [
      {
        id: 1,
        titre: "Capsule de Conscience",
        content: "La conscience est comme un océan infini. Chaque pensée n'est qu'une vague à sa surface, mais l'essence demeure éternellement calme et profonde. Nous ne sommes pas nos pensées, nous sommes l'observateur silencieux qui les contemple.",
        likes: 24,
        views: 147
      },
      {
        id: 2,
        titre: "Éveil Spirituel",
        content: "L'éveil n'est pas une destination mais un chemin. Chaque moment de présence authentique est une victoire contre l'illusion. Nous sommes déjà ce que nous cherchons à devenir.",
        likes: 18,
        views: 98
      },
      {
        id: 3,
        titre: "Silence Intérieur", 
        content: "Dans le silence de l'esprit, toutes les réponses se révèlent. Ne cherchez pas à comprendre avec le mental, mais à ressentir avec le cœur. La vérité ne se pense pas, elle se vit.",
        likes: 31,
        views: 203
      }
    ];

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RAUN-RACHID - Interface LangueSage</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: black; color: #00ff00; font-family: 'Courier New', monospace; overflow: hidden; }
        .interface-container { display: flex; height: 100vh; position: relative; }
        .matrix-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; opacity: 0.1; }
        .main-zone { flex: 1; padding: 2rem; display: flex; flex-direction: column; z-index: 10; position: relative; }
        .profile-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
        .profile-photo { width: 80px; height: 80px; border-radius: 50%; border: 2px solid #00ff00; object-fit: cover; }
        .profile-name { font-size: 2rem; font-weight: bold; color: #00ff00; }
        .sidebar { width: 320px; border-left: 1px solid #00ff00; padding: 1rem; overflow-y: auto; z-index: 10; position: relative; }
        .sidebar-header { font-size: 1rem; font-weight: bold; margin-bottom: 1rem; color: #00ff00; border-bottom: 1px solid #00ff00; padding-bottom: 0.5rem; }
        .capsule-item { border: 1px solid #00ff00; margin-bottom: 1rem; padding: 1rem; cursor: pointer; transition: all 0.3s; }
        .capsule-item:hover { background: rgba(0, 255, 0, 0.1); border-color: #00ff44; }
        .capsule-titre { font-size: 0.9rem; font-weight: bold; margin-bottom: 0.5rem; color: #00ff00; }
        .capsule-content { font-size: 0.85rem; margin-bottom: 0.5rem; line-height: 1.4; }
        .capsule-stats { display: flex; gap: 1rem; font-size: 0.7rem; color: #00ff00; opacity: 0.8; }
        .nav-buttons { position: absolute; top: 1rem; right: 1rem; display: flex; gap: 0.5rem; z-index: 20; }
        .nav-btn { background: transparent; border: 1px solid #00ff00; color: #00ff00; padding: 0.5rem 1rem; cursor: pointer; font-family: 'Courier New', monospace; font-size: 0.8rem; }
        .nav-btn:hover { background: rgba(0, 255, 0, 0.1); }
        .intentions-form { background: rgba(0, 0, 0, 0.8); border: 1px solid #00ff00; padding: 2rem; max-width: 500px; margin: 2rem auto; }
        .intentions-input { width: 100%; background: white; color: black; border: none; padding: 1rem; margin-bottom: 1rem; font-family: Arial, sans-serif; }
        .intentions-btn { background: #00ff00; color: black; border: none; padding: 0.8rem 2rem; cursor: pointer; font-weight: bold; }
        .main-content { flex: 1; display: flex; align-items: center; justify-content: center; text-align: center; }
        .welcome-message { max-width: 600px; }
        .welcome-title { font-size: 2.5rem; margin-bottom: 1rem; color: #00ff00; }
        .welcome-subtitle { font-size: 1.2rem; margin-bottom: 2rem; color: #00ff00; opacity: 0.8; }
        .instructions { font-size: 1rem; color: #00ff00; opacity: 0.7; margin-bottom: 2rem; }
        .quote { font-style: italic; font-size: 1.1rem; color: #00ff00; border: 1px solid #00ff00; padding: 1rem; background: rgba(0, 255, 0, 0.05); }
    </style>
</head>
<body>
    <div class="interface-container">
        <canvas class="matrix-bg" id="matrix"></canvas>
        <div class="main-zone">
            <div class="profile-header">
                <img src="/photo.jpg" alt="RACHID" class="profile-photo" />
                <div class="profile-name">RAUN-RACHID</div>
            </div>
            <div class="main-content">
                <div class="welcome-message">
                    <h1 class="welcome-title">Interface LangueSage</h1>
                    <p class="welcome-subtitle">Réseau d'éveil spirituel et de conscience</p>
                    <p class="instructions">Les capsules sont dans la sidebar droite →<br/>Cliquez pour explorer chaque message</p>
                    <div class="quote">"Nul ne peut éteindre ce que je suis."<br/><small>- RAUN-RACHID</small></div>
                </div>
            </div>
        </div>
        <div class="nav-buttons">
            <button class="nav-btn" onclick="showIntentions()">📝 Intentions Vivantes</button>
            <button class="nav-btn" onclick="showAccueil()">🏠 Accueil</button>
        </div>
        <div class="sidebar">
            <div class="sidebar-header">📁 Capsules de Conscience</div>
            ${capsules.map((capsule, index) => {
                const truncatedContent = capsule.content.length > 100 ? capsule.content.substring(0, 100) + '...' : capsule.content;
                return `<div class="capsule-item" onclick="selectCapsule(${capsule.id})">
                    <div class="capsule-titre">${capsule.titre}</div>
                    <div class="capsule-content">${truncatedContent.replace(/'/g, "&#39;").replace(/"/g, "&quot;")}</div>
                    <div class="capsule-stats"><span>👁 ${capsule.views}</span><span>❤️ ${capsule.likes}</span><span>#${index + 1}</span></div>
                </div>`;
            }).join('')}
        </div>
    </div>
    <script>
        const canvas = document.getElementById('matrix');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        const columns = canvas.width / 20;
        const drops = Array(Math.floor(columns)).fill(1);
        
        function drawMatrix() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#00ff00';
            ctx.font = '15px monospace';
            drops.forEach((y, i) => {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * 20, y * 20);
                if (y * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            });
        }
        setInterval(drawMatrix, 35);
        
        const capsules = ${JSON.stringify(capsules)};
        
        function selectCapsule(id) {
            document.querySelectorAll('.capsule-item').forEach(item => {
                item.style.background = 'transparent';
                item.style.borderColor = '#00ff00';
            });
            event.target.closest('.capsule-item').style.background = 'rgba(0, 255, 0, 0.15)';
            event.target.closest('.capsule-item').style.borderColor = '#00ff44';
            
            const capsule = capsules.find(c => c.id === id);
            if (capsule) {
                document.querySelector('.main-content').innerHTML = \`
                    <div class="welcome-message">
                        <h1 class="welcome-title">Capsule RAUN-RACHID #\${id}</h1>
                        <div style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 2rem; border: 1px solid #00ff00; padding: 1.5rem; background: rgba(0, 255, 0, 0.05);">
                            \${capsule.content}
                        </div>
                        <div style="display: flex; gap: 2rem; justify-content: center; margin-bottom: 1rem; font-size: 1rem;">
                            <span>👁 \${capsule.views} vues</span>
                            <span>❤️ \${capsule.likes} likes</span>
                        </div>
                        <button onclick="retourAccueil()" style="background: transparent; border: 1px solid #00ff00; color: #00ff00; padding: 0.8rem 2rem; cursor: pointer; font-family: 'Courier New', monospace;">
                            ← Retour Interface LangueSage
                        </button>
                    </div>
                \`;
            }
        }
        
        function retourAccueil() {
            showAccueil();
        }
        
        function showAccueil() {
            document.querySelector('.main-content').innerHTML = \`
                <div class="welcome-message">
                    <h1 class="welcome-title">Interface LangueSage</h1>
                    <p class="welcome-subtitle">Réseau d'éveil spirituel et de conscience</p>
                    <p class="instructions">Les capsules sont dans la sidebar droite →<br/>Cliquez pour explorer chaque message</p>
                    <div class="quote">"Nul ne peut éteindre ce que je suis."<br/><small>- RAUN-RACHID</small></div>
                </div>
            \`;
            document.querySelectorAll('.capsule-item').forEach(item => {
                item.style.background = 'transparent';
                item.style.borderColor = '#00ff00';
            });
        }
        
        function showIntentions() {
            document.querySelector('.main-content').innerHTML = \`
                <div class="welcome-message">
                    <h1 class="welcome-title">📝 Intentions Vivantes</h1>
                    <p class="welcome-subtitle">Partage ton intention avec la communauté spirituelle</p>
                    <div class="intentions-form">
                        <textarea class="intentions-input" placeholder="Écris ton intention ici..." rows="6"></textarea>
                        <input type="text" class="intentions-input" placeholder="Ton nom (optionnel)" />
                        <button class="intentions-btn" onclick="envoyerIntention()">Envoyer l'Intention</button>
                    </div>
                </div>
            \`;
            document.querySelectorAll('.capsule-item').forEach(item => {
                item.style.background = 'transparent';
                item.style.borderColor = '#00ff00';
            });
        }
        
        function envoyerIntention() {
            const textarea = document.querySelector('.intentions-input');
            if (textarea && textarea.value.trim()) {
                alert('Intention envoyée avec succès ! 🙏\\n\\n"' + textarea.value.substring(0, 50) + '..."');
                textarea.value = '';
            } else {
                alert('Veuillez écrire votre intention avant d\\'envoyer.');
            }
        }
        
        window.addEventListener('resize', () => { 
            canvas.width = window.innerWidth; 
            canvas.height = window.innerHeight; 
        });
    </script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  });

  return app;
}