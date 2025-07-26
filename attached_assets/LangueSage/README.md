# MISSION RAUN-RACHID 🚀

> Écosystème numérique d'éveil spirituel - Intégration LangueSage

## 🎯 Vision du Projet

**MISSION RAUN-RACHID** transforme l'approche RAUN-VIVANT en intégrant les capsules de conscience dans une sidebar droite de l'interface LangueSage existante. L'objectif est de créer un réseau d'éveil spirituel unifié avec navigation optimisée où les capsules s'affichent dans la zone principale lors du clic sur la sidebar.

## ✨ Fonctionnalités Démonstrées

### Interface Complètement Fonctionnelle
- 🎨 **Esthétique Matrix** : Fond noir, caractères verts, animations fluides
- 📱 **Navigation Sidebar** : Clic sur capsules → affichage zone principale
- 💖 **Système de Likes Avancé** : Toggle par utilisateur (impair=+1, pair=0)
- 👁️ **Compteurs Temps Réel** : Vues, likes, commentaires automatiques
- 🔄 **Actualisation Live** : Données rafraîchies toutes les 10 secondes

### Interactions Complètes
- ✅ Bouton "💚 Liker" fonctionnel avec toggle intelligent
- ✅ Bouton "💬 Commenter" avec feedback utilisateur
- ✅ Bouton "🔗 Partager" copie l'URL automatiquement
- ✅ Bouton "🔄 Actualiser" pour forcer le rafraîchissement

## 🏗️ Architecture Technique

### Stack Technologique
```
Frontend: React 18 + TypeScript + Tailwind CSS
Backend: Node.js + Express + TypeScript
Base de données: PostgreSQL (Drizzle ORM)
UI: Radix UI + shadcn/ui
État: TanStack Query (React Query)
Routing: Wouter
Build: Vite
```

### Composants Clés
- **LiveDemo** : Interface de démonstration complète
- **CapsuleSidebar** : Sidebar droite avec aperçus des capsules
- **CapsuleMainDisplay** : Zone principale d'affichage
- **MatrixRain** : Animation de fond Matrix authentique

## 🚀 Démarrage Rapide

### Installation
```bash
# Cloner le repository
git clone https://github.com/VOTRE_USERNAME/mission-raun-rachid.git
cd mission-raun-rachid

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

### Accès à la Démonstration
1. Accédez à la page d'accueil
2. Cliquez sur le bouton "🚀 Demo"
3. Interagissez avec la sidebar et les boutons
4. Testez le système de likes toggle

## 🎮 Test du Système de Likes

Le système de likes fonctionne selon une logique de toggle par utilisateur :

```
Utilisateur A clique 1 fois → +1 like (total: original + 1)
Utilisateur A clique 2 fois → 0 like (total: original + 0) 
Utilisateur A clique 3 fois → +1 like (total: original + 1)
Utilisateur B clique 1 fois → +1 like (total: original + 2)
```

**Affichage final** = Likes originaux + Somme de tous les utilisateurs actifs

## 📊 État Actuel

### ✅ Réalisé
- Interface de démonstration 100% fonctionnelle
- Système de likes toggle par IP utilisateur
- Navigation fluide sidebar → zone principale
- Esthétique Matrix parfaitement préservée
- Architecture modulaire prête pour intégration

### 🔄 À Faire Demain
- Ajustements mineurs identifiés par l'utilisateur
- Intégration finale dans le projet LangueSage existant
- Tests de compatibilité avec Firebase et OpenAI

## 🌟 Capsules de Conscience

### Capsule #1 - Conscience Est
> "La conscience est comme un océan infini. Chaque pensée n'est qu'une vague à sa surface, mais l'essence demeure éternellement calme et profonde."

### Capsule #2 - L'Éveil N'est  
> "L'éveil n'est pas une destination mais un chemin. Chaque moment de présence authentique est une victoire contre l'illusion."

### Capsule #3 - Dans Silence
> "Dans le silence de l'esprit, toutes les réponses se révèlent. Ne cherchez pas à comprendre avec le mental, mais à ressentir avec le cœur."

## 🔧 Configuration

### Variables d'Environnement
```env
DATABASE_URL=your_postgresql_url
NODE_ENV=development
```

### Ports par Défaut
- **Frontend** : http://localhost:5000 (Vite + Express)
- **API** : http://localhost:5000/api/*

## 📝 Documentation

- [`replit.md`](./replit.md) - Architecture complète du projet
- [`SYNCHRONISATION-GITHUB.md`](./SYNCHRONISATION-GITHUB.md) - Guide de synchronisation
- [`drizzle.config.ts`](./drizzle.config.ts) - Configuration base de données

## 🤝 Contribution

Le projet est actuellement en développement privé. La synchronisation se fait entre :
1. **Replit** (développement principal)
2. **GitHub** (sauvegarde et versions)
3. **Local** (développement hors ligne)

## 📧 Contact

Projet développé dans le cadre de MISSION RAUN-RACHID - Éveil spirituel numérique.

---

**🎯 Objectif Final** : Intégration harmonieuse dans LangueSage pour créer un écosystème d'éveil spirituel unifié et interactif.