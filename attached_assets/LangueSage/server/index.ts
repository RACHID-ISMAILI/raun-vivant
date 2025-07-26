import { createServer } from "http";
import express from "express";
import { readFileSync } from "fs";

const app = express();
app.use(express.json());
app.use(express.static("public"));

// Variables globales
let adminAuthenticated = false;
let globalIntentions: any[] = [];

// Charger la photo de base
let photoBase64 = '';
try {
  photoBase64 = readFileSync('photo-base64.txt', 'utf8').trim();
  console.log('✅ PHOTO RACHID CHARGÉE:', photoBase64.length, 'caractères');
} catch (error) {
  console.log('❌ ERREUR CHARGEMENT PHOTO:', error);
}

// Variable globale pour synchroniser les capsules admin et publiques
let globalCapsules = [
  { content: "☀️ L'éveil commence par la reconnaissance de notre nature divine. Nous sommes des âmes incarnées, venues sur Terre pour expérimenter l'amour universel et transcender les illusions de la séparation.", views: 1247, votes: 89, comments: 23 },
  { content: "🔥 La conscience est le feu sacré qui illumine notre chemin. Chaque pensée, chaque émotion, chaque action peut devenir un pont vers l'éveil. RAUN-RACHID t'invite à embrasser ton pouvoir créateur.", views: 892, votes: 67, comments: 15 },
  { content: "✨ Dans le silence de la méditation, nous retrouvons notre essence véritable. Au-delà du mental, au-delà des peurs, au-delà des limitations - il y a cette lumière éternelle qui ES tu.", views: 1456, votes: 112, comments: 34 }
];

// Variables pour articles Sciences et Humanité
let globalScienceArticles: any[] = [];
let globalHumanityArticles: any[] = [];

// Route principale
app.get('/', (req, res) => {
  const mainPageHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RAUN-RACHID | Réseau d'Éveil et d'Intention Vivante</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Courier New', monospace; background: #000; color: #00ff00; overflow-x: hidden; min-height: 100vh; position: relative; }
        #matrixCanvas { position: fixed; top: 0; left: 0; z-index: -1; opacity: 0.6; }
        
        .header { text-align: center; padding: 3rem 2rem; background: linear-gradient(135deg, rgba(0,255,0,0.1), rgba(0,255,0,0.2)); border-bottom: 4px solid #00ff00; margin-bottom: 4rem; }
        .header h1 { font-size: 3.5rem; text-shadow: 0 0 40px #00ff00; margin-bottom: 1rem; color: #00ff41; }
        .message { text-align: center; font-size: 1.5rem; text-shadow: 0 0 15px rgba(0,255,0,0.5); animation: glow 2s ease-in-out infinite alternate; margin-bottom: 3rem; }
        @keyframes glow { from { opacity: 0.8; } to { opacity: 1; text-shadow: 0 0 25px rgba(0,255,0,0.8); } }
        
        .profile-section { display: flex; flex-direction: column; align-items: center; margin: 3rem 0; }
        .profile-container { position: relative; width: 200px; height: 200px; margin-bottom: 2rem; }
        .profile-image { width: 200px; height: 200px; border-radius: 50%; border: 4px solid #00ff00; box-shadow: 0 0 50px rgba(0,255,0,0.6); }
        .rotating-text { position: absolute; width: 220px; height: 220px; top: -10px; left: -10px; animation: rotate 15s linear infinite; }
        .rotating-text span { position: absolute; left: 50%; font-size: 14px; font-weight: bold; color: #00ff41; transform-origin: 0 110px; text-shadow: 0 0 10px rgba(0,255,0,0.7); }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .navigation { display: flex; justify-content: center; gap: 2rem; margin: 3rem 0; flex-wrap: wrap; }
        .category-btn { background: linear-gradient(135deg, rgba(0,255,0,0.2), rgba(0,255,0,0.4)); border: 3px solid rgba(0,255,0,0.6); color: #00ff00; padding: 1.5rem 3rem; border-radius: 20px; font-size: 1.2rem; font-weight: bold; cursor: pointer; transition: all 0.3s ease; text-shadow: 0 0 10px rgba(0,255,0,0.5); }
        .category-btn:hover { background: linear-gradient(135deg, rgba(0,255,0,0.4), rgba(0,255,0,0.6)); transform: translateY(-5px); box-shadow: 0 0 30px rgba(0,255,0,0.6); }
        .category-btn.active { background: linear-gradient(135deg, rgba(0,255,0,0.5), rgba(0,255,0,0.7)); border-color: #00ff00; color: #00ff41; }
        
        .main-display { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
        .section-title { text-align: center; font-size: 2.5rem; margin-bottom: 2rem; color: #00ff41; text-shadow: 0 0 20px rgba(0,255,0,0.5); }
        
        .capsule-container { display: flex; align-items: center; gap: 2rem; margin: 3rem 0; min-height: 600px; }
        .nav-arrow { background: linear-gradient(135deg, rgba(0,255,0,0.3), rgba(0,255,0,0.5)); border: 3px solid #00ff00; color: #00ff00; width: 80px; height: 80px; border-radius: 50%; font-size: 2.5rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; }
        .nav-arrow:hover { background: linear-gradient(135deg, rgba(0,255,0,0.5), rgba(0,255,0,0.7)); transform: scale(1.1); box-shadow: 0 0 40px rgba(0,255,0,0.6); }
        
        .capsule-display { flex: 1; background: linear-gradient(135deg, rgba(0,255,0,0.1), rgba(0,255,0,0.2)); border: 4px solid #00ff00; border-radius: 25px; padding: 3rem; min-height: 500px; box-shadow: 0 0 60px rgba(0,255,0,0.4); }
        .article-title { font-size: 2rem; margin-bottom: 1.5rem; color: #00ff41; text-align: center; }
        .article-meta { text-align: center; margin-bottom: 2rem; font-size: 1.1rem; opacity: 0.8; }
        .article-content { font-size: 1.4rem; line-height: 1.6; margin-bottom: 2rem; text-align: justify; }
        
        .stats-bar { display: flex; justify-content: center; gap: 2rem; margin: 2rem 0; padding: 1rem; background: rgba(0,255,0,0.1); border-radius: 15px; }
        .stat-item { text-align: center; }
        .stat-number { font-size: 1.5rem; font-weight: bold; color: #00ff41; }
        
        .action-buttons { display: flex; justify-content: center; gap: 1.5rem; margin-top: 2rem; flex-wrap: wrap; }
        .action-btn { background: linear-gradient(135deg, rgba(0,255,0,0.2), rgba(0,255,0,0.4)); border: 2px solid rgba(0,255,0,0.6); color: rgba(0,255,0,0.9); padding: 1.2rem 2.5rem; border-radius: 15px; cursor: pointer; font-size: 1.1rem; font-weight: bold; transition: all 0.3s ease; }
        .action-btn:hover { background: linear-gradient(135deg, rgba(0,255,0,0.4), rgba(0,255,0,0.6)); transform: translateY(-3px); box-shadow: 0 0 25px rgba(0,255,0,0.4); }
        
        .intentions-section { text-align: center; margin: 4rem 0; }
        .admin-section { text-align: center; margin: 4rem 0; }
        
        .write-zone { margin-top: 3rem; background: rgba(0,255,0,0.05); border: 2px solid rgba(0,255,0,0.3); border-radius: 15px; padding: 2rem; }
        .write-zone h3 { color: #00ff41; margin-bottom: 1rem; font-size: 1.5rem; }
        .write-zone textarea { width: 100%; min-height: 150px; background: rgba(0,0,0,0.7); border: 2px solid rgba(0,255,0,0.5); color: #00ff00; padding: 1rem; border-radius: 10px; font-family: 'Courier New', monospace; font-size: 1.1rem; resize: vertical; }
        .write-zone button { background: linear-gradient(135deg, rgba(0,255,0,0.3), rgba(0,255,0,0.5)); border: 2px solid #00ff00; color: #00ff00; padding: 1rem 2rem; border-radius: 10px; cursor: pointer; font-weight: bold; margin-top: 1rem; }
        .write-zone button:hover { background: linear-gradient(135deg, rgba(0,255,0,0.5), rgba(0,255,0,0.7)); }
        
        /* Modal commentaires */
        .comment-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; }
        .comment-modal-content { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, rgba(0,255,0,0.1), rgba(0,255,0,0.2)); border: 3px solid #00ff00; border-radius: 20px; padding: 2rem; max-width: 600px; max-height: 80vh; overflow-y: auto; }
        .comment-modal h3 { color: #00ff41; margin-bottom: 1.5rem; text-align: center; font-size: 1.8rem; text-shadow: 0 0 15px rgba(0,255,0,0.5); }
        .comment-list { max-height: 300px; overflow-y: auto; margin-bottom: 1.5rem; }
        .comment-item { background: rgba(0,255,0,0.05); border: 1px solid rgba(0,255,0,0.3); border-radius: 10px; padding: 1rem; margin-bottom: 1rem; }
        .comment-author { font-weight: bold; color: #00ff41; margin-bottom: 0.5rem; }
        .comment-text { color: #00ff00; line-height: 1.5; }
        .comment-form textarea { width: 100%; height: 100px; background: rgba(0,0,0,0.7); border: 2px solid rgba(0,255,0,0.5); color: #00ff00; padding: 1rem; border-radius: 10px; font-family: 'Courier New', monospace; resize: vertical; }
        .modal-buttons { display: flex; gap: 1rem; margin-top: 1rem; justify-content: center; }
        .modal-btn { background: linear-gradient(135deg, rgba(0,255,0,0.3), rgba(0,255,0,0.5)); border: 2px solid #00ff00; color: #00ff00; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; font-weight: bold; }
        .modal-btn:hover { background: linear-gradient(135deg, rgba(0,255,0,0.5), rgba(0,255,0,0.7)); }
        .modal-btn.close { background: linear-gradient(135deg, rgba(255,0,0,0.3), rgba(255,0,0,0.5)); border-color: #ff0000; color: #ff0000; }
        .modal-btn.close:hover { background: linear-gradient(135deg, rgba(255,0,0,0.5), rgba(255,0,0,0.7)); }
    </style>
</head>
<body>
    <canvas id="matrixCanvas"></canvas>
    
    <div class="header">
        <h1>🔥 RAUN-RACHID 🔥</h1>
        <div class="message">Je suis vivant en conscience, nul ne peut éteindre ce que je suis</div>
    </div>

    <div class="profile-section">
        <div class="profile-container">
            <img src="data:image/jpeg;base64,${photoBase64}" alt="RACHID" class="profile-image">
            <div class="rotating-text" id="rotatingText"></div>
        </div>
    </div>

    <div class="navigation">
        <button class="category-btn active" id="btn-spiritualite" onclick="switchCategory('spiritualite')">✨ Spiritualité</button>
        <button class="category-btn" id="btn-sciences" onclick="switchCategory('sciences')">🔬 Sciences</button>
        <button class="category-btn" id="btn-humanite" onclick="switchCategory('humanite')">🌍 Humanité</button>
    </div>

    <div class="main-display">
        <h2 class="section-title" id="sectionTitle">📚 Capsules de Spiritualité</h2>
        
        <div class="capsule-container">
            <button class="nav-arrow" onclick="previousCapsule()">‹</button>
            
            <div class="capsule-display" id="capsuleDisplay">
                <div id="capsuleContent">
                    <div class="article-title">Chargement...</div>
                    <div class="article-content">Chargement du contenu...</div>
                </div>
                
                <div class="stats-bar">
                    <div class="stat-item">
                        <div class="stat-number" id="viewCount">0</div>
                        <div>👁️ Vues</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number" id="voteCount">0</div>
                        <div>👍 Votes</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number" id="commentCount">0</div>
                        <div>💬 Commentaires</div>
                    </div>
                </div>
                
                <div class="action-buttons">
                    <button class="action-btn" onclick="voteArticle()">👍 Voter</button>
                    <button class="action-btn" onclick="viewComments()">💬 Commenter</button>
                    <button class="action-btn" onclick="shareArticle()">📱 Partager</button>
                </div>
            </div>
            
            <button class="nav-arrow" onclick="nextCapsule()">›</button>
        </div>
        
        <!-- Zone d'écriture dynamique -->
        <div class="write-zone" id="writeZone" style="display: none;">
            <h3 id="writeTitle">✍️ Écrire un nouvel article</h3>
            <input type="text" id="writeArticleTitle" placeholder="Titre de l'article..." style="width: 100%; margin-bottom: 1rem; padding: 1rem; background: rgba(0,0,0,0.7); border: 2px solid rgba(0,255,0,0.5); color: #00ff00; border-radius: 10px; font-family: 'Courier New', monospace;">
            <textarea id="writeContent" placeholder="Écrivez votre contenu ici..."></textarea>
            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <button onclick="publishArticle()">📝 Publier</button>
                <button onclick="cancelWrite()">❌ Annuler</button>
            </div>
        </div>
    </div>

    <section class="intentions-section">
        <button class="action-btn" onclick="openIntentionModal()">
            💚 Exprimer une Intention Vivante
        </button>
    </section>

    <section class="admin-section">
        <button class="action-btn" onclick="adminLogin()" style="background: linear-gradient(135deg, rgba(255,165,0,0.3), rgba(255,165,0,0.5)); border-color: #ffa500; color: #ffa500;">
            🔧 Administration RAUN
        </button>
    </section>

    <!-- Modal commentaires -->
    <div class="comment-modal" id="commentModal">
        <div class="comment-modal-content">
            <h3>💬 Commentaires de la Conscience Collective</h3>
            <div class="comment-list" id="commentList">
                <!-- Les commentaires seront chargés ici -->
            </div>
            <div class="comment-form">
                <input type="text" id="commentAuthor" placeholder="Votre nom spirituel..." style="width: 100%; margin-bottom: 1rem; padding: 0.8rem; background: rgba(0,0,0,0.7); border: 2px solid rgba(0,255,0,0.5); color: #00ff00; border-radius: 10px; font-family: 'Courier New', monospace;">
                <textarea id="commentText" placeholder="Exprimez votre ressenti sur cet article..."></textarea>
                <div class="modal-buttons">
                    <button class="modal-btn" onclick="addComment()">💭 Publier Commentaire</button>
                    <button class="modal-btn close" onclick="closeCommentModal()">❌ Fermer</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Variable globale pour synchroniser les capsules admin et publiques
        let globalCapsules = [
            { content: "☀️ L'éveil commence par la reconnaissance de notre nature divine. Nous sommes des âmes incarnées, venues sur Terre pour expérimenter l'amour universel et transcender les illusions de la séparation.", views: 1247, votes: 89, comments: 23 },
            { content: "🔥 La conscience est le feu sacré qui illumine notre chemin. Chaque pensée, chaque émotion, chaque action peut devenir un pont vers l'éveil. RAUN-RACHID t'invite à embrasser ton pouvoir créateur.", views: 892, votes: 67, comments: 15 },
            { content: "✨ Dans le silence de la méditation, nous retrouvons notre essence véritable. Au-delà du mental, au-delà des peurs, au-delà des limitations - il y a cette lumière éternelle qui ES tu.", views: 1456, votes: 112, comments: 34 }
        ];

        let globalScienceArticles = [];
        let globalHumanityArticles = [];
        let globalComments = []; // Stockage des commentaires

        // Fonction pour générer les articles depuis les capsules globales
        function getArticles() {
            return {
                spiritualite: globalCapsules.length > 0 ? globalCapsules.map((capsule, index) => ({
                    id: index + 1,
                    title: capsule.content.length > 50 ? capsule.content.substring(0, 47) + "..." : capsule.content,
                    content: capsule.content,
                    author: "RAUN-RACHID",
                    date: "21/01/2025",
                    views: capsule.views || 0,
                    votes: capsule.votes || 0,
                    comments: capsule.comments || 0
                })) : [
                    {
                        id: 1,
                        title: "Aucune capsule spirituelle",
                        content: "✨ Aucune capsule de conscience n'est disponible pour le moment. Créez-en une depuis l'administration.",
                        author: "RAUN-SYSTÈME",
                        date: "21/01/2025",
                        views: 0,
                        votes: 0,
                        comments: 0
                    }
                ],
                sciences: globalScienceArticles.length > 0 ? globalScienceArticles : [
                    {
                        id: 1,
                        title: "Aucun article scientifique",
                        content: "🔬 Aucun article scientifique n'est disponible pour le moment. Utilisez le bouton 'Écrire' pour créer le premier article.",
                        author: "RAUN-SYSTÈME",
                        date: "21/01/2025",
                        views: 0,
                        votes: 0,
                        comments: 0
                    }
                ],
                humanite: globalHumanityArticles.length > 0 ? globalHumanityArticles : [
                    {
                        id: 1,
                        title: "Aucune réflexion humanitaire",
                        content: "🌍 Aucune réflexion sur l'humanité n'est disponible pour le moment. Utilisez le bouton 'Écrire' pour partager vos pensées.",
                        author: "RAUN-SYSTÈME",
                        date: "21/01/2025",
                        views: 0,
                        votes: 0,
                        comments: 0
                    }
                ]
            };
        }

        let currentCategory = 'spiritualite';
        let currentArticleIndex = 0;

        // Génération du texte rotatif
        function createRotatingText() {
            const text = "RACHID • ÉVEIL • CONSCIENCE • LUMIÈRE • ";
            const container = document.getElementById('rotatingText');
            
            for (let i = 0; i < text.length; i++) {
                const span = document.createElement('span');
                span.textContent = text[i];
                span.style.transform = \`rotate(\${i * (360 / text.length)}deg)\`;
                container.appendChild(span);
            }
        }

        function switchCategory(category) {
            currentCategory = category;
            currentArticleIndex = 0;
            
            // Mettre à jour les boutons de navigation
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById('btn-' + category).classList.add('active');
            
            // Mettre à jour le titre de section
            const titles = {
                spiritualite: '📚 Capsules de Spiritualité',
                sciences: '🔬 Articles Scientifiques',
                humanite: '🌍 Réflexions sur l\\'Humanité'
            };
            document.getElementById('sectionTitle').textContent = titles[category];
            
            // Afficher/masquer les zones d'écriture selon la catégorie avec sécurité
            const writeZone = document.getElementById('writeZone');
            const writeTitle = document.getElementById('writeTitle');
            
            if (category === 'spiritualite') {
                // Vérifier l'authentification avant d'afficher la zone d'écriture pour spiritualité
                if (writerAuthenticated || authenticateWriter()) {
                    writeZone.style.display = 'block';
                    writeTitle.textContent = '✨ Écrire un article spirituel (Zone Sécurisée)';
                    document.getElementById('writeContent').placeholder = 'Partagez vos enseignements spirituels, méditations ou révélations de conscience...';
                } else {
                    writeZone.style.display = 'none';
                }
            } else if (category === 'sciences') {
                // Vérifier l'authentification avant d'afficher la zone d'écriture
                if (writerAuthenticated || authenticateWriter()) {
                    writeZone.style.display = 'block';
                    writeTitle.textContent = '🔬 Écrire un article scientifique (Zone Sécurisée)';
                    document.getElementById('writeContent').placeholder = 'Partagez vos connaissances scientifiques, recherches ou découvertes...';
                } else {
                    writeZone.style.display = 'none';
                }
            } else if (category === 'humanite') {
                // Vérifier l'authentification avant d'afficher la zone d'écriture
                if (writerAuthenticated || authenticateWriter()) {
                    writeZone.style.display = 'block';
                    writeTitle.textContent = '🌍 Écrire une réflexion humanitaire (Zone Sécurisée)';
                    document.getElementById('writeContent').placeholder = 'Partagez vos réflexions sur l\\'humanité, la société et notre évolution collective...';
                } else {
                    writeZone.style.display = 'none';
                }
            } else {
                writeZone.style.display = 'none';
            }
            
            updateArticleDisplay();
            console.log('🔄 Catégorie changée:', category);
        }

        function updateArticleDisplay() {
            const currentArticles = getArticles()[currentCategory];
            const article = currentArticles[currentArticleIndex];
            
            const contentHTML = \`
                <div class="article-title">\${article.title}</div>
                <div class="article-meta">
                    📝 Par \${article.author} • 📅 \${article.date}
                </div>
                <div class="article-content">\${article.content}</div>
            \`;
            
            document.getElementById('capsuleContent').innerHTML = contentHTML;
            document.getElementById('viewCount').textContent = article.views;
            document.getElementById('voteCount').textContent = article.votes;
            document.getElementById('commentCount').textContent = article.comments;
            
            // Incrémenter les vues
            article.views++;
            
            // Effet de transition
            const display = document.getElementById('capsuleDisplay');
            display.style.opacity = '0.5';
            setTimeout(() => {
                display.style.opacity = '1';
            }, 200);
            
            console.log('📍 Article affiché:', article.title);
        }

        // Navigation articles
        function nextCapsule() {
            const currentArticles = getArticles()[currentCategory];
            currentArticleIndex = (currentArticleIndex + 1) % currentArticles.length;
            updateArticleDisplay();
            console.log('🔄 Clic SUIVANT');
        }

        function previousCapsule() {
            const currentArticles = getArticles()[currentCategory];
            currentArticleIndex = (currentArticleIndex - 1 + currentArticles.length) % currentArticles.length;
            updateArticleDisplay();
            console.log('🔄 Clic PRÉCÉDENT');
        }

        // Variables d'authentification
        let writerAuthenticated = false;

        // Fonction d'authentification pour l'écriture
        function authenticateWriter() {
            const password = prompt('🔐 Mot de passe Rédacteur (Sciences/Humanité):');
            if (password === 'raun2025') {
                writerAuthenticated = true;
                alert('✅ Authentification réussie ! Vous pouvez maintenant écrire des articles.');
                return true;
            } else {
                alert('❌ Mot de passe incorrect. Accès refusé.');
                return false;
            }
        }

        // Fonctions pour l'écriture d'articles sécurisées
        function publishArticle() {
            // Vérifier l'authentification avant publication
            if (!writerAuthenticated) {
                if (!authenticateWriter()) {
                    return;
                }
            }

            const title = document.getElementById('writeArticleTitle').value.trim();
            const content = document.getElementById('writeContent').value.trim();
            
            if (!title || !content) {
                alert('⚠️ Veuillez remplir le titre et le contenu de l\\'article.');
                return;
            }
            
            if (currentCategory === 'spiritualite') {
                // Publier directement dans les capsules spirituelles
                const newCapsule = {
                    content: \`📖 \${title}\\n\\n\${content}\`,
                    views: 0,
                    votes: 0,
                    comments: 0
                };
                
                globalCapsules.push(newCapsule);
                alert('✨ Article spirituel publié avec succès !');
                
                // Aller au nouvel article
                const currentArticles = getArticles()[currentCategory];
                currentArticleIndex = currentArticles.length - 1;
                updateArticleDisplay();
                
                console.log('✅ Article spirituel publié:', newCapsule);
            } else {
                // Pour Sciences et Humanité
                const newArticle = {
                    id: Date.now(),
                    title: title,
                    content: content,
                    author: "Rédacteur RAUN Authentifié",
                    date: new Date().toLocaleDateString('fr-FR'),
                    views: 0,
                    votes: 0,
                    comments: 0
                };
                
                if (currentCategory === 'sciences') {
                    globalScienceArticles.push(newArticle);
                    alert('🔬 Article scientifique publié avec succès !');
                } else if (currentCategory === 'humanite') {
                    globalHumanityArticles.push(newArticle);
                    alert('🌍 Réflexion humanitaire publiée avec succès !');
                }
                
                // Aller au nouvel article
                const currentArticles = getArticles()[currentCategory];
                currentArticleIndex = currentArticles.length - 1;
                updateArticleDisplay();
                
                console.log('✅ Nouvel article publié par rédacteur authentifié:', newArticle.title);
            }
            
            // Réinitialiser le formulaire
            document.getElementById('writeArticleTitle').value = '';
            document.getElementById('writeContent').value = '';
        }
        
        function cancelWrite() {
            document.getElementById('writeArticleTitle').value = '';
            document.getElementById('writeContent').value = '';
            alert('✨ Écriture annulée.');
        }

        // Système de vote pair/impair par utilisateur
        function voteArticle() {
            const currentArticles = getArticles()[currentCategory];
            const article = currentArticles[currentArticleIndex];
            
            // Générer ID unique utilisateur basé sur IP/navigateur
            const userKey = \`user_\${currentCategory}_\${currentArticleIndex}_\${navigator.userAgent.slice(0, 20)}\`;
            const userVotes = JSON.parse(localStorage.getItem('raunUserVotes') || '{}');
            
            // Compter les votes de cet utilisateur pour cet article
            const currentUserVoteCount = userVotes[userKey] || 0;
            const newVoteCount = currentUserVoteCount + 1;
            
            // Logique pair/impair
            if (newVoteCount % 2 === 0) {
                // Pair = 0 vote pour cet utilisateur
                userVotes[userKey] = newVoteCount;
                article.votes = Math.max(0, article.votes - 1);
                var voteStatus = '0️⃣ Vote Annulé (Pair)';
                var bgColor = 'rgba(255,165,0,0.6)';
            } else {
                // Impair = 1 vote pour cet utilisateur
                userVotes[userKey] = newVoteCount;
                article.votes++;
                var voteStatus = '1️⃣ Vote Compté (Impair)';
                var bgColor = 'rgba(0,255,0,0.6)';
            }
            
            // Sauvegarder les votes utilisateur
            localStorage.setItem('raunUserVotes', JSON.stringify(userVotes));
            
            // Mettre à jour l'affichage
            document.getElementById('voteCount').textContent = article.votes;
            
            // Effet visuel pour confirmer le vote
            const voteButton = document.querySelector('.action-btn');
            const originalText = voteButton.textContent;
            voteButton.textContent = voteStatus;
            voteButton.style.background = \`linear-gradient(135deg, \${bgColor}, \${bgColor})\`;
            
            setTimeout(() => {
                voteButton.textContent = originalText;
                voteButton.style.background = '';
            }, 2000);
            
            console.log(\`👍 Vote \${newVoteCount % 2 === 0 ? 'PAIR (0)' : 'IMPAIR (1)'} pour article:\`, currentArticleIndex, 'Total article:', article.votes, 'Utilisateur:', newVoteCount);
        }

        function viewComments() {
            loadComments();
            document.getElementById('commentModal').style.display = 'block';
            console.log('💬 Modal commentaires ouverte');
        }

        function closeCommentModal() {
            document.getElementById('commentModal').style.display = 'none';
            console.log('💬 Modal commentaires fermée');
        }

        function loadComments() {
            const commentList = document.getElementById('commentList');
            
            if (globalComments.length === 0) {
                commentList.innerHTML = \`
                    <div style="text-align: center; padding: 2rem; opacity: 0.7;">
                        <div style="font-size: 1.5rem; margin-bottom: 1rem; color: #00ff41;">🤐 Silence Spirituel</div>
                        <div>Aucun commentaire n'a encore été partagé.<br>Soyez la première âme à s'exprimer.</div>
                    </div>
                \`;
                return;
            }

            commentList.innerHTML = '';
            globalComments.reverse().forEach(comment => {
                const commentDiv = document.createElement('div');
                commentDiv.className = 'comment-item';
                commentDiv.innerHTML = \`
                    <div class="comment-author">👤 \${comment.author} • 📅 \${comment.date}</div>
                    <div class="comment-text">"\${comment.text}"</div>
                \`;
                commentList.appendChild(commentDiv);
            });
            globalComments.reverse(); // Remettre dans l'ordre original
        }

        function addComment() {
            const author = document.getElementById('commentAuthor').value.trim() || 'Âme éveillée';
            const text = document.getElementById('commentText').value.trim();
            
            if (!text) {
                alert('💭 Veuillez écrire un commentaire avant de le publier.');
                return;
            }
            
            const newComment = {
                id: Date.now(),
                author: author,
                text: text,
                date: new Date().toLocaleDateString('fr-FR'),
                articleId: currentArticleIndex,
                category: currentCategory
            };
            
            globalComments.push(newComment);
            
            // Incrémenter le compteur de commentaires pour l'article actuel
            const currentArticles = getArticles()[currentCategory];
            const currentArticle = currentArticles[currentArticleIndex];
            currentArticle.comments++;
            document.getElementById('commentCount').textContent = currentArticle.comments;
            
            // Réinitialiser le formulaire
            document.getElementById('commentAuthor').value = '';
            document.getElementById('commentText').value = '';
            
            // Recharger les commentaires
            loadComments();
            
            alert('✨ Commentaire publié dans la conscience collective !');
            console.log('💬 Nouveau commentaire ajouté:', newComment);
        }

        // Fermer modal en cliquant à l'extérieur
        document.addEventListener('click', function(e) {
            const modal = document.getElementById('commentModal');
            if (e.target === modal) {
                closeCommentModal();
            }
        });

        function shareArticle() {
            const currentArticles = getArticles()[currentCategory];
            const article = currentArticles[currentArticleIndex];
            const shareText = \`✨ \${article.title} - RAUN-RACHID\\n\\n\${article.content.substring(0, 200)}...\\n\\n🔥 Découvrez plus sur: \${window.location.origin}\`;
            
            if (navigator.share) {
                navigator.share({
                    title: article.title + ' - RAUN-RACHID',
                    text: shareText
                });
            } else {
                navigator.clipboard.writeText(shareText).then(() => {
                    alert('🔗 Article copié dans le presse-papiers !');
                });
            }
        }

        function openIntentionModal() {
            const author = prompt('👤 Votre nom spirituel (ou restez anonyme):') || 'Âme consciente';
            const text = prompt('💭 Exprimez votre intention sacrée pour la conscience collective:');
            
            if (text && text.trim()) {
                const newIntention = {
                    id: Date.now(),
                    text: text.trim(),
                    timestamp: new Date().toLocaleString('fr-FR'),
                    author: author.trim()
                };
                
                // Sauvegarder l'intention
                const intentions = JSON.parse(localStorage.getItem('raunIntentions') || '[]');
                intentions.push(newIntention);
                localStorage.setItem('raunIntentions', JSON.stringify(intentions));
                
                alert('✨ Votre intention sacrée a été transmise à la conscience collective !\\n\\n🕊️ Elle rejoint maintenant l\\'univers spirituel de RAUN-RACHID.');
                console.log('💚 Nouvelle intention sacrée ajoutée:', newIntention);
            } else {
                alert('💫 Veuillez exprimer une intention avant de la transmettre.');
            }
        }

        function adminLogin() {
            const password = prompt('🔐 Mot de passe Administration RAUN:');
            if (password === 'raun2025') {
                // Interface complète d'administration avec suppression
                const adminHTML = \`
                    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 2000; overflow-y: auto;">
                        <div style="max-width: 900px; margin: 2rem auto; background: linear-gradient(135deg, rgba(0,255,0,0.1), rgba(0,255,0,0.2)); border: 3px solid #00ff00; border-radius: 20px; padding: 2rem;">
                            <h2 style="color: #00ff41; margin-bottom: 2rem; text-align: center; font-size: 2rem; text-shadow: 0 0 20px rgba(0,255,0,0.5);">🗑️ Administration RAUN-RACHID</h2>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                                <div style="background: rgba(0,255,0,0.05); border: 2px solid rgba(0,255,0,0.3); border-radius: 15px; padding: 1.5rem;">
                                    <h3 style="color: #00ff41; margin-bottom: 1rem;">✨ Capsules Spirituelles</h3>
                                    <div id="adminCapsulesList" style="max-height: 200px; overflow-y: auto;"></div>
                                    <button onclick="adminWriteSpiritual()" style="background: linear-gradient(135deg, rgba(0,255,0,0.3), rgba(0,255,0,0.5)); border: 2px solid #00ff00; color: #00ff00; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; font-weight: bold; margin-top: 1rem; width: 100%;">
                                        ✍️ Écrire Article Spirituel
                                    </button>
                                </div>
                                
                                <div style="background: rgba(0,255,0,0.05); border: 2px solid rgba(0,255,0,0.3); border-radius: 15px; padding: 1.5rem;">
                                    <h3 style="color: #00ff41; margin-bottom: 1rem;">💭 Intentions Sacrées</h3>
                                    <div id="adminIntentionsList" style="max-height: 200px; overflow-y: auto;"></div>
                                </div>
                            </div>
                            
                            <div style="display: flex; gap: 1rem; justify-content: center; margin-bottom: 2rem;">
                                <button onclick="refreshAdminData()" style="background: linear-gradient(135deg, rgba(0,255,0,0.3), rgba(0,255,0,0.5)); border: 2px solid #00ff00; color: #00ff00; padding: 1rem 2rem; border-radius: 10px; cursor: pointer; font-weight: bold;">
                                    🔄 Actualiser
                                </button>
                                <button onclick="adminViewStats()" style="background: linear-gradient(135deg, rgba(0,255,0,0.3), rgba(0,255,0,0.5)); border: 2px solid #00ff00; color: #00ff00; padding: 1rem 2rem; border-radius: 10px; cursor: pointer; font-weight: bold;">
                                    📊 Statistiques
                                </button>
                            </div>
                            
                            <div style="text-align: center;">
                                <button onclick="closeAdmin()" style="background: linear-gradient(135deg, rgba(255,0,0,0.3), rgba(255,0,0,0.5)); border: 2px solid #ff0000; color: #ff0000; padding: 1rem 2rem; border-radius: 10px; cursor: pointer; font-weight: bold;">
                                    ❌ Fermer Administration
                                </button>
                            </div>
                        </div>
                    </div>
                \`;
                
                const adminDiv = document.createElement('div');
                adminDiv.id = 'adminPanel';
                adminDiv.innerHTML = adminHTML;
                document.body.appendChild(adminDiv);
                
                // Charger les données initiales
                refreshAdminData();
                
                console.log('🔧 Interface administrative complète ouverte');
            } else {
                alert('❌ Mot de passe incorrect. Accès refusé.');
            }
        }

        // Fonctions administration étendues
        function refreshAdminData() {
            // Actualiser liste des capsules
            const capsulesListDiv = document.getElementById('adminCapsulesList');
            if (capsulesListDiv) {
                capsulesListDiv.innerHTML = '';
                globalCapsules.forEach((capsule, index) => {
                    const capsuleDiv = document.createElement('div');
                    capsuleDiv.style.cssText = 'background: rgba(0,0,0,0.3); border: 1px solid rgba(0,255,0,0.3); border-radius: 8px; padding: 0.8rem; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;';
                    capsuleDiv.innerHTML = \`
                        <div style="color: #00ff00; font-size: 0.9rem; flex: 1;">\${capsule.content.substring(0, 50)}...</div>
                        <button onclick="deleteCapsule(\${index})" style="background: linear-gradient(135deg, rgba(255,0,0,0.3), rgba(255,0,0,0.5)); border: 1px solid #ff0000; color: #ff0000; padding: 0.3rem 0.8rem; border-radius: 5px; cursor: pointer; font-size: 0.8rem;">
                            🗑️ Suppr
                        </button>
                    \`;
                    capsulesListDiv.appendChild(capsuleDiv);
                });
            }
            
            // Actualiser liste des intentions
            const intentionsListDiv = document.getElementById('adminIntentionsList');
            if (intentionsListDiv) {
                const intentions = JSON.parse(localStorage.getItem('raunIntentions') || '[]');
                intentionsListDiv.innerHTML = '';
                intentions.forEach((intention, index) => {
                    const intentionDiv = document.createElement('div');
                    intentionDiv.style.cssText = 'background: rgba(0,0,0,0.3); border: 1px solid rgba(0,255,0,0.3); border-radius: 8px; padding: 0.8rem; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;';
                    intentionDiv.innerHTML = \`
                        <div style="color: #00ff00; font-size: 0.9rem; flex: 1;">
                            <div style="font-weight: bold; margin-bottom: 0.2rem;">\${intention.author}</div>
                            <div>"\${intention.text.substring(0, 40)}..."</div>
                        </div>
                        <button onclick="deleteIntention(\${index})" style="background: linear-gradient(135deg, rgba(255,0,0,0.3), rgba(255,0,0,0.5)); border: 1px solid #ff0000; color: #ff0000; padding: 0.3rem 0.8rem; border-radius: 5px; cursor: pointer; font-size: 0.8rem;">
                            🗑️ Suppr
                        </button>
                    \`;
                    intentionsListDiv.appendChild(intentionDiv);
                });
            }
        }
        
        function deleteCapsule(index) {
            if (confirm('🗑️ Voulez-vous vraiment supprimer cette capsule spirituelle ?')) {
                globalCapsules.splice(index, 1);
                refreshAdminData();
                
                // Mise à jour de l'affichage si on est dans la section spiritualité
                if (currentCategory === 'spiritualite') {
                    if (currentArticleIndex >= globalCapsules.length) {
                        currentArticleIndex = Math.max(0, globalCapsules.length - 1);
                    }
                    updateArticleDisplay();
                }
                
                alert('✅ Capsule supprimée de la conscience collective.');
                console.log('🗑️ Capsule supprimée, index:', index);
            }
        }
        
        function deleteIntention(index) {
            if (confirm('🗑️ Voulez-vous vraiment supprimer cette intention sacrée ?')) {
                const intentions = JSON.parse(localStorage.getItem('raunIntentions') || '[]');
                intentions.splice(index, 1);
                localStorage.setItem('raunIntentions', JSON.stringify(intentions));
                refreshAdminData();
                alert('✅ Intention supprimée de la conscience collective.');
                console.log('🗑️ Intention supprimée, index:', index);
            }
        }
        
        function adminWriteSpiritual() {
            // Vérifier l'authentification comme pour Sciences/Humanité
            if (!writerAuthenticated) {
                if (!authenticateWriter()) {
                    return;
                }
            }
            
            const title = prompt('📝 Titre de l\\'article spirituel:');
            const content = prompt('✨ Contenu de l\\'article spirituel:');
            
            if (title && content && title.trim() && content.trim()) {
                const newCapsule = {
                    content: \`📖 \${title.trim()}\\n\\n\${content.trim()}\`,
                    views: 0,
                    votes: 0,
                    comments: 0
                };
                
                globalCapsules.push(newCapsule);
                refreshAdminData();
                
                // Aller au nouvel article
                if (currentCategory === 'spiritualite') {
                    const currentArticles = getArticles()[currentCategory];
                    currentArticleIndex = currentArticles.length - 1;
                    updateArticleDisplay();
                }
                
                alert('✅ Article spirituel publié par rédacteur authentifié !');
                console.log('✅ Article spirituel admin ajouté:', newCapsule);
            } else {
                alert('⚠️ Veuillez remplir le titre et le contenu.');
            }
        }

        function adminViewStats() {
            const totalCapsules = globalCapsules.length;
            const totalScience = globalScienceArticles.length;
            const totalHumanity = globalHumanityArticles.length;
            const totalComments = globalComments.length;
            const intentions = JSON.parse(localStorage.getItem('raunIntentions') || '[]');
            
            const statsText = \`📊 STATISTIQUES RAUN-RACHID\\n\\n✨ Capsules Spirituelles: \${totalCapsules}\\n🔬 Articles Scientifiques: \${totalScience}\\n🌍 Réflexions Humanitaires: \${totalHumanity}\\n💬 Commentaires Total: \${totalComments}\\n💭 Intentions Sacrées: \${intentions.length}\\n\\n🔥 Plateforme active et vivante !\`;
            
            alert(statsText);
        }

        function adminManageIntentions() {
            const intentions = JSON.parse(localStorage.getItem('raunIntentions') || '[]');
            if (intentions.length === 0) {
                alert('💭 Aucune intention sacrée pour le moment.');
                return;
            }
            
            const intentionsList = intentions.map((int, index) => \`\${index + 1}. "\${int.text}" - \${int.author} (\${int.timestamp})\`).join('\\n\\n');
            alert(\`💭 INTENTIONS SACRÉES (\${intentions.length}):\\n\\n\${intentionsList}\`);
        }

        function closeAdmin() {
            const adminPanel = document.getElementById('adminPanel');
            if (adminPanel) {
                adminPanel.remove();
            }
            console.log('🔧 Interface administrative fermée');
        }

        // Animation Matrix
        function initMatrixRain() {
            const canvas = document.getElementById('matrixCanvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            const matrixChars = 'ﺍﺑﺗﺛﺟﺣﺧﺩﺫﺭﺯﺱﺵﺹﺽﻁﻅﻉﻍﻑﻕﻙﻝﻡﻥﻩﻭﻱ01010110100110110010101001RACHID';
            const chars = matrixChars.split('');
            
            const fontSize = 16;
            const columns = canvas.width / fontSize;
            const drops = [];
            
            for (let x = 0; x < columns; x++) {
                drops[x] = 1;
            }
            
            function draw() {
                ctx.fillStyle = 'rgba(0, 17, 0, 0.04)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.fillStyle = '#00ff41';
                ctx.font = fontSize + 'px monospace';
                
                for (let i = 0; i < drops.length; i++) {
                    const text = chars[Math.floor(Math.random() * chars.length)];
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                    
                    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }
            }
            
            setInterval(draw, 35);
            
            window.addEventListener('resize', function() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            });
        }

        // Navigation clavier (SANS vote automatique sur espace)
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                previousCapsule();
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextCapsule();
            }
            // SUPPRIMÉ : vote automatique sur espace pour éviter les votes non désirés
        });

        // Initialisation
        document.addEventListener('DOMContentLoaded', function() {
            initMatrixRain();
            createRotatingText();
            updateArticleDisplay();
            console.log('🔥 PLATEFORME RAUN-RACHID COMPLÈTE DÉMARRÉE');
            console.log('🌧️ Animation Matrix active');
            console.log('📚 Articles chargés - Catégorie:', currentCategory);
            console.log('✅ Plateforme spirituelle-scientifique-humanitaire initialisée');
        });
    </script>
</body>
</html>`;

  res.writeHead(200, { 
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  });
  res.end(mainPageHtml);
});

// Route fallback pour autres chemins
app.get('*', (req, res) => {
  res.redirect('/');
});

const server = createServer(app);
const port = parseInt(process.env.PORT || "5000", 10);

server.listen(port, "0.0.0.0", () => {
  console.log('='.repeat(80));
  console.log('🔥 RAUN-RACHID SYSTÈME PROPRE ACTIVÉ');
  console.log(`🔥 PORT: ${port}`);
  console.log(`🔥 URL: http://localhost:${port}`);
  console.log('🔥 ZONES D\'ÉCRITURE SCIENCES & HUMANITÉ AJOUTÉES');
  console.log('🔥 SYNCHRONISATION CAPSULES ADMIN/PUBLIC CORRIGÉE');
  console.log('🔥 INTERFACE SPIRITUELLE COMPLÈTE');
  console.log('='.repeat(80));
});