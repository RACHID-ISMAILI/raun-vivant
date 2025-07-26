// Configuration et données RAUN-RACHID LangueSage

// Capsules par défaut
const defaultCapsules = [
    {
        id: 1,
        title: "L'Éveil de la Conscience",
        content: "☀️ L'éveil commence par la reconnaissance de notre nature divine. Nous sommes des âmes incarnées, venues sur Terre pour expérimenter l'amour universel et transcender les illusions de la séparation. Chaque moment de présence authentique est une victoire contre l'illusion.",
        author: "RAUN-RACHID",
        views: 1247,
        likes: 89,
        createdAt: "2025-01-20T10:00:00.000Z"
    },
    {
        id: 2,
        title: "Le Feu Sacré de la Conscience",
        content: "🔥 La conscience est le feu sacré qui illumine notre chemin. Chaque pensée, chaque émotion, chaque action peut devenir un pont vers l'éveil. RAUN-RACHID t'invite à embrasser ton pouvoir créateur et à reconnaître la lumière éternelle qui brille en toi.",
        author: "RAUN-RACHID",
        views: 892,
        likes: 67,
        createdAt: "2025-01-19T15:30:00.000Z"
    },
    {
        id: 3,
        title: "Le Silence de l'Essence",
        content: "✨ Dans le silence de la méditation, nous retrouvons notre essence véritable. Au-delà du mental, au-delà des peurs, au-delà des limitations - il y a cette lumière éternelle qui ES tu. Ne cherche pas à comprendre avec le mental, mais à ressentir avec le cœur.",
        author: "RAUN-RACHID",
        views: 1456,
        likes: 112,
        createdAt: "2025-01-18T20:15:00.000Z"
    }
];

// Messages spirituels pour les réponses automatiques
const spiritualResponses = {
    paix: [
        "La paix véritable naît du silence intérieur. Elle ne dépend d'aucune circonstance extérieure.",
        "Trouve la paix en toi, et le monde autour de toi s'apaisera.",
        "La paix est ton état naturel. Tout le reste n'est qu'illusion passagère."
    ],
    amour: [
        "L'amour authentique commence par l'acceptation de soi. Il rayonne ensuite naturellement vers tous les êtres.",
        "Tu ES amour. Cette vérité n'a jamais changé, ne changera jamais.",
        "L'amour inconditionnel est la force la plus puissante de l'univers."
    ],
    guide: [
        "Le chemin spirituel n'est pas une destination mais un éveil constant à ce qui EST déjà en vous.",
        "Tu portes en toi toute la guidance dont tu as besoin. Écoute ton cœur.",
        "Chaque expérience est un enseignement déguisé. Accueille tout avec gratitude."
    ],
    peur: [
        "La peur n'est qu'une ombre projetée par l'ego. Dans la lumière de la conscience, elle disparaît.",
        "Traverse tes peurs avec amour et compassion. Elles sont tes plus grands maîtres.",
        "Au-delà de la peur se trouve ton pouvoir véritable."
    ],
    default: [
        "Votre intention est reçue avec gratitude. Que la conscience éclaire votre chemin, frère/sœur en éveil.",
        "L'univers conspire en votre faveur. Restez centré sur votre cœur et suivez votre intuition.",
        "Chaque intention sincère est une graine plantée dans le jardin de l'âme.",
        "La lumière de votre conscience illumine le chemin. Continuez avec foi et détermination."
    ]
};

// Configuration générale
const config = {
    siteName: "RAUN-RACHID LangueSage",
    siteDescription: "Espace numérique de conscience et d'éveil spirituel",
    adminCredentials: {
        username: "rachid",
        password: "raun2025"
    },
    localStorageKeys: {
        capsules: "raunCapsules",
        intentions: "raunIntentions",
        userVotes: "raunUserVotes",
        userViews: "raunUserViews"
    },
    animation: {
        matrixChars: "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン",
        fallSpeed: 200, // ms between new columns
        columnDuration: 5000 // ms before column removal
    }
};

// Utilitaires pour la gestion des données
const DataManager = {
    // Capsules
    getCapsules() {
        return JSON.parse(localStorage.getItem(config.localStorageKeys.capsules)) || defaultCapsules;
    },
    
    saveCapsules(capsules) {
        localStorage.setItem(config.localStorageKeys.capsules, JSON.stringify(capsules));
    },
    
    getCapsule(id) {
        const capsules = this.getCapsules();
        return capsules.find(c => c.id === parseInt(id));
    },
    
    // Intentions
    getIntentions() {
        return JSON.parse(localStorage.getItem(config.localStorageKeys.intentions)) || [];
    },
    
    saveIntentions(intentions) {
        localStorage.setItem(config.localStorageKeys.intentions, JSON.stringify(intentions));
    },
    
    addIntention(content, author = null) {
        const intentions = this.getIntentions();
        const newId = intentions.length > 0 ? Math.max(...intentions.map(i => i.id)) + 1 : 1;
        
        const intention = {
            id: newId,
            content: content.trim(),
            author: author || 'Anonyme',
            response: this.generateSpiritualResponse(content),
            createdAt: new Date().toISOString()
        };
        
        intentions.push(intention);
        this.saveIntentions(intentions);
        return intention;
    },
    
    // Votes et vues
    getUserVotes() {
        return JSON.parse(localStorage.getItem(config.localStorageKeys.userVotes)) || {};
    },
    
    saveUserVotes(votes) {
        localStorage.setItem(config.localStorageKeys.userVotes, JSON.stringify(votes));
    },
    
    toggleLike(capsuleId) {
        const capsules = this.getCapsules();
        const userVotes = this.getUserVotes();
        const userId = this.getUserId();
        const voteKey = `${capsuleId}:${userId}`;
        
        // Toggle vote count for this user
        const currentVotes = userVotes[voteKey] || 0;
        userVotes[voteKey] = currentVotes + 1;
        this.saveUserVotes(userVotes);
        
        // Calculate total likes for this capsule
        let totalLikes = 0;
        Object.keys(userVotes).forEach(key => {
            const [cId] = key.split(':');
            if (parseInt(cId) === capsuleId && userVotes[key] % 2 === 1) {
                totalLikes++;
            }
        });
        
        // Update capsule likes
        const capsule = capsules.find(c => c.id === capsuleId);
        if (capsule) {
            const originalLikes = this.getOriginalLikes(capsuleId);
            capsule.likes = originalLikes + totalLikes;
            this.saveCapsules(capsules);
        }
        
        return capsule;
    },
    
    incrementViews(capsuleId) {
        const capsules = this.getCapsules();
        const capsule = capsules.find(c => c.id === capsuleId);
        if (capsule) {
            capsule.views++;
            this.saveCapsules(capsules);
        }
        return capsule;
    },
    
    // Utilitaires
    getUserId() {
        let userId = localStorage.getItem('raunUserId');
        if (!userId) {
            userId = Date.now().toString();
            localStorage.setItem('raunUserId', userId);
        }
        return userId;
    },
    
    getOriginalLikes(capsuleId) {
        const originalLikes = [89, 67, 112]; // Likes originaux des capsules 1, 2, 3
        return originalLikes[capsuleId - 1] || 0;
    },
    
    generateSpiritualResponse(content) {
        const lowerContent = content.toLowerCase();
        
        if (lowerContent.includes('paix')) {
            return this.getRandomResponse(spiritualResponses.paix);
        } else if (lowerContent.includes('amour')) {
            return this.getRandomResponse(spiritualResponses.amour);
        } else if (lowerContent.includes('guide') || lowerContent.includes('chemin')) {
            return this.getRandomResponse(spiritualResponses.guide);
        } else if (lowerContent.includes('peur')) {
            return this.getRandomResponse(spiritualResponses.peur);
        } else {
            return this.getRandomResponse(spiritualResponses.default);
        }
    },
    
    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    },
    
    // Statistiques
    getStats() {
        const capsules = this.getCapsules();
        const intentions = this.getIntentions();
        
        return {
            totalCapsules: capsules.length,
            totalIntentions: intentions.length,
            totalViews: capsules.reduce((sum, c) => sum + c.views, 0),
            totalLikes: capsules.reduce((sum, c) => sum + c.likes, 0)
        };
    }
};

// Export pour utilisation globale
window.DataManager = DataManager;
window.config = config;
window.defaultCapsules = defaultCapsules;