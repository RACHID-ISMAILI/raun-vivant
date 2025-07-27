# 🔥 RAUN-RACHID - Plateforme Spirituelle de Conscience

![Matrix Interface](https://img.shields.io/badge/Interface-Matrix-00ff00)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)

## 🌟 Description

RAUN-RACHID est une plateforme spirituelle d'éveil de conscience avec une interface Matrix immersive. Elle permet de créer, partager et explorer des capsules de conscience spirituelle avec un générateur IA intégré.

## ✨ Fonctionnalités

- 🎯 **Interface Matrix** avec animations en temps réel
- 🤖 **Générateur IA** de capsules spirituelles par thème
- 💚 **Système de likes** et commentaires interactif
- 🔄 **Navigation par flèches** entre les capsules
- 🔐 **Interface admin** sécurisée (rachid/raun2025)
- 💾 **Base de données PostgreSQL** avec persistance
- 📱 **Design responsive** mobile et desktop
- 🖼️ **Photo personnelle** intégrée dans l'interface

## 🚀 Installation Windows

### Prérequis
- [Node.js 18+](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [PostgreSQL](https://www.postgresql.org/download/windows/)

### Installation
```bash
# Cloner le repository
git clone https://github.com/VOTRE_USERNAME/raun-rachid.git
cd raun-rachid

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos paramètres de base de données

# Initialiser la base de données
npm run db:push

# Démarrer l'application
npm run dev
```

L'application sera accessible sur `http://localhost:5000`

## 🗄️ Configuration Base de Données

### PostgreSQL Local
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/raun_rachid
SESSION_SECRET=votre_secret_unique_ici
NODE_ENV=development
```

### PostgreSQL Cloud (Neon, Supabase, etc.)
```env
DATABASE_URL=postgresql://username:password@host:port/database
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Développement
npm run build        # Build de production
npm start           # Démarrer en production
npm run db:push     # Mise à jour du schéma
npm run db:studio   # Interface graphique DB
```

## 🎨 Structure du Projet

```
raun-rachid/
├── client/src/           # Frontend React
│   ├── components/       # Composants réutilisables
│   ├── pages/           # Pages principales
│   └── lib/             # Utilitaires
├── server/              # Backend Express
│   ├── index.ts         # Serveur principal
│   ├── routes.ts        # Routes API
│   └── storage.ts       # Interface base de données
├── shared/              # Types partagés
│   └── schema.ts        # Schéma Drizzle
└── public/              # Assets statiques
```

## 🔐 Authentification Admin

- **URL :** `/admin`
- **Username :** `rachid`
- **Password :** `raun2025`

## 🌍 Déploiement

### Vercel (Recommandé)
```bash
npm i -g vercel
vercel --prod
```

### Netlify
1. Build: `npm run build`
2. Publish directory: `dist`

### Railway/Render
- Connecter votre repository GitHub
- Variables d'environnement: `DATABASE_URL`, `SESSION_SECRET`

## 🤖 Générateur IA

Le générateur IA crée automatiquement des capsules spirituelles basées sur des thèmes :

- **éveil** - Messages sur l'éveil spirituel
- **amour** - Sagesse sur l'amour universel  
- **conscience** - Réflexions sur la conscience
- **paix** - Enseignements sur la paix intérieure
- **lumière** - Illumination et guidance

## 📱 Compatibilité

- ✅ Windows 10/11
- ✅ macOS
- ✅ Linux
- ✅ Navigateurs modernes (Chrome, Firefox, Safari, Edge)
- ✅ Mobile responsive

## 🔧 Dépannage

### Port occupé
```bash
# Changer le port
set PORT=3000
npm run dev
```

### Problèmes de base de données
```bash
# Réinitialiser le schéma
npm run db:push
```

### Cache navigateur
```bash
# Vider le cache et redémarrer
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (macOS)
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 Licence

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Ouvrir une [issue GitHub](https://github.com/VOTRE_USERNAME/raun-rachid/issues)
- Consulter la [documentation complète](INSTALLATION-WINDOWS.md)

---

**🔥 RAUN-RACHID - Nul ne peut éteindre ce que je suis. 🔥**