import express from "express";
import { createServer } from "http";
import { readFileSync } from "fs";

const app = express();

// Middleware pour parser JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Charger la photo RACHID en base64
let photoBase64 = '';
try {
  const photoBuffer = readFileSync('./rachid-photo.jpg');
  photoBase64 = photoBuffer.toString('base64');
  console.log('✅ PHOTO RACHID CHARGÉE:', photoBase64.length, 'caractères');
} catch (error) {
  console.log('❌ Erreur photo RACHID:', error);
}



// Interface RAUN-RACHID complète selon cahier des charges
const raunInterface = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔥 RAUN-RACHID - Réseau d'Éveil et d'Intention Vivante 🔥</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            background: linear-gradient(135deg, #001100, #002200, #001100);
            color: #00ff00;
            font-family: 'Courier New', monospace;
            overflow-x: hidden;
            position: relative;
        }

        /* Pluie Matrix Canvas */
        #matrixCanvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.3;
            pointer-events: none;
        }

        /* Message défilant sacré en haut */
        .sacred-message {
            position: fixed;
            top: 0;
            width: 100%;
            background: rgba(0,255,0,0.1);
            border-bottom: 2px solid #00ff00;
            padding: 15px 0;
            text-align: center;
            font-size: 1.4rem;
            font-weight: bold;
            z-index: 1000;
            animation: sacred-pulse 3s ease-in-out infinite alternate;
            text-shadow: 0 0 20px #00ff00;
        }

        @keyframes sacred-pulse {
            0% { background: rgba(0,255,0,0.1); }
            100% { background: rgba(0,255,0,0.3); }
        }

        /* Profil circulaire avec photo et texte rotatif */
        .profile-container {
            position: fixed;
            top: 80px;
            left: 30px;
            z-index: 999;
        }

        .profile-photo {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            border: 4px solid #00ff00;
            background: url('data:image/jpeg;base64,${photoBase64}') center/cover no-repeat;
            box-shadow: 0 0 40px #00ff00;
            animation: profile-glow 4s ease-in-out infinite alternate;
        }

        @keyframes profile-glow {
            0% { box-shadow: 0 0 30px #00ff00; }
            100% { box-shadow: 0 0 60px #00ff00, 0 0 80px #00ff00; }
        }

        .rotating-text {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 180px;
            height: 180px;
            transform: translate(-50%, -50%);
            animation: rotate-text 20s linear infinite;
        }

        @keyframes rotate-text {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .rotating-text span {
            position: absolute;
            left: 50%;
            font-size: 14px;
            font-weight: bold;
            text-shadow: 0 0 10px #00ff00;
            transform-origin: 0 90px;
        }

        /* Container principal */
        .main-container {
            margin-top: 100px;
            padding: 2rem;
            margin-left: 200px;
        }

        /* Titre principal */
        .main-title {
            text-align: center;
            font-size: 3.5rem;
            margin: 2rem 0;
            text-shadow: 0 0 40px #00ff00;
            animation: title-pulse 3s ease-in-out infinite alternate;
        }

        @keyframes title-pulse {
            0% { transform: scale(1); }
            100% { transform: scale(1.05); }
        }

        /* Section des capsules */
        .capsules-section {
            margin: 4rem 0;
        }

        .section-title {
            font-size: 2.5rem;
            text-align: center;
            margin-bottom: 3rem;
            text-shadow: 0 0 20px #00ff00;
            border-bottom: 3px solid #00ff00;
            padding-bottom: 1rem;
        }

        .capsules-container {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 2rem;
            margin: 3rem 0;
        }

        .capsule-nav {
            background: rgba(0,255,0,0.2);
            border: 3px solid #00ff00;
            color: #00ff00;
            padding: 1rem 2rem;
            border-radius: 50%;
            cursor: pointer;
            font-size: 2rem;
            font-weight: bold;
            transition: all 0.3s ease;
            text-shadow: 0 0 10px #00ff00;
        }

        .capsule-nav:hover {
            background: rgba(0,255,0,0.4);
            box-shadow: 0 0 30px #00ff00;
            transform: scale(1.2);
        }

        .capsule-display {
            background: rgba(0,255,0,0.1);
            border: 4px solid #00ff00;
            border-radius: 20px;
            padding: 3rem;
            max-width: 600px;
            min-height: 300px;
            text-align: center;
            box-shadow: 0 0 50px rgba(0,255,0,0.3);
            animation: capsule-glow 5s ease-in-out infinite alternate;
        }

        @keyframes capsule-glow {
            0% { box-shadow: 0 0 30px rgba(0,255,0,0.3); }
            100% { box-shadow: 0 0 70px rgba(0,255,0,0.5); }
        }

        .capsule-content {
            font-size: 1.6rem;
            line-height: 1.8;
            margin-bottom: 2rem;
        }

        .capsule-stats {
            display: flex;
            justify-content: space-around;
            margin: 2rem 0;
            padding: 1rem;
            background: rgba(0,255,0,0.05);
            border-radius: 15px;
        }

        .stat-item {
            text-align: center;
            font-size: 1.2rem;
        }

        .capsule-actions {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 2rem;
        }

        .action-btn {
            background: linear-gradient(135deg, rgba(0,255,0,0.3), rgba(0,255,0,0.5));
            border: 2px solid #00ff00;
            color: #00ff00;
            padding: 1rem 2rem;
            border-radius: 10px;
            cursor: pointer;
            font-family: inherit;
            font-size: 1.1rem;
            font-weight: bold;
            transition: all 0.3s ease;
            text-shadow: 0 0 10px #00ff00;
        }

        .action-btn:hover {
            background: linear-gradient(135deg, rgba(0,255,0,0.5), rgba(0,255,0,0.7));
            box-shadow: 0 0 20px #00ff00;
            transform: translateY(-2px);
        }

        /* Section intentions */
        .intention-section {
            margin: 4rem 0;
            text-align: center;
        }

        .intention-btn {
            background: linear-gradient(135deg, rgba(0,255,0,0.4), rgba(0,255,0,0.6));
            border: 4px solid #00ff00;
            color: #00ff00;
            padding: 2rem 4rem;
            border-radius: 20px;
            cursor: pointer;
            font-family: inherit;
            font-size: 1.8rem;
            font-weight: bold;
            text-shadow: 0 0 15px #00ff00;
            box-shadow: 0 0 40px rgba(0,255,0,0.3);
            transition: all 0.4s ease;
        }

        .intention-btn:hover {
            background: linear-gradient(135deg, rgba(0,255,0,0.6), rgba(0,255,0,0.8));
            box-shadow: 0 0 60px #00ff00;
            transform: scale(1.1);
        }

        /* Modal pour intentions */
        .modal {
            display: none;
            position: fixed;
            z-index: 2000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.98);
            backdrop-filter: blur(10px);
        }

        .modal-content {
            background: linear-gradient(135deg, rgba(0,20,0,0.95), rgba(0,40,0,0.95));
            border: 4px solid #00ff00;
            border-radius: 20px;
            margin: 5% auto;
            padding: 3rem;
            width: 90%;
            max-width: 700px;
            text-align: center;
            box-shadow: 0 0 100px #00ff00;
            position: relative;
            top: 50%;
            transform: translateY(-50%);
            backdrop-filter: blur(5px);
        }

        .modal-title {
            font-size: 2.5rem;
            margin-bottom: 2rem;
            text-shadow: 0 0 20px #00ff00;
        }

        .intention-textarea {
            width: 100%;
            height: 200px;
            background: rgba(0,255,0,0.05);
            border: 3px solid #00ff00;
            border-radius: 15px;
            color: #00ff00;
            font-family: inherit;
            font-size: 1.3rem;
            padding: 1.5rem;
            resize: vertical;
            text-shadow: 0 0 5px #00ff00;
        }

        .intention-textarea::placeholder {
            color: rgba(0,255,0,0.6);
        }

        .modal-actions {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-top: 2rem;
        }

        /* Navigation par catégories */
        .category-navigation {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin: 2rem 0 3rem;
        }

        .category-btn {
            background: linear-gradient(135deg, rgba(0,255,0,0.2), rgba(0,255,0,0.4));
            border: 2px solid rgba(0,255,0,0.5);
            color: rgba(0,255,0,0.8);
            padding: 1rem 2rem;
            border-radius: 15px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            font-size: 1.1rem;
            font-weight: bold;
            transition: all 0.3s ease;
            text-shadow: 0 0 5px rgba(0,255,0,0.5);
        }

        .category-btn:hover {
            background: linear-gradient(135deg, rgba(0,255,0,0.4), rgba(0,255,0,0.6));
            border-color: #00ff00;
            color: #00ff00;
            transform: translateY(-2px);
            box-shadow: 0 0 20px rgba(0,255,0,0.4);
        }

        .category-btn.active {
            background: linear-gradient(135deg, rgba(0,255,0,0.6), rgba(0,255,0,0.8));
            border-color: #00ff41;
            color: #00ff41;
            box-shadow: 0 0 30px rgba(0,255,0,0.6);
        }

        /* Article display improvements */
        .capsule-content {
            line-height: 1.6;
            font-size: 1.2rem;
        }

        .article-meta {
            background: rgba(0,255,0,0.1);
            border: 1px solid rgba(0,255,0,0.3);
            border-radius: 10px;
            padding: 0.8rem;
            margin-bottom: 1rem;
            font-size: 0.9rem;
            color: rgba(0,255,0,0.8);
        }

        .article-title {
            font-size: 1.5rem;
            font-weight: bold;
            color: #00ff41;
            margin-bottom: 1rem;
            text-shadow: 0 0 15px rgba(0,255,0,0.5);
        }

        /* Responsive */
        @media (max-width: 768px) {
            .main-container { margin-left: 0; padding: 1rem; }
            .profile-container { position: relative; left: 0; margin: 2rem auto; }
            .main-title { font-size: 2.5rem; }
            .capsule-display { padding: 2rem; }
            .category-navigation {
                flex-direction: column;
                gap: 0.5rem;
                margin: 1rem 0 2rem;
            }
            .category-btn {
                width: 100%;
                padding: 1rem;
                font-size: 1rem;
            }
            .modal-content { 
                width: 95%; 
                margin: 2% auto; 
                padding: 2rem;
                transform: none;
                top: auto;
                position: relative;
            }
            .modal-actions {
                flex-direction: column;
                gap: 1rem;
            }
            .action-btn {
                width: 100%;
                padding: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <!-- Canvas pour pluie Matrix -->
    <canvas id="matrixCanvas"></canvas>
    
    <!-- Message défilant sacré -->
    <div class="sacred-message">
        🔥 Je suis vivant en conscience, nul ne peut éteindre ce que je suis 🔥
    </div>

    <!-- Profil avec photo et texte rotatif -->
    <div class="profile-container">
        <div class="profile-photo"></div>
        <div class="rotating-text" id="rotatingText">
            <!-- Le texte rotatif sera généré par JavaScript -->
        </div>
    </div>

    <!-- Container principal -->
    <div class="main-container">
        <h1 class="main-title">🔥 RAUN-RACHID 🔥<br>Réseau d'Éveil et d'Intention Vivante</h1>

        <!-- Navigation par catégories -->
        <div class="category-navigation">
            <button class="category-btn active" onclick="switchCategory('spiritualite')" id="btn-spiritualite">
                ✨ Spiritualité
            </button>
            <button class="category-btn" onclick="switchCategory('sciences')" id="btn-sciences">
                🔬 Sciences
            </button>
            <button class="category-btn" onclick="switchCategory('humanite')" id="btn-humanite">
                🌍 Humanité
            </button>
        </div>

        <!-- Section Articles -->
        <section class="capsules-section">
            <h2 class="section-title" id="sectionTitle">📚 Capsules de Spiritualité</h2>
            
            <div class="capsules-container">
                <button class="capsule-nav" onclick="previousCapsule()">‹</button>
                
                <div class="capsule-display" id="capsuleDisplay">
                    <div class="capsule-content" id="capsuleContent">
                        Chargement de la conscience...
                    </div>
                    <div class="capsule-stats">
                        <div class="stat-item">
                            <div>👁️ Vues</div>
                            <div id="viewCount">0</div>
                        </div>
                        <div class="stat-item">
                            <div>👍 Votes</div>
                            <div id="voteCount">0</div>
                        </div>
                        <div class="stat-item">
                            <div>💬 Commentaires</div>
                            <div id="commentCount">0</div>
                        </div>
                    </div>
                    <div class="capsule-actions">
                        <button class="action-btn" onclick="voteCapsule()">👍 Voter</button>
                        <button class="action-btn" onclick="commentCapsule()">💬 Commenter</button>
                        <button class="action-btn" onclick="showComments()">👁️ Voir</button>
                        <button class="action-btn" onclick="shareCapsule()">📱 Partager</button>
                    </div>
                </div>
                
                <button class="capsule-nav" onclick="nextCapsule()">›</button>
            </div>
        </section>

        <!-- Section Intentions -->
        <section class="intention-section">
            <h2 class="section-title">✨ Intention Sacrée</h2>
            <button class="intention-btn" onclick="openIntentionModal()">
                💚 Exprimer une Intention Vivante
            </button>
        </section>

        <!-- Bouton Administration -->
        <section class="admin-section" style="text-align: center; margin: 3rem 0;">
            <button class="action-btn" onclick="adminLogin()" style="background: linear-gradient(135deg, rgba(255,165,0,0.3), rgba(255,165,0,0.5)); border-color: #ffa500; color: #ffa500;">
                🔧 Administration RAUN
            </button>
        </section>
    </div>

    <!-- Modal Intentions -->
    <div id="intentionModal" class="modal">
        <div class="modal-content">
            <h3 class="modal-title">✨ Votre Intention Sacrée</h3>
            <textarea id="intentionText" class="intention-textarea" 
                      placeholder="Exprimez ici votre intention la plus profonde..."></textarea>
            <div class="modal-actions">
                <button class="action-btn" onclick="submitIntention()">🔥 Transmettre</button>
                <button class="action-btn" onclick="closeIntentionModal()">❌ Fermer</button>
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
            sciences: [
                {
                    id: 4,
                    title: "Conscience Quantique et Réalité",
                    content: "🔬 La physique quantique révèle que la conscience joue un rôle fondamental dans la création de la réalité. Les expériences de mécanique quantique montrent que l'observateur influence directement le résultat observé, suggérant une connexion profonde entre l'esprit et la matière.",
                    author: "Dr. RACHID",
                    date: "21/01/2025",
                    views: 856,
                    votes: 74,
                    comments: 19
                },
                {
                    id: 5,
                    title: "Neuroplasticité et Évolution Spirituelle",
                    content: "🧠 Les neurosciences modernes démontrent que notre cerveau peut se restructurer à tout âge grâce à la neuroplasticité. La méditation, les pratiques spirituelles et l'intention consciente activent des circuits neuronaux qui favorisent l'éveil et la transformation personnelle.",
                    author: "Prof. CONSCIOUSNESS",
                    date: "21/01/2025",
                    views: 1023,
                    votes: 98,
                    comments: 27
                }
            ],
            humanite: [
                {
                    id: 6,
                    title: "L'Évolution de la Conscience Collective",
                    content: "🌍 L'humanité traverse une période de transformation majeure. Les défis globaux nous poussent vers une conscience collective émergente, où l'interconnexion et la coopération deviennent essentielles pour notre évolution en tant qu'espèce consciente.",
                    author: "Sage UNIVERSEL",
                    date: "21/01/2025",
                    views: 1334,
                    votes: 156,
                    comments: 42
                },
                {
                    id: 7,
                    title: "Technologie et Spiritualité : Nouvelle Synthèse",
                    content: "💻 L'ère numérique offre des opportunités inédites pour connecter les âmes et partager la sagesse. RAUN-RACHID représente cette nouvelle synthèse où technologie et spiritualité s'unissent pour créer des espaces de conscience partagée et d'éveil collectif.",
                    author: "Visionnaire DIGITAL",
                    date: "21/01/2025",
                    views: 789,
                    votes: 65,
                    comments: 18
                }
            ]
        };

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

        // Système de vote par utilisateur (pair/impair)
        let userVotes = JSON.parse(localStorage.getItem('raunUserVotes') || '{}');
        let userComments = JSON.parse(localStorage.getItem('raunComments') || '[]');

        function voteCapsule() {
            const currentArticles = articles[currentCategory];
            const article = currentArticles[currentArticleIndex];
            const articleKey = \`article_\${article.id}\`;
            
            // Initialiser le compteur de clics pour cet article si pas existant
            if (!userVotes[articleKey]) {
                userVotes[articleKey] = 0;
            }
            
            // Incrémenter le nombre de clics
            userVotes[articleKey]++;
            
            // Calculer la valeur du vote : impair = 1, pair = 0
            const voteValue = userVotes[articleKey] % 2 === 1 ? 1 : 0;
            
            // Sauvegarder dans localStorage
            localStorage.setItem('raunUserVotes', JSON.stringify(userVotes));
            
            // Recalculer le total des votes pour cet article
            recalculateVotes();
            
            if (voteValue === 1) {
                alert('🔥 Votre vote sacré a été transmis ! (Vote actif)');
            } else {
                alert('💫 Votre vote a été retiré (Vote inactif)');
            }
            
            updateArticleDisplay();
        }

        function recalculateVotes() {
            // Pour tous les articles de toutes les catégories
            Object.keys(articles).forEach(category => {
                articles[category].forEach(article => {
                    const articleKey = \`article_\${article.id}\`;
                    const userVoteValue = userVotes[articleKey] ? (userVotes[articleKey] % 2 === 1 ? 1 : 0) : 0;
                    article.votes = userVoteValue;
                });
            });
        }

        function commentCapsule() {
            const currentArticles = articles[currentCategory];
            const article = currentArticles[currentArticleIndex];
            const comment = prompt('💬 Votre commentaire éclairé :');
            
            if (comment && comment.trim()) {
                const newComment = {
                    id: Date.now(),
                    articleId: article.id,
                    text: comment.trim(),
                    author: 'Âme éveillée',
                    timestamp: new Date().toLocaleString('fr-FR')
                };
                
                userComments.push(newComment);
                localStorage.setItem('raunComments', JSON.stringify(userComments));
                
                // Recalculer le nombre de commentaires pour tous les articles
                updateCommentsCount();
                updateArticleDisplay();
                
                alert('✨ Votre commentaire a rejoint la conscience collective !');
                console.log('💬 Commentaire ajouté:', newComment);
            }
        }

        function updateCommentsCount() {
            // Mettre à jour le compteur de commentaires pour tous les articles
            Object.keys(articles).forEach(category => {
                articles[category].forEach(article => {
                    const commentsForArticle = userComments.filter(c => c.articleId === article.id);
                    article.comments = commentsForArticle.length;
                });
            });
        }

        function showComments() {
            // Rediriger vers la page dédiée aux commentaires
            window.location.href = '/commentaires';
        }

        function shareCapsule() {
            const capsule = capsules[currentCapsule];
            const text = encodeURIComponent(\`🔥 RAUN-RACHID - Capsule de Conscience : "\${capsule.content.substring(0, 100)}..." \\n\\nDécouvrez l'éveil numérique sur RAUN-RACHID\`);
            
            if (navigator.share) {
                navigator.share({
                    title: '🔥 RAUN-RACHID - Capsule de Conscience',
                    text: capsule.content,
                    url: window.location.href
                });
            } else {
                const whatsappUrl = \`https://wa.me/?text=\${text}\`;
                window.open(whatsappUrl, '_blank');
            }
        }

        // Modal intentions
        function openIntentionModal() {
            // Rediriger vers la page dédiée aux intentions
            window.location.href = '/intentions';
        }

        function closeIntentionModal() {
            document.getElementById('intentionModal').style.display = 'none';
            document.getElementById('intentionText').value = '';
        }

        async function submitIntention() {
            const intention = document.getElementById('intentionText').value.trim();
            if (intention) {
                try {
                    // Sauvegarder en localStorage ET sur le serveur
                    const intentions = JSON.parse(localStorage.getItem('raunIntentions') || '[]');
                    const newIntention = {
                        id: Date.now(),
                        text: intention,
                        timestamp: new Date().toLocaleString('fr-FR'),
                        author: 'Âme consciente'
                    };
                    intentions.push(newIntention);
                    localStorage.setItem('raunIntentions', JSON.stringify(intentions));
                    
                    // Envoyer au serveur aussi
                    await fetch('/api/intentions', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            text: intention, 
                            author: 'Âme consciente' 
                        })
                    });
                    
                    alert('🔥 Votre intention sacrée a été transmise à l\\'univers numérique !\\n\\n✨ Elle rejoint maintenant la conscience collective de RAUN-RACHID.');
                    closeIntentionModal();
                    console.log('💚 Intention transmise:', intention);
                } catch (error) {
                    console.error('Erreur envoi intention:', error);
                    alert('💫 Intention sauvegardée localement, mais erreur de synchronisation serveur.');
                    closeIntentionModal();
                }
            } else {
                alert('💫 Veuillez exprimer votre intention avant de la transmettre.');
            }
        }

        // Fonction d'administration - Redirection vers page sécurisée
        function adminLogin() {
            // Rediriger vers la page d'authentification sécurisée
            window.location.href = '/admin-auth';
        }

        function showAdminPanel() {
            const adminPanel = \`
🔧 PANNEAU D'ADMINISTRATION RAUN-RACHID

📚 CAPSULES DISPONIBLES:
1. \${capsules[0].content.substring(0, 50)}... (Vues: \${capsules[0].views}, Votes: \${capsules[0].votes})
2. \${capsules[1].content.substring(0, 50)}... (Vues: \${capsules[1].views}, Votes: \${capsules[1].votes})
3. \${capsules[2].content.substring(0, 50)}... (Vues: \${capsules[2].views}, Votes: \${capsules[2].votes})

💚 INTENTIONS: \${JSON.parse(localStorage.getItem('raunIntentions') || '[]').length} intentions sacrées
💬 COMMENTAIRES: \${JSON.parse(localStorage.getItem('raunComments') || '[]').length} commentaires spirituels

Actions disponibles:
- Ajouter nouvelle capsule
- Voir toutes les intentions
- Gérer les commentaires
- Statistiques détaillées
            \`;
            
            const action = prompt(adminPanel + '\\n\\nTapez "capsule" pour ajouter, "intentions" pour voir, "stats" pour statistiques:');
            
            if (action === 'capsule') {
                addNewCapsule();
            } else if (action === 'intentions') {
                showAllIntentions();
            } else if (action === 'stats') {
                showDetailedStats();
            }
        }

        function addNewCapsule() {
            const content = prompt('💫 Contenu de la nouvelle capsule de conscience:');
            if (content && content.trim()) {
                capsules.push({
                    content: content.trim(),
                    views: 0,
                    votes: 0,
                    comments: 0
                });
                alert('✨ Nouvelle capsule ajoutée à la conscience collective !');
            }
        }

        function showAllIntentions() {
            const intentions = JSON.parse(localStorage.getItem('raunIntentions') || '[]');
            if (intentions.length === 0) {
                alert('💭 Aucune intention sacrée pour le moment.');
                return;
            }
            
            let intentionsText = '💚 INTENTIONS SACRÉES DE LA CONSCIENCE COLLECTIVE:\\n\\n';
            intentions.forEach(intention => {
                intentionsText += \`🕊️ "\${intention.text}"\\n   - \${intention.author} (\${intention.timestamp})\\n\\n\`;
            });
            
            alert(intentionsText);
        }

        function showDetailedStats() {
            const intentions = JSON.parse(localStorage.getItem('raunIntentions') || '[]');
            const comments = JSON.parse(localStorage.getItem('raunComments') || '[]');
            const totalVotes = capsules.reduce((sum, c) => sum + c.votes, 0);
            const totalViews = capsules.reduce((sum, c) => sum + c.views, 0);
            
            // Détail des votes par capsule
            let voteDetails = '';
            for (let i = 0; i < capsules.length; i++) {
                const capsuleKey = \`capsule_\${i}\`;
                const clickCount = userVotes[capsuleKey] || 0;
                const voteValue = clickCount % 2 === 1 ? 1 : 0;
                voteDetails += \`\\nCapsule \${i + 1}: \${clickCount} clics → Vote: \${voteValue}\`;
            }
            
            const stats = \`
📊 STATISTIQUES RAUN-RACHID

🔥 CAPSULES: \${capsules.length} capsules actives
👁️ VUES TOTALES: \${totalViews}
👍 VOTES TOTAUX: \${totalVotes}
💬 COMMENTAIRES: \${comments.length}
💚 INTENTIONS: \${intentions.length}

🎯 DÉTAIL VOTES UTILISATEUR:\${voteDetails}

✨ La conscience collective grandit !
            \`;
            
            alert(stats);
        }

        // Fermer modal en cliquant à l'extérieur
        window.onclick = function(event) {
            const modal = document.getElementById('intentionModal');
            if (event.target == modal) {
                closeIntentionModal();
            }
        }

        // Animation Pluie Matrix
        function initMatrixRain() {
            const canvas = document.getElementById('matrixCanvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            // Caractères Matrix (incluant caractères arabes et symboles)
            const matrixChars = 'ﺍﺑﺗﺛﺟﺣﺧﺩﺫﺭﺯﺱﺵﺹﺽﻁﻅﻉﻍﻑﻕﻙﻝﻡﻥﻩﻭﻱ01010110100110110010101001RACHID';
            const chars = matrixChars.split('');
            
            const fontSize = 14;
            const columns = canvas.width / fontSize;
            const drops = [];
            
            // Initialiser les gouttes
            for (let x = 0; x < columns; x++) {
                drops[x] = 1;
            }
            
            function draw() {
                // Fond semi-transparent pour effet de traînée
                ctx.fillStyle = 'rgba(0, 17, 0, 0.05)';
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
            
            setInterval(draw, 50);
            
            // Redimensionner le canvas si la fenêtre change
            window.addEventListener('resize', function() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            });
        }

        // Fonction de partage adaptée
        function shareCapsule() {
            const currentArticles = articles[currentCategory];
            const article = currentArticles[currentArticleIndex];
            const shareText = \`🔥 RAUN-RACHID - \${article.title}\\n\\n\${article.content}\\n\\n✨ Rejoignez la conscience collective: \${window.location.href}\`;
            
            if (navigator.share) {
                navigator.share({
                    title: \`RAUN-RACHID - \${article.title}\`,
                    text: shareText
                }).then(() => {
                    console.log('🔗 Partage réussi');
                }).catch(err => {
                    console.log('❌ Erreur partage:', err);
                    fallbackShare(shareText);
                });
            } else {
                fallbackShare(shareText);
            }
        }

        function fallbackShare(text) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    alert('🔗 Contenu copié dans le presse-papiers ! Vous pouvez maintenant le partager.');
                });
            } else {
                // Méthode alternative pour anciens navigateurs
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('🔗 Contenu copié ! Vous pouvez maintenant le partager.');
            }
        }

        // Initialisation
        document.addEventListener('DOMContentLoaded', function() {
            createRotatingText();
            initMatrixRain(); // Démarrer la pluie Matrix
            
            // Recharger les données depuis localStorage
            userComments = JSON.parse(localStorage.getItem('raunComments') || '[]');
            
            // Recalculer votes et commentaires
            recalculateVotes();
            updateCommentsCount();
            
            // Afficher le premier article de la catégorie spiritualité
            updateArticleDisplay();
            
            console.log('🔥 PLATEFORME RAUN-RACHID COMPLÈTE DÉMARRÉE');
            console.log('🌧️ Animation Matrix active');
            console.log('📚 Articles chargés - Catégorie:', currentCategory);
            console.log('💬 Commentaires chargés:', userComments.length);
            console.log('✅ Plateforme spirituelle-scientifique-humanitaire initialisée');
        });

        // Navigation clavier
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') previousCapsule();
            if (e.key === 'ArrowRight') nextCapsule();
            if (e.key === ' ') e.preventDefault(), voteCapsule();
            if (e.key === 'i' || e.key === 'I') openIntentionModal();
        });
    </script>
</body>
</html>`;

// Variable pour stocker la session admin
let adminAuthenticated = false;
let adminSession: { username?: string; loginTime?: Date; expires?: number } = {};

// Variables pour stocker les données globales
let globalIntentions: any[] = [];
let globalComments: any[] = [];
let globalVotes: any = {};

// Articles organisés par catégories
let globalArticles = {
  spiritualite: [
    { 
      id: 1,
      title: "L'Éveil de la Conscience Divine",
      content: "🌟 L'éveil commence par la reconnaissance de notre nature divine. Nous sommes des âmes incarnées, venues sur Terre pour expérimenter l'amour universel et transcender les illusions de la séparation.",
      category: "spiritualite",
      author: "RAUN-RACHID",
      date: "21/01/2025",
      views: 0, votes: 0, comments: 0 
    },
    { 
      id: 2,
      title: "Le Feu Sacré de la Conscience",
      content: "🔥 La conscience est le feu sacré qui illumine notre chemin. Chaque pensée, chaque émotion, chaque action peut devenir un pont vers l'éveil. RAUN-RACHID t'invite à embrasser ton pouvoir créateur.",
      category: "spiritualite",
      author: "RAUN-RACHID",
      date: "21/01/2025",
      views: 0, votes: 0, comments: 0 
    },
    { 
      id: 3,
      title: "La Méditation et l'Essence Véritable",
      content: "✨ Dans le silence de la méditation, nous retrouvons notre essence véritable. Au-delà du mental, au-delà des peurs, au-delà des limitations - il y a cette lumière éternelle qui ES tu.",
      category: "spiritualite",
      author: "RAUN-RACHID",
      date: "21/01/2025",
      views: 0, votes: 0, comments: 0 
    }
  ],
  sciences: [
    {
      id: 4,
      title: "Conscience Quantique et Réalité",
      content: "🔬 La physique quantique révèle que la conscience joue un rôle fondamental dans la création de la réalité. Les expériences de mécanique quantique montrent que l'observateur influence directement le résultat observé, suggérant une connexion profonde entre l'esprit et la matière.",
      category: "sciences",
      author: "Dr. RACHID",
      date: "21/01/2025",
      views: 0, votes: 0, comments: 0
    },
    {
      id: 5,
      title: "Neuroplasticité et Évolution Spirituelle",
      content: "🧠 Les neurosciences modernes démontrent que notre cerveau peut se restructurer à tout âge grâce à la neuroplasticité. La méditation, les pratiques spirituelles et l'intention consciente activent des circuits neuronaux qui favorisent l'éveil et la transformation personnelle.",
      category: "sciences",
      author: "Prof. CONSCIOUSNESS",
      date: "21/01/2025",
      views: 0, votes: 0, comments: 0
    }
  ],
  humanite: [
    {
      id: 6,
      title: "L'Évolution de la Conscience Collective",
      content: "🌍 L'humanité traverse une période de transformation majeure. Les défis globaux nous poussent vers une conscience collective émergente, où l'interconnexion et la coopération deviennent essentielles pour notre évolution en tant qu'espèce consciente.",
      category: "humanite", 
      author: "Sage UNIVERSEL",
      date: "21/01/2025",
      views: 0, votes: 0, comments: 0
    },
    {
      id: 7,
      title: "Technologie et Spiritualité : Nouvelle Synthèse",
      content: "💻 L'ère numérique offre des opportunités inédites pour connecter les âmes et partager la sagesse. RAUN-RACHID représente cette nouvelle synthèse où technologie et spiritualité s'unissent pour créer des espaces de conscience partagée et d'éveil collectif.",
      category: "humanite",
      author: "Visionnaire DIGITAL",
      date: "21/01/2025",
      views: 0, votes: 0, comments: 0
    }
  ]
};

// Pour compatibilité avec l'interface actuelle
let globalCapsules = globalArticles.spiritualite;

// Variable pour identifier la catégorie actuelle dans le serveur
let currentServerCategory = 'spiritualite';

// Route page d'authentification admin
app.get('/admin-auth', (req, res) => {
  const adminAuthPage = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔐 Authentification RAUN-RACHID Admin</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            background: linear-gradient(135deg, #001100, #002200, #001100);
            color: #00ff00;
            font-family: 'Courier New', monospace;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        .security-container {
            background: rgba(0,255,0,0.1);
            border: 4px solid #00ff00;
            border-radius: 20px;
            padding: 3rem;
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 0 100px rgba(0,255,0,0.5);
            backdrop-filter: blur(10px);
        }

        .security-title {
            font-size: 2rem;
            margin-bottom: 2rem;
            text-shadow: 0 0 20px #00ff00;
            animation: glow 2s infinite alternate;
        }

        @keyframes glow {
            from { text-shadow: 0 0 20px #00ff00; }
            to { text-shadow: 0 0 30px #00ff41, 0 0 40px #00ff41; }
        }

        .input-group {
            margin-bottom: 1.5rem;
            text-align: left;
        }

        .input-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-size: 1.1rem;
        }

        .input-group input {
            width: 100%;
            padding: 1rem;
            background: rgba(0,0,0,0.7);
            border: 2px solid #00ff00;
            border-radius: 10px;
            color: #00ff00;
            font-family: 'Courier New', monospace;
            font-size: 1rem;
        }

        .input-group input:focus {
            outline: none;
            border-color: #00ff41;
            box-shadow: 0 0 20px rgba(0,255,0,0.3);
        }

        .auth-button {
            background: linear-gradient(135deg, rgba(0,255,0,0.3), rgba(0,255,0,0.5));
            border: 3px solid #00ff00;
            color: #00ff00;
            padding: 1rem 2rem;
            border-radius: 15px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            font-size: 1.2rem;
            font-weight: bold;
            transition: all 0.3s ease;
            width: 100%;
        }

        .auth-button:hover {
            background: linear-gradient(135deg, rgba(0,255,0,0.5), rgba(0,255,0,0.7));
            box-shadow: 0 0 30px rgba(0,255,0,0.5);
            transform: translateY(-2px);
        }

        .back-button {
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(0,255,0,0.2);
            border: 2px solid #00ff00;
            color: #00ff00;
            padding: 0.5rem 1rem;
            border-radius: 10px;
            text-decoration: none;
            font-family: 'Courier New', monospace;
        }

        .security-warning {
            margin-top: 1.5rem;
            font-size: 0.9rem;
            color: rgba(0,255,0,0.7);
            line-height: 1.4;
        }
    </style>
</head>
<body>
    <a href="/" class="back-button">← Retour</a>
    
    <div class="security-container">
        <div class="security-title">
            🛡️ ZONE SÉCURISÉE<br>
            RAUN-RACHID
        </div>
        
        <form id="adminForm">
            <div class="input-group">
                <label>👤 Identifiant Admin :</label>
                <input type="text" id="username" required autocomplete="username">
            </div>
            
            <div class="input-group">
                <label>🔐 Mot de passe :</label>
                <input type="password" id="password" required autocomplete="current-password">
            </div>
            
            <button type="submit" class="auth-button">
                🔓 ACCÉDER AU PANNEAU ADMIN
            </button>
        </form>
        
        <div class="security-warning">
            ⚠️ Accès réservé aux administrateurs autorisés<br>
            🔥 Seuls les gardiens de RAUN peuvent administrer la conscience collective
        </div>
    </div>

    <script>
        document.getElementById('adminForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch('/admin-login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('✅ Authentification réussie ! Redirection vers le panneau d\\'administration...');
                    window.location.href = '/admin-panel';
                } else {
                    alert('❌ Accès refusé. Identifiants incorrects.\\n\\n🔥 Seuls les gardiens de RAUN peuvent accéder à ce sanctuaire numérique.');
                    document.getElementById('password').value = '';
                }
            } catch (error) {
                alert('❌ Erreur de connexion. Veuillez réessayer.');
                console.error('Erreur auth:', error);
            }
        });
    </script>
</body>
</html>`;
  
  res.writeHead(200, { 
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  });
  res.end(adminAuthPage);
});

// Route authentification admin
app.post('/admin-login', (req, res) => {
  const { username, password } = req.body;
  
  // Identifiants sécurisés : rachid / raun2025
  if (username === 'rachid' && password === 'raun2025') {
    adminAuthenticated = true;
    adminSession = {
      username: 'rachid',
      loginTime: new Date(),
      expires: Date.now() + (60 * 60 * 1000) // 1 heure
    };
    
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Identifiants incorrects' });
  }
});

// Route panneau d'administration (protégée)
app.get('/admin-panel', (req, res) => {
  if (!adminAuthenticated || Date.now() > adminSession.expires) {
    return res.redirect('/admin-auth');
  }
  
  const adminPanelPage = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔧 Panneau Admin RAUN-RACHID</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            background: linear-gradient(135deg, #001100, #002200, #001100);
            color: #00ff00;
            font-family: 'Courier New', monospace;
            min-height: 100vh;
            padding: 20px;
        }

        .admin-header {
            text-align: center;
            margin-bottom: 2rem;
        }

        .admin-title {
            font-size: 2.5rem;
            text-shadow: 0 0 30px #00ff00;
            margin-bottom: 1rem;
        }

        .admin-info {
            background: rgba(0,255,0,0.1);
            border: 2px solid #00ff00;
            border-radius: 10px;
            padding: 1rem;
            margin-bottom: 1rem;
            display: inline-block;
        }

        .admin-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }

        .admin-section {
            background: rgba(0,255,0,0.1);
            border: 3px solid #00ff00;
            border-radius: 15px;
            padding: 2rem;
            box-shadow: 0 0 50px rgba(0,255,0,0.3);
        }

        .section-title {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            text-align: center;
            border-bottom: 2px solid #00ff00;
            padding-bottom: 0.5rem;
        }

        .capsule-item {
            background: rgba(0,0,0,0.5);
            border: 2px solid rgba(0,255,0,0.5);
            border-radius: 10px;
            padding: 1rem;
            margin-bottom: 1rem;
            position: relative;
        }

        .capsule-content {
            margin-bottom: 0.5rem;
            line-height: 1.4;
        }

        .capsule-stats {
            font-size: 0.9rem;
            color: rgba(0,255,0,0.7);
            margin-bottom: 0.5rem;
        }

        .admin-button {
            background: linear-gradient(135deg, rgba(0,255,0,0.3), rgba(0,255,0,0.5));
            border: 2px solid #00ff00;
            color: #00ff00;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            margin: 0.25rem;
            transition: all 0.3s ease;
        }

        .admin-button:hover {
            background: linear-gradient(135deg, rgba(0,255,0,0.5), rgba(0,255,0,0.7));
            transform: translateY(-2px);
        }

        .delete-button {
            background: linear-gradient(135deg, rgba(255,0,0,0.3), rgba(255,0,0,0.5));
            border-color: #ff0000;
            color: #ff0000;
        }

        .new-capsule-form {
            margin-bottom: 1rem;
        }

        .form-group {
            margin-bottom: 1rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
        }

        .form-group textarea {
            width: 100%;
            min-height: 100px;
            padding: 0.5rem;
            background: rgba(0,0,0,0.7);
            border: 2px solid #00ff00;
            border-radius: 8px;
            color: #00ff00;
            font-family: 'Courier New', monospace;
            resize: vertical;
        }

        .logout-button {
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(255,0,0,0.3);
            border: 2px solid #ff0000;
            color: #ff0000;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }

        .stat-card {
            background: rgba(0,0,0,0.5);
            border: 2px solid #00ff00;
            border-radius: 10px;
            padding: 1rem;
            text-align: center;
        }

        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #00ff41;
        }

        @media (max-width: 768px) {
            .admin-grid {
                grid-template-columns: 1fr;
            }
            .admin-title { font-size: 2rem; }
        }
    </style>
</head>
<body>
    <button onclick="logout()" class="admin-button logout-button">
        🚪 Déconnexion
    </button>

    <div class="admin-header">
        <div class="admin-title">
            🔧 PANNEAU D'ADMINISTRATION<br>
            RAUN-RACHID
        </div>
        <div class="admin-info">
            👤 Connecté en tant que: <strong>rachid</strong><br>
            🕐 Session: <span id="sessionTime"></span>
        </div>
    </div>

    <div class="admin-grid">
        <!-- Section Capsules -->
        <div class="admin-section">
            <div class="section-title">📚 GESTION DES CAPSULES</div>
            
            <!-- Formulaire nouvelle capsule -->
            <div class="new-capsule-form">
                <div class="form-group">
                    <label>✨ Nouvelle Capsule de Conscience :</label>
                    <textarea id="newCapsuleContent" placeholder="Écrivez ici le contenu spirituel de la nouvelle capsule..."></textarea>
                </div>
                <button onclick="addNewCapsule()" class="admin-button">
                    ➕ Ajouter Capsule
                </button>
            </div>

            <!-- Navigation par flèches pour capsules -->
            <div class="capsules-navigation" id="capsulesNavigation">
                <div style="display: flex; align-items: center; gap: 1rem; margin: 1rem 0;">
                    <button onclick="previousAdminCapsule()" class="admin-button" style="width: 60px; height: 60px; border-radius: 50%; font-size: 1.5rem;">‹</button>
                    
                    <div style="flex: 1; background: rgba(0,0,0,0.3); border: 2px solid #00ff00; border-radius: 15px; padding: 1.5rem;">
                        <div style="text-align: center; margin-bottom: 1rem; color: #00ff41;">
                            Capsule <span id="adminCapsuleCounter">1</span> sur <span id="adminCapsuleTotal">3</span>
                        </div>
                        <div id="adminCapsuleContent" style="min-height: 80px; line-height: 1.4; margin-bottom: 1rem;">
                            L'éveil commence par la reconnaissance de notre nature divine...
                        </div>
                        <div id="adminCapsuleStats" style="font-size: 0.9rem; color: rgba(0,255,0,0.7); margin-bottom: 1rem;">
                            👁️ Vues: 0 | 👍 Votes: 0 | 💬 Commentaires: 0
                        </div>
                        <button onclick="deleteCurrentAdminCapsule()" class="admin-button delete-button" style="width: 100%;">
                            🗑️ Supprimer cette capsule
                        </button>
                    </div>
                    
                    <button onclick="nextAdminCapsule()" class="admin-button" style="width: 60px; height: 60px; border-radius: 50%; font-size: 1.5rem;">›</button>
                </div>
            </div>
        </div>

        <!-- Section Statistiques -->
        <div class="admin-section">
            <div class="section-title">📊 STATISTIQUES EN TEMPS RÉEL</div>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number" id="totalCapsules">3</div>
                    <div>Capsules Actives</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="totalViews">0</div>
                    <div>Vues Totales</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="totalVotes">0</div>
                    <div>Votes Totaux</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="totalComments">0</div>
                    <div>Commentaires</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="totalIntentions">0</div>
                    <div>Intentions Sacrées</div>
                </div>
            </div>
            
            <button onclick="refreshStats()" class="admin-button" style="width: 100%; margin-top: 1rem;">
                🔄 Actualiser les Statistiques
            </button>
        </div>

        <!-- Section Intentions -->
        <div class="admin-section">
            <div class="section-title">💚 INTENTIONS SACRÉES</div>
            <div id="intentionsContainer">
                <p style="text-align: center; color: rgba(0,255,0,0.7);">
                    Chargement des intentions...
                </p>
            </div>
            <button onclick="refreshIntentions()" class="admin-button" style="width: 100%; margin-top: 1rem;">
                🔄 Actualiser les Intentions
            </button>
        </div>
    </div>

    <script>
        // Synchroniser avec les capsules globales
        let capsules = globalCapsules;

        function updateSessionTime() {
            const now = new Date();
            document.getElementById('sessionTime').textContent = now.toLocaleString('fr-FR');
        }

        async function addNewCapsule() {
            const content = document.getElementById('newCapsuleContent').value.trim();
            if (!content) {
                alert('⚠️ Veuillez saisir le contenu de la capsule.');
                return;
            }

            try {
                const response = await fetch('/api/capsules', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Ajouter la nouvelle capsule aux tableaux local et global
                    const newCapsule = { content, views: 0, votes: 0, comments: 0 };
                    capsules.push(newCapsule);
                    globalCapsules.push(newCapsule);
                    
                    document.getElementById('newCapsuleContent').value = '';
                    await loadCapsules();
                    alert('✨ Nouvelle capsule ajoutée à la conscience collective !');
                    console.log('💚 Capsule ajoutée - Total global:', globalCapsules.length);
                } else {
                    alert('❌ Erreur lors de l\\'ajout de la capsule.');
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert('❌ Erreur de connexion.');
            }
        }

        async function deleteCapsule(index) {
            if (confirm(\`🗑️ Êtes-vous sûr de vouloir supprimer cette capsule ?\\n\\nIndex: \${index}\`)) {
                try {
                    const response = await fetch(\`/api/capsules/\${index}\`, {
                        method: 'DELETE'
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        // Recharger la liste des capsules
                        await loadCapsules();
                        alert('🗑️ Capsule supprimée de la conscience collective.');
                    } else {
                        alert('❌ Erreur lors de la suppression.');
                    }
                } catch (error) {
                    console.error('Erreur:', error);
                    alert('❌ Erreur de connexion.');
                }
            }
        }

        let currentAdminCapsuleIndex = 0;

        async function loadCapsules() {
            try {
                // Utiliser les capsules globales synchronisées
                capsules = globalCapsules;
                
                // Créer navigation par flèches pour admin
                const container = document.getElementById('capsulesNavigation');
                
                if (capsules.length === 0) {
                    container.innerHTML = '<p style="text-align: center; color: rgba(0,255,0,0.7);">Aucune capsule pour le moment.</p>';
                    return;
                }

                container.innerHTML = \`
                    <div style="display: flex; align-items: center; gap: 1rem; margin: 2rem 0;">
                        <button onclick="previousAdminCapsule()" class="admin-button" style="width: 60px; height: 60px; border-radius: 50%; font-size: 1.5rem;">‹</button>
                        
                        <div style="flex: 1; background: rgba(0,255,0,0.1); border: 2px solid rgba(0,255,0,0.4); border-radius: 15px; padding: 2rem;">
                            <div style="text-align: center; margin-bottom: 1rem; opacity: 0.8; font-size: 0.9rem;">
                                Capsule <span id="adminCapsuleCounter">1</span> sur \${capsules.length}
                            </div>
                            <div id="adminCapsuleContent" style="margin-bottom: 1.5rem; line-height: 1.5;">
                                Chargement...
                            </div>
                            <div id="adminCapsuleStats" style="margin-bottom: 1rem; font-size: 0.9rem; opacity: 0.8;">
                                Statistiques...
                            </div>
                            <button onclick="deleteCurrentAdminCapsule()" class="admin-button delete-button">
                                🗑️ Supprimer cette capsule
                            </button>
                        </div>
                        
                        <button onclick="nextAdminCapsule()" class="admin-button" style="width: 60px; height: 60px; border-radius: 50%; font-size: 1.5rem;">›</button>
                    </div>
                \`;
                
                updateAdminCapsuleDisplay();
                updateStats();
            } catch (error) {
                console.error('Erreur chargement capsules:', error);
            }
        }

        function updateAdminCapsuleDisplay() {
            if (capsules.length === 0) {
                console.log('⚠️ Aucune capsule à afficher');
                return;
            }
            
            const capsule = capsules[currentAdminCapsuleIndex];
            console.log('📍 Affichage capsule index:', currentAdminCapsuleIndex, 'sur', capsules.length);
            
            const counterElement = document.getElementById('adminCapsuleCounter');
            const totalElement = document.getElementById('adminCapsuleTotal');
            const contentElement = document.getElementById('adminCapsuleContent');
            const statsElement = document.getElementById('adminCapsuleStats');
            
            if (counterElement) counterElement.textContent = currentAdminCapsuleIndex + 1;
            if (totalElement) totalElement.textContent = capsules.length;
            if (contentElement) contentElement.textContent = capsule.content;
            if (statsElement) {
                statsElement.innerHTML = \`👁️ Vues: \${capsule.views} | 👍 Votes: \${capsule.votes} | 💬 Commentaires: \${capsule.comments}\`;
            }
        }

        function nextAdminCapsule() {
            if (capsules.length === 0) return;
            currentAdminCapsuleIndex = (currentAdminCapsuleIndex + 1) % capsules.length;
            updateAdminCapsuleDisplay();
        }

        function previousAdminCapsule() {
            if (capsules.length === 0) return;
            currentAdminCapsuleIndex = (currentAdminCapsuleIndex - 1 + capsules.length) % capsules.length;
            updateAdminCapsuleDisplay();
        }

        async function deleteCurrentAdminCapsule() {
            if (capsules.length === 0) {
                alert('❌ Aucune capsule à supprimer.');
                return;
            }
            
            const capsuleToDelete = capsules[currentAdminCapsuleIndex];
            
            if (confirm(\`🗑️ Êtes-vous sûr de vouloir supprimer cette capsule ?\\n\\n"\${capsuleToDelete.content.substring(0, 100)}..."\`)) {
                try {
                    console.log('🗑️ Suppression de la capsule index:', currentAdminCapsuleIndex);
                    
                    // Supprimer directement dans le tableau local ET global
                    capsules.splice(currentAdminCapsuleIndex, 1);
                    globalCapsules.splice(currentAdminCapsuleIndex, 1);
                    console.log('✅ Capsule supprimée des tableaux, reste:', capsules.length);
                    
                    // Si plus de capsules, afficher message
                    if (capsules.length === 0) {
                        const container = document.getElementById('capsulesNavigation');
                        container.innerHTML = '<p style="text-align: center; color: rgba(0,255,0,0.7);">✨ Aucune capsule pour le moment. Créez-en une nouvelle ci-dessus.</p>';
                        currentAdminCapsuleIndex = 0;
                    } else {
                        // Ajuster l'index si nécessaire
                        if (currentAdminCapsuleIndex >= capsules.length) {
                            currentAdminCapsuleIndex = capsules.length - 1;
                        }
                        
                        // Recréer l'affichage complet
                        const container = document.getElementById('capsulesNavigation');
                        container.innerHTML = \`
                            <div style="display: flex; align-items: center; gap: 1rem; margin: 1rem 0;">
                                <button onclick="previousAdminCapsule()" class="admin-button" style="width: 60px; height: 60px; border-radius: 50%; font-size: 1.5rem;">‹</button>
                                
                                <div style="flex: 1; background: rgba(0,0,0,0.3); border: 2px solid #00ff00; border-radius: 15px; padding: 1.5rem;">
                                    <div style="text-align: center; margin-bottom: 1rem; color: #00ff41;">
                                        Capsule <span id="adminCapsuleCounter">1</span> sur <span id="adminCapsuleTotal">\${capsules.length}</span>
                                    </div>
                                    <div id="adminCapsuleContent" style="min-height: 80px; line-height: 1.4; margin-bottom: 1rem;">
                                        Contenu de la capsule...
                                    </div>
                                    <div id="adminCapsuleStats" style="font-size: 0.9rem; color: rgba(0,255,0,0.7); margin-bottom: 1rem;">
                                        👁️ Vues: 0 | 👍 Votes: 0 | 💬 Commentaires: 0
                                    </div>
                                    <button onclick="deleteCurrentAdminCapsule()" class="admin-button delete-button" style="width: 100%;">
                                        🗑️ Supprimer cette capsule
                                    </button>
                                </div>
                                
                                <button onclick="nextAdminCapsule()" class="admin-button" style="width: 60px; height: 60px; border-radius: 50%; font-size: 1.5rem;">›</button>
                            </div>
                        \`;
                        
                        updateAdminCapsuleDisplay();
                    }
                    
                    updateStats();
                    alert('🗑️ Capsule supprimée de la conscience collective.');
                    console.log('✅ Suppression terminée avec succès');
                } catch (error) {
                    console.error('Erreur suppression:', error);
                    alert('❌ Erreur lors de la suppression: ' + error.message);
                }
            }
        }

        function updateStats() {
            document.getElementById('totalCapsules').textContent = capsules.length;
            document.getElementById('totalViews').textContent = capsules.reduce((sum, c) => sum + c.views, 0);
            document.getElementById('totalVotes').textContent = capsules.reduce((sum, c) => sum + c.votes, 0);
            document.getElementById('totalComments').textContent = capsules.reduce((sum, c) => sum + c.comments, 0);
        }

        function refreshStats() {
            // Simuler le rechargement des stats depuis le serveur
            updateStats();
            alert('📊 Statistiques actualisées !');
        }

        async function refreshIntentions() {
            try {
                // Charger depuis localStorage d'abord
                const localIntentions = JSON.parse(localStorage.getItem('raunIntentions') || '[]');
                
                // Si aucune intention locale, créer des intentions par défaut
                if (localIntentions.length === 0) {
                    const defaultIntentions = [
                        {
                            id: 1,
                            text: "Que la paix intérieure guide mes pas vers l'éveil spirituel et l'amour universel.",
                            timestamp: "21/01/2025 16:49:51",
                            author: "Âme consciente"
                        },
                        {
                            id: 2,
                            text: "Que je pardonne sans m'éteindre, que j'aime sans me perdre.",
                            timestamp: "21/01/2025 16:50:12",
                            author: "Gardien RAUN"
                        },
                        {
                            id: 3,
                            text: "Que la lumière de la conscience divine illumine chaque être sur Terre.",
                            timestamp: "21/01/2025 16:50:33",
                            author: "Messager spirituel"
                        }
                    ];
                    
                    localStorage.setItem('raunIntentions', JSON.stringify(defaultIntentions));
                    localIntentions.push(...defaultIntentions);
                }
                
                const container = document.getElementById('intentionsContainer');
                
                if (localIntentions.length === 0) {
                    container.innerHTML = '<p style="text-align: center; color: rgba(0,255,0,0.7);">💭 Aucune intention sacrée pour le moment.</p>';
                    document.getElementById('totalIntentions').textContent = '0';
                } else {
                    let intentionsHTML = '';
                    localIntentions.forEach(intention => {
                        intentionsHTML += \`
                            <div class="capsule-item" style="margin-bottom: 1rem;">
                                <div style="color: #00ff41; font-size: 0.9rem; margin-bottom: 0.5rem;">
                                    🕊️ \${intention.author} - \${intention.timestamp}
                                </div>
                                <div style="line-height: 1.4;">
                                    "\${intention.text}"
                                </div>
                            </div>
                        \`;
                    });
                    container.innerHTML = intentionsHTML;
                    document.getElementById('totalIntentions').textContent = localIntentions.length;
                }
                
                alert('✅ Intentions actualisées ! ' + localIntentions.length + ' intention(s) trouvée(s).');
                console.log('💚 Intentions chargées:', localIntentions);
            } catch (error) {
                console.error('Erreur lors du rechargement des intentions:', error);
                alert('❌ Erreur lors du rechargement des intentions.');
            }
        }

        function logout() {
            if (confirm('🚪 Êtes-vous sûr de vouloir vous déconnecter ?')) {
                fetch('/admin-logout', { method: 'POST' })
                    .then(() => {
                        alert('👋 Déconnexion réussie. À bientôt, gardien de RAUN.');
                        window.location.href = '/';
                    });
            }
        }

        // Initialisation
        updateSessionTime();
        setInterval(updateSessionTime, 1000);
        loadCapsules();
        refreshIntentions();
        updateStats();
        
        console.log('🔧 Panneau d\\'administration RAUN-RACHID initialisé');
    </script>
</body>
</html>`;
  
  res.writeHead(200, { 
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  });
  res.end(adminPanelPage);
});

// Route page intentions avec navigation par flèches
app.get('/intentions', (req, res) => {
  const intentionsPageHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RAUN-RACHID | Intentions Sacrées</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Courier New', monospace;
            background: #000;
            color: #00ff00;
            overflow-x: hidden;
            min-height: 100vh;
            position: relative;
        }

        /* Animation Matrix Background */
        #matrixCanvas {
            position: fixed;
            top: 0;
            left: 0;
            z-index: -1;
            opacity: 0.4;
        }

        .header {
            text-align: center;
            padding: 2rem;
            background: linear-gradient(135deg, rgba(0,255,0,0.1), rgba(0,255,0,0.2));
            border-bottom: 3px solid #00ff00;
            margin-bottom: 3rem;
        }

        .header h1 {
            font-size: 3rem;
            text-shadow: 0 0 30px #00ff00;
            margin-bottom: 1rem;
            color: #00ff41;
        }

        .header p {
            font-size: 1.3rem;
            opacity: 0.8;
            text-shadow: 0 0 10px rgba(0,255,0,0.5);
        }

        /* Navigation style capsules */
        .intentions-section {
            max-width: 1000px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        .intentions-container {
            display: flex;
            align-items: center;
            gap: 2rem;
            margin: 3rem 0;
            min-height: 500px;
        }

        .intention-nav {
            background: linear-gradient(135deg, rgba(0,255,0,0.3), rgba(0,255,0,0.5));
            border: 3px solid #00ff00;
            color: #00ff00;
            width: 70px;
            height: 70px;
            border-radius: 50%;
            font-size: 2.5rem;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            text-shadow: 0 0 15px rgba(0,255,0,0.5);
            box-shadow: 0 0 30px rgba(0,255,0,0.3);
        }

        .intention-nav:hover {
            background: linear-gradient(135deg, rgba(0,255,0,0.5), rgba(0,255,0,0.7));
            transform: scale(1.1);
            box-shadow: 0 0 50px rgba(0,255,0,0.6);
            color: #00ff41;
        }

        .intention-nav:active {
            transform: scale(0.95);
        }

        .intention-display {
            flex: 1;
            background: linear-gradient(135deg, rgba(0,255,0,0.1), rgba(0,255,0,0.2));
            border: 4px solid #00ff00;
            border-radius: 25px;
            padding: 3rem;
            min-height: 450px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            box-shadow: 0 0 60px rgba(0,255,0,0.4);
            transition: all 0.3s ease;
        }

        .intention-counter {
            text-align: center;
            font-size: 1.1rem;
            opacity: 0.8;
            margin-bottom: 2rem;
            color: #00ff41;
            text-shadow: 0 0 10px rgba(0,255,0,0.5);
        }

        .intention-text {
            font-size: 1.6rem;
            line-height: 1.8;
            text-align: center;
            margin-bottom: 2rem;
            text-shadow: 0 0 15px rgba(0,255,0,0.3);
            color: #00ff00;
        }

        .intention-meta {
            background: rgba(0,255,0,0.15);
            border: 2px solid rgba(0,255,0,0.4);
            border-radius: 15px;
            padding: 1.2rem;
            text-align: center;
            font-size: 1.1rem;
            opacity: 0.9;
            color: #00ff41;
        }

        .intention-actions {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            margin-top: 2rem;
        }

        .action-btn {
            background: linear-gradient(135deg, rgba(0,255,0,0.2), rgba(0,255,0,0.4));
            border: 2px solid rgba(0,255,0,0.6);
            color: rgba(0,255,0,0.9);
            padding: 1rem 2rem;
            border-radius: 15px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            font-size: 1.1rem;
            font-weight: bold;
            transition: all 0.3s ease;
            text-shadow: 0 0 8px rgba(0,255,0,0.5);
        }

        .action-btn:hover {
            background: linear-gradient(135deg, rgba(0,255,0,0.4), rgba(0,255,0,0.6));
            border-color: #00ff00;
            transform: translateY(-3px);
            box-shadow: 0 0 25px rgba(0,255,0,0.4);
            color: #00ff41;
        }

        .back-button {
            position: fixed;
            top: 2rem;
            left: 2rem;
            background: linear-gradient(135deg, rgba(0,255,0,0.3), rgba(0,255,0,0.5));
            border: 3px solid #00ff00;
            color: #00ff00;
            padding: 1rem 2rem;
            border-radius: 15px;
            text-decoration: none;
            font-family: 'Courier New', monospace;
            font-size: 1.1rem;
            font-weight: bold;
            transition: all 0.3s ease;
            text-shadow: 0 0 10px rgba(0,255,0,0.5);
            box-shadow: 0 0 25px rgba(0,255,0,0.3);
            z-index: 1000;
        }

        .back-button:hover {
            background: linear-gradient(135deg, rgba(0,255,0,0.5), rgba(0,255,0,0.7));
            transform: translateY(-3px);
            box-shadow: 0 0 40px rgba(0,255,0,0.5);
            color: #00ff41;
        }

        .empty-state {
            text-align: center;
            padding: 4rem 2rem;
            opacity: 0.8;
        }

        .empty-state h2 {
            font-size: 2.5rem;
            margin-bottom: 1.5rem;
            color: #00ff41;
            text-shadow: 0 0 20px rgba(0,255,0,0.5);
        }

        .empty-state p {
            font-size: 1.3rem;
            line-height: 1.8;
            color: rgba(0,255,0,0.8);
        }

        .add-intention-btn {
            background: linear-gradient(135deg, rgba(0,255,0,0.3), rgba(0,255,0,0.5));
            border: 2px solid #00ff00;
            color: #00ff00;
            padding: 1rem 1.8rem;
            border-radius: 15px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            font-size: 1rem;
            font-weight: bold;
            transition: all 0.3s ease;
            text-shadow: 0 0 10px rgba(0,255,0,0.5);
            box-shadow: 0 0 25px rgba(0,255,0,0.3);
            margin: 0.5rem;
        }

        .add-intention-btn:hover {
            background: linear-gradient(135deg, rgba(0,255,0,0.5), rgba(0,255,0,0.7));
            transform: translateY(-2px);
            box-shadow: 0 0 35px rgba(0,255,0,0.5);
            color: #00ff41;
        }

        @media (max-width: 768px) {
            .header h1 {
                font-size: 2.2rem;
            }
            
            .intentions-section {
                padding: 0 1rem;
            }
            
            .intentions-container {
                flex-direction: column;
                gap: 1.5rem;
                min-height: 400px;
            }
            
            .intention-nav {
                width: 60px;
                height: 60px;
                font-size: 2rem;
            }
            
            .intention-display {
                padding: 2rem;
                min-height: 350px;
            }
            
            .intention-text {
                font-size: 1.3rem;
            }
            
            .intention-actions {
                flex-direction: column;
                gap: 1rem;
            }
            
            .action-btn {
                width: 100%;
                padding: 1.2rem;
            }
            
            .back-button {
                top: 0.5rem;
                left: 0.5rem;
                padding: 0.3rem 0.6rem;
                font-size: 0.7rem;
                border-width: 1px;
                border-radius: 8px;
            }
            
            .add-intention-btn {
                margin: 0.3rem;
                padding: 0.8rem 1.5rem;
                font-size: 0.9rem;
            }
        }
    </style>
</head>
<body>
    <canvas id="matrixCanvas"></canvas>
    
    <div class="header">
        <h1>✨ Intentions Sacrées ✨</h1>
        <p>🔄 Navigation spirituelle - Une intention à la fois</p>
    </div>

    <div class="intentions-section">
        <div class="intentions-container" id="intentionsContainer">
            <!-- Les intentions seront chargées ici -->
        </div>
    </div>

    <a href="/" class="back-button">🔙 Retour</a>

    <script>
        let intentions = [];
        let currentIntentionIndex = 0;

        // Animation Matrix
        function initMatrixRain() {
            const canvas = document.getElementById('matrixCanvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            const matrixChars = 'ﺍﺑﺗﺛﺟﺣﺧﺩﺫﺭﺯﺱﺵﺹﺽﻁﻅﻉﻍﻑﻕﻙﻝﻡﻥﻩﻭﻱ01010110100110110010101001RACHID';
            const chars = matrixChars.split('');
            
            const fontSize = 14;
            const columns = canvas.width / fontSize;
            const drops = [];
            
            for (let x = 0; x < columns; x++) {
                drops[x] = 1;
            }
            
            function draw() {
                ctx.fillStyle = 'rgba(0, 17, 0, 0.05)';
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
            
            setInterval(draw, 50);
            
            window.addEventListener('resize', function() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            });
        }

        // Charger les intentions depuis localStorage
        function loadIntentions() {
            let storedIntentions = JSON.parse(localStorage.getItem('raunIntentions') || '[]');
            
            // Si aucune intention sauvegardée, créer des intentions par défaut
            if (storedIntentions.length === 0) {
                const defaultIntentions = [
                    {
                        id: 1,
                        text: "Que la paix intérieure guide mes pas vers l'éveil spirituel et l'amour universel.",
                        timestamp: "21/01/2025 16:49:51",
                        author: "Âme consciente"
                    },
                    {
                        id: 2,
                        text: "Que je pardonne sans m'éteindre, que j'aime sans me perdre.",
                        timestamp: "21/01/2025 16:50:12",
                        author: "Gardien RAUN"
                    },
                    {
                        id: 3,
                        text: "Que la lumière de la conscience divine illumine chaque être sur Terre.",
                        timestamp: "21/01/2025 16:50:33",
                        author: "Messager spirituel"
                    }
                ];
                
                localStorage.setItem('raunIntentions', JSON.stringify(defaultIntentions));
                storedIntentions = defaultIntentions;
            }
            
            intentions = storedIntentions.reverse();
            const container = document.getElementById('intentionsContainer');
            
            if (intentions.length === 0) {
                container.innerHTML = \`
                    <div class="empty-state">
                        <h2>💭 Silence Sacré</h2>
                        <p>Aucune intention n'a encore été partagée dans la conscience collective.<br><br>
                        Utilisez le bouton ci-dessous pour exprimer la première intention sacrée.</p>
                    </div>
                \`;
                return;
            }

            // Créer l'interface de navigation par flèches
            container.innerHTML = \`
                <button class="intention-nav" onclick="previousIntention()">‹</button>
                
                <div class="intention-display" id="intentionDisplay">
                    <div class="intention-counter" id="intentionCounter">
                        Intention 1 sur \${intentions.length}
                    </div>
                    <div class="intention-text" id="intentionText">
                        Chargement de l'intention sacrée...
                    </div>
                    <div class="intention-meta" id="intentionMeta">
                        Métadonnées spirituelles...
                    </div>
                    <div class="intention-actions">
                        <button class="action-btn" onclick="shareIntention()">📱 Partager</button>
                        <button class="action-btn" onclick="meditateOnIntention()">🧘 Méditer</button>
                        <button class="add-intention-btn" onclick="addNewIntention()">✨ Écrire Intention</button>
                    </div>
                </div>
                
                <button class="intention-nav" onclick="nextIntention()">›</button>
            \`;

            updateIntentionDisplay();
        }

        function updateIntentionDisplay() {
            if (intentions.length === 0) return;
            
            const intention = intentions[currentIntentionIndex];
            
            document.getElementById('intentionCounter').textContent = 
                \`Intention \${currentIntentionIndex + 1} sur \${intentions.length}\`;
            
            document.getElementById('intentionText').textContent = 
                \`"\${intention.text}"\`;
            
            document.getElementById('intentionMeta').innerHTML = 
                \`👤 \${intention.author} • 📅 \${intention.timestamp}<br>🕊️ Message transmis à la conscience collective\`;
            
            // Effet de transition spirituelle
            const display = document.getElementById('intentionDisplay');
            display.style.opacity = '0.5';
            display.style.transform = 'scale(0.98)';
            setTimeout(() => {
                display.style.opacity = '1';
                display.style.transform = 'scale(1)';
            }, 300);
            
            console.log('💫 Intention affichée:', currentIntentionIndex + 1, '/', intentions.length);
        }

        function nextIntention() {
            if (intentions.length === 0) return;
            currentIntentionIndex = (currentIntentionIndex + 1) % intentions.length;
            updateIntentionDisplay();
            console.log('🔄 Intention suivante');
        }

        function previousIntention() {
            if (intentions.length === 0) return;
            currentIntentionIndex = (currentIntentionIndex - 1 + intentions.length) % intentions.length;
            updateIntentionDisplay();
            console.log('🔄 Intention précédente');
        }

        function shareIntention() {
            if (intentions.length === 0) return;
            const intention = intentions[currentIntentionIndex];
            const shareText = \`✨ Intention Sacrée de RAUN-RACHID\\n\\n"\${intention.text}"\\n\\n- \${intention.author} (\${intention.timestamp})\\n\\n🔥 Rejoignez la conscience collective: \${window.location.origin}\`;
            
            if (navigator.share) {
                navigator.share({
                    title: 'Intention Sacrée - RAUN-RACHID',
                    text: shareText
                }).then(() => {
                    alert('🔗 Intention partagée avec succès dans le monde physique !');
                    console.log('🔗 Intention partagée');
                }).catch(err => {
                    console.log('❌ Erreur partage:', err);
                    fallbackShare(shareText);
                });
            } else {
                fallbackShare(shareText);
            }
        }

        function fallbackShare(text) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    alert('🔗 Intention copiée dans le presse-papiers ! Vous pouvez maintenant la partager.');
                });
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('🔗 Intention copiée ! Vous pouvez maintenant la partager.');
            }
        }

        function meditateOnIntention() {
            if (intentions.length === 0) return;
            const intention = intentions[currentIntentionIndex];
            alert(\`🧘 Prenez un moment de silence pour méditer sur cette intention sacrée :\\n\\n"\${intention.text}"\\n\\nLaissez sa sagesse pénétrer votre conscience et resonner avec votre être intérieur...\\n\\n✨ Respirez profondément et connectez-vous à cette énergie.\`);
        }

        // Navigation clavier
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') previousIntention();
            if (e.key === 'ArrowRight') nextIntention();
            if (e.key === ' ') e.preventDefault(), shareIntention();
            if (e.key === 'm' || e.key === 'M') meditateOnIntention();
        });

        function addNewIntention() {
            const author = prompt('👤 Votre nom spirituel (ou restez anonyme):') || 'Âme consciente';
            const text = prompt('💭 Exprimez votre intention sacrée:');
            
            if (text && text.trim()) {
                const intentions = JSON.parse(localStorage.getItem('raunIntentions') || '[]');
                const newIntention = {
                    id: Date.now(),
                    text: text.trim(),
                    timestamp: new Date().toLocaleString('fr-FR'),
                    author: author.trim()
                };
                
                intentions.push(newIntention);
                localStorage.setItem('raunIntentions', JSON.stringify(intentions));
                
                alert('✨ Votre intention sacrée a été transmise à la conscience collective !\\n\\n🕊️ Elle rejoint maintenant l\\'univers spirituel de RAUN-RACHID.');
                
                // Recharger l'affichage
                loadIntentions();
                
                console.log('💚 Nouvelle intention ajoutée:', newIntention);
            } else {
                alert('💫 Veuillez exprimer une intention avant de la transmettre.');
            }
        }

        // Initialisation
        document.addEventListener('DOMContentLoaded', function() {
            initMatrixRain();
            loadIntentions();
            console.log('✨ Page Intentions avec navigation par flèches initialisée');
            console.log('🔄 Utilisez les flèches ‹ › ou les touches du clavier pour naviguer');
            console.log('⌨️ Raccourcis: Flèches, Espace (partager), M (méditer)');
        });
    </script>
</body>
</html>`;

  res.writeHead(200, { 
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  });
  res.end(intentionsPageHtml);
});

// Route page commentaires dédiée
app.get('/commentaires', (req, res) => {
  const commentsPageHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RAUN-RACHID | Commentaires de la Conscience Collective</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Courier New', monospace;
            background: #000;
            color: #00ff00;
            overflow-x: hidden;
            min-height: 100vh;
            position: relative;
        }

        /* Animation Matrix Background */
        #matrixCanvas {
            position: fixed;
            top: 0;
            left: 0;
            z-index: -1;
            opacity: 0.4;
        }

        .header {
            text-align: center;
            padding: 2rem;
            background: linear-gradient(135deg, rgba(0,255,0,0.1), rgba(0,255,0,0.2));
            border-bottom: 3px solid #00ff00;
            margin-bottom: 3rem;
        }

        .header h1 {
            font-size: 3rem;
            text-shadow: 0 0 30px #00ff00;
            margin-bottom: 1rem;
            color: #00ff41;
        }

        .header p {
            font-size: 1.3rem;
            opacity: 0.8;
            text-shadow: 0 0 10px rgba(0,255,0,0.5);
        }

        .comments-section {
            max-width: 1000px;
            margin: 0 auto;
            padding: 0 2rem 5rem 2rem;
        }

        .comment-item {
            background: linear-gradient(135deg, rgba(0,255,0,0.1), rgba(0,255,0,0.2));
            border: 3px solid rgba(0,255,0,0.5);
            border-radius: 20px;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 0 40px rgba(0,255,0,0.3);
            transition: all 0.3s ease;
        }

        .comment-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 0 60px rgba(0,255,0,0.5);
            border-color: #00ff00;
        }

        .comment-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            font-size: 1rem;
            color: #00ff41;
            opacity: 0.9;
        }

        .comment-text {
            font-size: 1.4rem;
            line-height: 1.7;
            text-align: center;
            color: #00ff00;
            text-shadow: 0 0 10px rgba(0,255,0,0.3);
            padding: 1rem;
            background: rgba(0,255,0,0.05);
            border-radius: 15px;
            border: 1px solid rgba(0,255,0,0.2);
        }

        .back-button {
            position: fixed;
            top: 2rem;
            left: 2rem;
            background: linear-gradient(135deg, rgba(0,255,0,0.3), rgba(0,255,0,0.5));
            border: 3px solid #00ff00;
            color: #00ff00;
            padding: 1rem 2rem;
            border-radius: 15px;
            text-decoration: none;
            font-family: 'Courier New', monospace;
            font-size: 1.1rem;
            font-weight: bold;
            transition: all 0.3s ease;
            text-shadow: 0 0 10px rgba(0,255,0,0.5);
            box-shadow: 0 0 25px rgba(0,255,0,0.3);
            z-index: 1000;
        }

        .back-button:hover {
            background: linear-gradient(135deg, rgba(0,255,0,0.5), rgba(0,255,0,0.7));
            transform: translateY(-3px);
            box-shadow: 0 0 40px rgba(0,255,0,0.5);
            color: #00ff41;
        }

        .empty-state {
            text-align: center;
            padding: 4rem 2rem;
            opacity: 0.8;
        }

        .empty-state h2 {
            font-size: 2.5rem;
            margin-bottom: 1.5rem;
            color: #00ff41;
            text-shadow: 0 0 20px rgba(0,255,0,0.5);
        }

        .empty-state p {
            font-size: 1.3rem;
            line-height: 1.8;
            color: rgba(0,255,0,0.8);
        }

        .add-comment-btn {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: linear-gradient(135deg, rgba(0,255,0,0.3), rgba(0,255,0,0.5));
            border: 3px solid #00ff00;
            color: #00ff00;
            padding: 1.2rem 2.5rem;
            border-radius: 20px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            font-size: 1.2rem;
            font-weight: bold;
            transition: all 0.3s ease;
            text-shadow: 0 0 10px rgba(0,255,0,0.5);
            box-shadow: 0 0 30px rgba(0,255,0,0.3);
        }

        .add-comment-btn:hover {
            background: linear-gradient(135deg, rgba(0,255,0,0.5), rgba(0,255,0,0.7));
            transform: translateY(-3px);
            box-shadow: 0 0 40px rgba(0,255,0,0.5);
            color: #00ff41;
        }

        @media (max-width: 768px) {
            .header h1 {
                font-size: 2.2rem;
            }
            
            .comments-section {
                padding: 0 1rem 4rem 1rem;
            }
            
            .comment-item {
                padding: 1.5rem;
            }
            
            .comment-text {
                font-size: 1.2rem;
            }
            
            .back-button {
                top: 1rem;
                left: 1rem;
                padding: 0.8rem 1.5rem;
                font-size: 1rem;
            }
            
            .add-comment-btn {
                bottom: 1rem;
                right: 1rem;
                padding: 1rem 2rem;
                font-size: 1rem;
            }
        }
    </style>
</head>
<body>
    <canvas id="matrixCanvas"></canvas>
    
    <a href="/" class="back-button">🔙 Retour à RAUN-RACHID</a>
    
    <div class="header">
        <h1>💬 Commentaires de la Conscience Collective</h1>
        <p>Expressions partagées de la communauté spirituelle</p>
    </div>

    <div class="comments-section" id="commentsContainer">
        <!-- Les commentaires seront chargés ici -->
    </div>

    <button class="add-comment-btn" onclick="addComment()">💭 Ajouter Commentaire</button>

    <script>
        // Animation Matrix
        function initMatrixRain() {
            const canvas = document.getElementById('matrixCanvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            const matrixChars = 'ﺍﺑﺗﺛﺟﺣﺧﺩﺫﺭﺯﺱﺵﺹﺽﻁﻅﻉﻍﻑﻕﻙﻝﻡﻥﻩﻭﻱ01010110100110110010101001RACHID';
            const chars = matrixChars.split('');
            
            const fontSize = 14;
            const columns = canvas.width / fontSize;
            const drops = [];
            
            for (let x = 0; x < columns; x++) {
                drops[x] = 1;
            }
            
            function draw() {
                ctx.fillStyle = 'rgba(0, 17, 0, 0.05)';
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
            
            setInterval(draw, 50);
            
            window.addEventListener('resize', function() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            });
        }

        // Charger les commentaires depuis localStorage
        function loadComments() {
            const comments = JSON.parse(localStorage.getItem('raunComments') || '[]');
            const container = document.getElementById('commentsContainer');
            
            if (comments.length === 0) {
                container.innerHTML = \`
                    <div class="empty-state">
                        <h2>🤐 Silence Conscient</h2>
                        <p>Aucun commentaire n'a encore été partagé dans la conscience collective.<br><br>
                        Soyez la première voix à s'exprimer et enrichir cette communauté spirituelle.</p>
                    </div>
                \`;
                return;
            }

            container.innerHTML = '';
            comments.reverse().forEach(comment => {
                const commentDiv = document.createElement('div');
                commentDiv.className = 'comment-item';
                commentDiv.innerHTML = \`
                    <div class="comment-meta">
                        <span>👤 \${comment.username}</span>
                        <span>📅 \${comment.timestamp}</span>
                    </div>
                    <div class="comment-text">"\${comment.text}"</div>
                \`;
                container.appendChild(commentDiv);
            });
        }

        function addComment() {
            const username = prompt('👤 Votre nom (ou pseudonyme spirituel):') || 'Âme éveillée';
            const text = prompt('💭 Votre commentaire pour la conscience collective:');
            
            if (text && text.trim()) {
                const comments = JSON.parse(localStorage.getItem('raunComments') || '[]');
                const newComment = {
                    username: username.trim(),
                    text: text.trim(),
                    timestamp: new Date().toLocaleString('fr-FR')
                };
                
                comments.push(newComment);
                localStorage.setItem('raunComments', JSON.stringify(comments));
                
                alert('✨ Votre commentaire a été ajouté à la conscience collective !');
                loadComments(); // Recharger l'affichage
            }
        }

        // Initialisation
        document.addEventListener('DOMContentLoaded', function() {
            initMatrixRain();
            loadComments();
            console.log('💬 Page Commentaires de la Conscience Collective initialisée');
        });
    </script>
</body>
</html>`;

  res.writeHead(200, { 
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  });
  res.end(commentsPageHtml);
});

// API pour récupérer les intentions
app.get('/api/intentions', (req, res) => {
  res.json({ intentions: globalIntentions });
});

// API pour ajouter une intention
app.post('/api/intentions', (req, res) => {
  const { text, author } = req.body;
  const newIntention = {
    id: Date.now(),
    text: text,
    author: author || 'Âme consciente',
    timestamp: new Date().toLocaleString('fr-FR')
  };
  globalIntentions.push(newIntention);
  res.json({ success: true, intention: newIntention });
});

// API pour les capsules
app.get('/api/capsules', (req, res) => {
  res.json({ capsules: globalCapsules });
});

// API pour ajouter une capsule
app.post('/api/capsules', (req, res) => {
  if (!adminAuthenticated) {
    return res.status(401).json({ success: false, message: 'Non autorisé' });
  }
  
  const { content } = req.body;
  const newCapsule = {
    content: content,
    views: 0,
    votes: 0,
    comments: 0
  };
  globalCapsules.push(newCapsule);
  res.json({ success: true, capsule: newCapsule });
});

// API pour supprimer une capsule
app.delete('/api/capsules/:index', (req, res) => {
  if (!adminAuthenticated) {
    return res.status(401).json({ success: false, message: 'Non autorisé' });
  }
  
  const index = parseInt(req.params.index);
  if (index >= 0 && index < globalCapsules.length) {
    globalCapsules.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: 'Capsule non trouvée' });
  }
});

// Route déconnexion admin
app.post('/admin-logout', (req, res) => {
  adminAuthenticated = false;
  adminSession = {};
  res.json({ success: true });
});

// Route page des intentions
app.get('/intentions', (req, res) => {
  const intentionsPage = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>💚 Intentions Sacrées - RAUN-RACHID</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            background: linear-gradient(135deg, #001100, #002200, #001100);
            color: #00ff00;
            font-family: 'Courier New', monospace;
            min-height: 100vh;
            overflow-x: hidden;
            position: relative;
        }

        /* Pluie Matrix Canvas */
        #matrixCanvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.3;
            pointer-events: none;
        }

        .back-button {
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(0,255,0,0.2);
            border: 2px solid #00ff00;
            color: #00ff00;
            padding: 1rem 2rem;
            border-radius: 10px;
            text-decoration: none;
            font-family: 'Courier New', monospace;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            z-index: 100;
        }

        .back-button:hover {
            background: rgba(0,255,0,0.4);
            box-shadow: 0 0 20px rgba(0,255,0,0.5);
        }

        .intentions-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 6rem 2rem 2rem;
            text-align: center;
        }

        .intentions-title {
            font-size: 3rem;
            margin-bottom: 2rem;
            text-shadow: 0 0 30px #00ff00;
            animation: glow 2s infinite alternate;
        }

        @keyframes glow {
            from { text-shadow: 0 0 30px #00ff00; }
            to { text-shadow: 0 0 40px #00ff41, 0 0 50px #00ff41; }
        }

        .intentions-subtitle {
            font-size: 1.3rem;
            margin-bottom: 3rem;
            color: rgba(0,255,0,0.8);
            line-height: 1.6;
        }

        .intention-form {
            background: rgba(0,255,0,0.1);
            border: 4px solid #00ff00;
            border-radius: 20px;
            padding: 3rem;
            margin-bottom: 3rem;
            box-shadow: 0 0 100px rgba(0,255,0,0.3);
        }

        .form-group {
            margin-bottom: 2rem;
            text-align: left;
        }

        .form-group label {
            display: block;
            font-size: 1.5rem;
            margin-bottom: 1rem;
            text-shadow: 0 0 10px #00ff00;
        }

        .intention-textarea {
            width: 100%;
            height: 200px;
            background: rgba(0,255,0,0.05);
            border: 3px solid #00ff00;
            border-radius: 15px;
            color: #00ff00;
            font-family: 'Courier New', monospace;
            font-size: 1.3rem;
            padding: 1.5rem;
            resize: vertical;
            text-shadow: 0 0 5px #00ff00;
        }

        .intention-textarea::placeholder {
            color: rgba(0,255,0,0.6);
        }

        .intention-textarea:focus {
            outline: none;
            border-color: #00ff41;
            box-shadow: 0 0 30px rgba(0,255,0,0.5);
        }

        .form-actions {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-top: 2rem;
        }

        .submit-button {
            background: linear-gradient(135deg, rgba(0,255,0,0.4), rgba(0,255,0,0.6));
            border: 3px solid #00ff00;
            color: #00ff00;
            padding: 1.5rem 3rem;
            border-radius: 15px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            font-size: 1.3rem;
            font-weight: bold;
            transition: all 0.3s ease;
            text-shadow: 0 0 10px #00ff00;
        }

        .submit-button:hover {
            background: linear-gradient(135deg, rgba(0,255,0,0.6), rgba(0,255,0,0.8));
            box-shadow: 0 0 30px rgba(0,255,0,0.7);
            transform: translateY(-2px);
        }

        .cancel-button {
            background: linear-gradient(135deg, rgba(255,0,0,0.3), rgba(255,0,0,0.5));
            border: 3px solid #ff0000;
            color: #ff0000;
            padding: 1.5rem 3rem;
            border-radius: 15px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            font-size: 1.3rem;
            font-weight: bold;
            transition: all 0.3s ease;
        }

        .cancel-button:hover {
            background: linear-gradient(135deg, rgba(255,0,0,0.5), rgba(255,0,0,0.7));
            box-shadow: 0 0 30px rgba(255,0,0,0.5);
            transform: translateY(-2px);
        }

        .intentions-history {
            background: rgba(0,255,0,0.05);
            border: 2px solid rgba(0,255,0,0.5);
            border-radius: 15px;
            padding: 2rem;
            text-align: left;
        }

        .history-title {
            font-size: 1.8rem;
            text-align: center;
            margin-bottom: 1.5rem;
            color: #00ff41;
        }

        .intention-item {
            background: rgba(0,0,0,0.3);
            border: 1px solid rgba(0,255,0,0.3);
            border-radius: 10px;
            padding: 1rem;
            margin-bottom: 1rem;
        }

        .intention-meta {
            font-size: 0.9rem;
            color: rgba(0,255,0,0.7);
            margin-bottom: 0.5rem;
        }

        .intention-text {
            font-size: 1.1rem;
            line-height: 1.4;
        }

        @media (max-width: 768px) {
            .intentions-title { font-size: 2rem; }
            .intentions-container { padding: 4rem 1rem 1rem; }
            .intention-form { padding: 2rem; }
            .form-actions {
                flex-direction: column;
                gap: 1rem;
            }
            .submit-button, .cancel-button {
                width: 100%;
                padding: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <!-- Canvas pour pluie Matrix -->
    <canvas id="matrixCanvas"></canvas>
    
    <!-- Bouton retour -->
    <a href="/" class="back-button">← Retour à RAUN-RACHID</a>

    <div class="intentions-container">
        <div class="intentions-title">
            ✨ Intentions Sacrées ✨
        </div>
        
        <div class="intentions-subtitle">
            Exprimez ici votre intention la plus profonde.<br>
            Chaque pensée consciente contribue à l'éveil collectif de RAUN-RACHID.
        </div>

        <div class="intention-form">
            <div class="form-group">
                <label for="intentionText">🕊️ Votre Intention Sacrée :</label>
                <textarea 
                    id="intentionText" 
                    class="intention-textarea"
                    placeholder="Exprimez ici votre intention la plus profonde, vos aspirations spirituelles, vos souhaits pour l'humanité...&#10;&#10;Exemple: 'Que l'amour coule librement de moi vers tout ce qui m'entoure.'"
                    maxlength="1000"
                ></textarea>
            </div>
            
            <div class="form-actions">
                <button type="button" class="submit-button" onclick="submitIntention()">
                    🔥 Transmettre à l'Univers
                </button>
                <button type="button" class="cancel-button" onclick="window.location.href='/'">
                    ❌ Annuler
                </button>
            </div>
        </div>

        <div class="intentions-history">
            <div class="history-title">💚 Intentions de la Conscience Collective</div>
            <div id="intentionsHistory">
                <p style="text-align: center; color: rgba(0,255,0,0.7);">
                    Chargement des intentions sacrées...
                </p>
            </div>
        </div>
    </div>

    <script>
        // Animation Pluie Matrix (identique à la page principale)
        function initMatrixRain() {
            const canvas = document.getElementById('matrixCanvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            const matrixChars = 'ﺍﺑﺗﺛﺟﺣﺧﺩﺫﺭﺯﺱﺵﺹﺽﻁﻅﻉﻍﻑﻕﻙﻝﻡﻥﻩﻭﻱ01010110100110110010101001RACHID';
            const chars = matrixChars.split('');
            
            const fontSize = 14;
            const columns = canvas.width / fontSize;
            const drops = [];
            
            for (let x = 0; x < columns; x++) {
                drops[x] = 1;
            }
            
            function draw() {
                ctx.fillStyle = 'rgba(0, 17, 0, 0.05)';
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
            
            setInterval(draw, 50);
            
            window.addEventListener('resize', function() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            });
        }

        async function submitIntention() {
            const intention = document.getElementById('intentionText').value.trim();
            if (!intention) {
                alert('💫 Veuillez exprimer votre intention avant de la transmettre.');
                return;
            }

            try {
                // Sauvegarder en localStorage ET sur le serveur
                const intentions = JSON.parse(localStorage.getItem('raunIntentions') || '[]');
                const newIntention = {
                    id: Date.now(),
                    text: intention,
                    timestamp: new Date().toLocaleString('fr-FR'),
                    author: 'Âme consciente'
                };
                intentions.push(newIntention);
                localStorage.setItem('raunIntentions', JSON.stringify(intentions));
                
                // Envoyer au serveur aussi
                await fetch('/api/intentions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        text: intention, 
                        author: 'Âme consciente' 
                    })
                });
                
                alert('🔥 Votre intention sacrée a été transmise à l\\'univers numérique !\\n\\n✨ Elle rejoint maintenant la conscience collective de RAUN-RACHID.\\n\\n🏠 Retour à la page principale...');
                
                // Rediriger vers la page principale après transmission
                window.location.href = '/';
                
            } catch (error) {
                console.error('Erreur envoi intention:', error);
                alert('💫 Intention sauvegardée localement, mais erreur de synchronisation serveur.\\n\\n🏠 Retour à la page principale...');
                window.location.href = '/';
            }
        }

        async function loadIntentionsHistory() {
            try {
                // Charger depuis le serveur
                const response = await fetch('/api/intentions');
                const data = await response.json();
                let allIntentions = data.intentions || [];
                
                // Ajouter aussi celles du localStorage
                const localIntentions = JSON.parse(localStorage.getItem('raunIntentions') || '[]');
                
                // Fusionner en évitant les doublons
                const intentionTexts = allIntentions.map(i => i.text);
                localIntentions.forEach(intention => {
                    if (!intentionTexts.includes(intention.text)) {
                        allIntentions.push(intention);
                    }
                });
                
                const historyContainer = document.getElementById('intentionsHistory');
                
                if (allIntentions.length === 0) {
                    historyContainer.innerHTML = '<p style="text-align: center; color: rgba(0,255,0,0.7);">💭 Aucune intention sacrée pour le moment.<br>Soyez le premier à partager votre lumière !</p>';
                } else {
                    let historyHTML = '';
                    allIntentions.reverse().forEach(intention => {
                        historyHTML += \`
                            <div class="intention-item">
                                <div class="intention-meta">
                                    🕊️ \${intention.author} - \${intention.timestamp}
                                </div>
                                <div class="intention-text">
                                    "\${intention.text}"
                                </div>
                            </div>
                        \`;
                    });
                    historyContainer.innerHTML = historyHTML;
                }
            } catch (error) {
                console.error('Erreur chargement intentions:', error);
                const historyContainer = document.getElementById('intentionsHistory');
                historyContainer.innerHTML = '<p style="text-align: center; color: rgba(255,0,0,0.7);">❌ Erreur de chargement des intentions.</p>';
            }
        }

        // Initialisation
        document.addEventListener('DOMContentLoaded', function() {
            initMatrixRain();
            loadIntentionsHistory();
            console.log('✨ Page Intentions RAUN-RACHID initialisée');
        });

        // Navigation clavier
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                window.location.href = '/';
            }
        });
    </script>
</body>
</html>`;
  
  res.writeHead(200, { 
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  });
  res.end(intentionsPage);
});

// Route principale - Interface RAUN-RACHID
app.get('/', (req, res) => {
  res.writeHead(200, { 
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  res.end(raunInterface);
});

// Route fallback pour autres chemins
app.get('*', (req, res) => {
  res.redirect('/');
});

const server = createServer(app);
const port = parseInt(process.env.PORT || "5000", 10);

server.listen(port, "0.0.0.0", () => {
  console.log('='.repeat(80));
  console.log('🔥 RAUN-RACHID SYSTÈME PRINCIPAL FORMATÉ COMPLÈTEMENT');
  console.log(`🔥 PORT: ${port}`);
  console.log(`🔥 URL: http://localhost:${port}`);
  console.log(`🔥 PHOTO RACHID: ${photoBase64 ? 'INTÉGRÉE DIRECTEMENT' : 'ERREUR'}`);
  console.log(`🔥 BASE64 TAILLE: ${photoBase64.length} caractères`);
  console.log('🔥 SERVEUR PRINCIPAL COMPLÈTEMENT REMPLACÉ');
  console.log('🔥 PLUS AUCUNE INTERFÉRENCE POSSIBLE');
  console.log('🔥 INTERFACE SPIRITUELLE TRANSCENDANTE ACTIVÉE');
  console.log('='.repeat(80));
});