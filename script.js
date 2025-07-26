// JavaScript principal pour RAUN-RACHID LangueSage

// Variables globales
let currentCapsule = null;
let matrixInterval = null;

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    createMatrixRain();
    loadSidebarCapsules();
    updateStats();
    loadIntentions();
    
    // Démarrer les mise à jour automatiques
    setInterval(updateStats, 10000); // Mise à jour toutes les 10 secondes
}

// === ANIMATION MATRIX ===
function createMatrixRain() {
    const container = document.getElementById('matrix-rain');
    if (!container) return;
    
    // Nettoyer l'ancien interval s'il existe
    if (matrixInterval) {
        clearInterval(matrixInterval);
    }
    
    matrixInterval = setInterval(() => {
        const column = document.createElement('div');
        column.className = 'matrix-column';
        column.style.left = Math.random() * 100 + '%';
        column.style.animationDelay = Math.random() * 3 + 's';
        column.style.animationDuration = (Math.random() * 3 + 2) + 's';
        
        let text = '';
        for (let i = 0; i < 20; i++) {
            text += config.animation.matrixChars.charAt(
                Math.floor(Math.random() * config.animation.matrixChars.length)
            ) + '<br>';
        }
        column.innerHTML = text;
        
        container.appendChild(column);
        
        setTimeout(() => {
            if (column.parentNode) {
                column.parentNode.removeChild(column);
            }
        }, config.animation.columnDuration);
    }, config.animation.fallSpeed);
}

// === NAVIGATION ===
function showWelcome() {
    document.getElementById('welcome-screen').style.display = 'block';
    document.getElementById('capsule-display').style.display = 'none';
    document.getElementById('comments-section').style.display = 'none';
    currentCapsule = null;
    
    // Retirer la classe active de toutes les capsules
    document.querySelectorAll('.capsule-item').forEach(item => {
        item.classList.remove('active');
    });
}

function showCapsule(capsuleId) {
    const capsule = DataManager.getCapsule(capsuleId);
    if (!capsule) return;
    
    currentCapsule = capsule;
    
    // Incrémenter les vues
    DataManager.incrementViews(capsuleId);
    
    // Afficher la capsule
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('capsule-display').style.display = 'block';
    document.getElementById('comments-section').style.display = 'none';
    
    // Remplir le contenu
    document.getElementById('capsule-title').textContent = capsule.title;
    document.getElementById('capsule-text').textContent = capsule.content;
    document.getElementById('capsule-views').textContent = `👁 ${capsule.views} vues`;
    document.getElementById('capsule-likes').textContent = `💚 ${capsule.likes} likes`;
    
    // Mettre à jour le bouton like
    updateLikeButton(capsuleId);
    
    // Marquer comme active dans la sidebar
    document.querySelectorAll('.capsule-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[onclick="showCapsule(${capsuleId})"]`)?.classList.add('active');
    
    // Mise à jour des stats
    updateStats();
    
    console.log('📍 Capsule affichée:', capsule.title.substring(0, 50) + '...');
}

// === SIDEBAR ===
function loadSidebarCapsules() {
    const capsules = DataManager.getCapsules();
    const container = document.getElementById('capsules-list');
    
    container.innerHTML = capsules.map(capsule => `
        <div class="capsule-item" onclick="showCapsule(${capsule.id})">
            <h4>${capsule.title}</h4>
            <p>${capsule.content.substring(0, 80)}...</p>
            <small>👁 ${capsule.views} vues • 💚 ${capsule.likes} likes</small>
        </div>
    `).join('');
}

// === LIKES ET INTERACTIONS ===
function likeCapsule() {
    if (!currentCapsule) return;
    
    const updatedCapsule = DataManager.toggleLike(currentCapsule.id);
    if (updatedCapsule) {
        currentCapsule = updatedCapsule;
        
        // Mettre à jour l'affichage
        document.getElementById('capsule-likes').textContent = `💚 ${updatedCapsule.likes} likes`;
        updateLikeButton(currentCapsule.id);
        
        // Recharger la sidebar
        loadSidebarCapsules();
        updateStats();
        
        showToast('💚 Interaction enregistrée !', 'success');
        
        console.log('👍 Like toggleé pour capsule:', currentCapsule.id);
    }
}

function updateLikeButton(capsuleId) {
    const userVotes = DataManager.getUserVotes();
    const userId = DataManager.getUserId();
    const voteKey = `${capsuleId}:${userId}`;
    const userVoteCount = userVotes[voteKey] || 0;
    
    const likeBtn = document.getElementById('like-btn');
    if (userVoteCount % 2 === 1) {
        likeBtn.textContent = '💚 Aimé';
        likeBtn.style.background = 'rgba(0, 255, 0, 0.3)';
    } else {
        likeBtn.textContent = '👍 Aimer';
        likeBtn.style.background = 'rgba(0, 255, 0, 0.1)';
    }
}

// === COMMENTAIRES ===
function showComments() {
    if (!currentCapsule) return;
    
    document.getElementById('comments-section').style.display = 'block';
    loadComments();
}

function loadComments() {
    // Pour cette version statique, on simule des commentaires
    const commentsContainer = document.getElementById('comments-list');
    const sampleComments = [
        {
            author: 'Amina',
            content: 'Merci RACHID pour cette sagesse profonde. Cela résonne vraiment en moi.',
            date: new Date().toLocaleDateString()
        },
        {
            author: 'Khalid',
            content: 'Magnifique message ! L\'éveil de la conscience est le chemin vers la paix.',
            date: new Date().toLocaleDateString()
        }
    ];
    
    commentsContainer.innerHTML = sampleComments.map(comment => `
        <div class="comment-item">
            <div class="comment-author">${comment.author}</div>
            <div class="comment-content">${comment.content}</div>
            <div class="comment-date">${comment.date}</div>
        </div>
    `).join('');
}

function addComment() {
    const commentText = document.getElementById('comment-text').value.trim();
    if (!commentText) {
        showToast('Veuillez saisir un commentaire.', 'error');
        return;
    }
    
    // Pour cette version statique, on affiche juste une confirmation
    showToast('💬 Commentaire ajouté avec succès !', 'success');
    document.getElementById('comment-text').value = '';
    
    // Recharger les commentaires (simulation)
    setTimeout(loadComments, 500);
}

// === PARTAGE ===
function shareCapsule() {
    if (!currentCapsule) return;
    
    const shareText = `🔥 Découvrez cette capsule de sagesse RAUN-RACHID: "${currentCapsule.title}"\n\n${currentCapsule.content.substring(0, 100)}...\n\n✨ Espace de conscience et d'éveil spirituel`;
    
    if (navigator.share) {
        navigator.share({
            title: currentCapsule.title,
            text: shareText,
            url: window.location.href
        }).then(() => {
            showToast('🔗 Partage réussi !', 'success');
        }).catch(() => {
            fallbackShare(shareText);
        });
    } else {
        fallbackShare(shareText);
    }
}

function fallbackShare(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('📋 Texte copié dans le presse-papiers !', 'success');
        });
    } else {
        // Fallback pour navigateurs plus anciens
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('📋 Texte copié !', 'success');
    }
}

// === INTENTIONS ===
function showIntentions() {
    document.getElementById('intentions-modal').style.display = 'flex';
    loadIntentions();
}

function closeIntentions() {
    document.getElementById('intentions-modal').style.display = 'none';
}

function loadIntentions() {
    const intentions = DataManager.getIntentions();
    const container = document.getElementById('intentions-container');
    
    if (intentions.length === 0) {
        container.innerHTML = '<p style="text-align: center; opacity: 0.7;">Aucune intention partagée pour le moment.</p>';
        return;
    }
    
    container.innerHTML = intentions.slice(0, 5).map(intention => `
        <div class="intention-item">
            <div class="intention-content">"${intention.content}"</div>
            ${intention.response ? `<div class="intention-response">🌟 ${intention.response}</div>` : ''}
            <div class="intention-meta">- ${intention.author} • ${new Date(intention.createdAt).toLocaleDateString()}</div>
        </div>
    `).join('');
}

function submitIntention() {
    const content = document.getElementById('intention-text').value.trim();
    const author = document.getElementById('intention-author').value.trim();
    
    if (!content) {
        showToast('Veuillez saisir votre intention.', 'error');
        return;
    }
    
    // Créer l'intention
    const intention = DataManager.addIntention(content, author);
    
    // Reset du formulaire
    document.getElementById('intention-text').value = '';
    document.getElementById('intention-author').value = '';
    
    // Recharger la liste
    loadIntentions();
    updateStats();
    
    showToast('✨ Intention transmise avec gratitude !', 'success');
    
    console.log('💭 Nouvelle intention créée:', intention.content.substring(0, 50) + '...');
}

// === STATISTIQUES ===
function updateStats() {
    const stats = DataManager.getStats();
    
    // Update sidebar stats
    const totalCapsulesEl = document.getElementById('total-capsules');
    const totalViewsEl = document.getElementById('total-views');
    const totalLikesEl = document.getElementById('total-likes');
    
    if (totalCapsulesEl) totalCapsulesEl.textContent = stats.totalCapsules;
    if (totalViewsEl) totalViewsEl.textContent = stats.totalViews;
    if (totalLikesEl) totalLikesEl.textContent = stats.totalLikes;
    
    console.log('📊 Stats mises à jour:', stats);
}

// === TOAST NOTIFICATIONS ===
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast toast-${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// === GESTION CLAVIER ===
document.addEventListener('keydown', function(e) {
    // Navigation par flèches
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigatePrevious();
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateNext();
    } else if (e.key === 'Escape') {
        // Fermer les modales
        closeIntentions();
        if (document.getElementById('comments-section').style.display === 'block') {
            document.getElementById('comments-section').style.display = 'none';
        }
    } else if (e.key === 'Enter' && e.ctrlKey) {
        // Ctrl+Enter pour liker
        if (currentCapsule) {
            likeCapsule();
        }
    }
});

function navigatePrevious() {
    const capsules = DataManager.getCapsules();
    if (!currentCapsule) {
        showCapsule(capsules[capsules.length - 1].id);
    } else {
        const currentIndex = capsules.findIndex(c => c.id === currentCapsule.id);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : capsules.length - 1;
        showCapsule(capsules[prevIndex].id);
    }
    console.log('🔄 Navigation précédente');
}

function navigateNext() {
    const capsules = DataManager.getCapsules();
    if (!currentCapsule) {
        showCapsule(capsules[0].id);
    } else {
        const currentIndex = capsules.findIndex(c => c.id === currentCapsule.id);
        const nextIndex = currentIndex < capsules.length - 1 ? currentIndex + 1 : 0;
        showCapsule(capsules[nextIndex].id);
    }
    console.log('🔄 Navigation suivante');
}

// === GESTION TACTILE ===
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 100;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe gauche = suivant
            navigateNext();
        } else {
            // Swipe droite = précédent
            navigatePrevious();
        }
    }
}

// === FERMETURE MODALE PAR CLIC EXTÉRIEUR ===
document.addEventListener('click', function(e) {
    const modal = document.getElementById('intentions-modal');
    if (e.target === modal) {
        closeIntentions();
    }
});

// === AUTO-REFRESH ===
// Mise à jour automatique des données toutes les 30 secondes
setInterval(() => {
    if (currentCapsule) {
        const updatedCapsule = DataManager.getCapsule(currentCapsule.id);
        if (updatedCapsule && updatedCapsule.likes !== currentCapsule.likes) {
            currentCapsule = updatedCapsule;
            document.getElementById('capsule-likes').textContent = `💚 ${updatedCapsule.likes} likes`;
        }
    }
    updateStats();
}, 30000);

console.log('🔥 RAUN-RACHID LangueSage initialisé avec succès !');
console.log('✨ Navigation: Flèches ← → ou clic sidebar');
console.log('💚 Interactions: Ctrl+Enter pour liker');
console.log('📱 Mobile: Swipe gauche/droite pour naviguer');