# 🚀 RAUN-RACHID - Installation Windows & GitHub

## 📋 Prérequis Windows

### 1. Installer Node.js
- Télécharger Node.js 18+ depuis [nodejs.org](https://nodejs.org/)
- Vérifier l'installation : `node --version` et `npm --version`

### 2. Installer Git
- Télécharger Git depuis [git-scm.com](https://git-scm.com/)
- Configurer Git avec vos informations

## 🔄 Installation depuis GitHub

### 1. Cloner le repository
```bash
git clone https://github.com/VOTRE_USERNAME/raun-rachid.git
cd raun-rachid
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration de la base de données
```bash
# Créer le fichier .env avec vos variables
echo "DATABASE_URL=your_postgresql_url" > .env
echo "SESSION_SECRET=votre_secret_session" >> .env
```

### 4. Initialiser la base de données
```bash
npm run db:push
```

### 5. Démarrer l'application
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5000`

## 🌐 Déploiement GitHub Pages (Version Statique)

### Option A : Version avec base de données locale
```bash
# Build de production
npm run build

# Le dossier dist/ contient tous les fichiers
# Uploadez le contenu sur votre hébergeur
```

### Option B : Version GitHub Pages (HTML pur)
Pour GitHub Pages, utilisez la version HTML statique :

1. Copiez ces fichiers dans un nouveau repository :
   - `index.html`
   - `style.css` 
   - `script.js`
   - `rachid-photo.jpg`

2. Activez GitHub Pages dans Settings > Pages

## 🔧 Configuration Windows spécifique

### Variables d'environnement Windows
```bash
# Créer un fichier .env.local
DATABASE_URL=postgresql://localhost:5432/raun_rachid
NODE_ENV=development
SESSION_SECRET=votre_secret_unique_ici
```

### Installation PostgreSQL sur Windows
1. Télécharger PostgreSQL depuis [postgresql.org](https://www.postgresql.org/download/windows/)
2. Créer une base de données `raun_rachid`
3. Mettre à jour l'URL dans `.env`

## 🚀 Scripts disponibles

```bash
# Développement
npm run dev

# Production
npm run build
npm start

# Base de données
npm run db:push
npm run db:studio

# Nettoyage
npm run clean
```

## 🔒 Authentification Admin

- **Username :** rachid
- **Password :** raun2025
- **URL Admin :** http://localhost:5000/admin

## 📱 Fonctionnalités

✅ **Interface Matrix complète** avec animations
✅ **Générateur IA de capsules** spirituelles 
✅ **Système de likes et commentaires**
✅ **Navigation par flèches** entre capsules
✅ **Interface admin** sécurisée
✅ **Base de données PostgreSQL**
✅ **Sessions utilisateur** persistantes

## 🌍 Déploiement Cloud

### Vercel (Recommandé)
```bash
npm i -g vercel
vercel --prod
```

### Netlify
1. Build : `npm run build`
2. Publish directory : `dist`

### Heroku
```bash
git push heroku main
```

## 🔧 Dépannage Windows

### Erreur de permissions
```bash
# Exécuter en tant qu'administrateur
npm cache clean --force
npm install
```

### Port occupé
```bash
# Changer le port dans package.json
"scripts": {
  "dev": "NODE_ENV=development tsx server/index.ts --port 3000"
}
```

### Base de données
```bash
# Vérifier la connexion PostgreSQL
npm run db:studio
```

## 📞 Support

En cas de problème :
1. Vérifier les logs dans la console
2. Vérifier les variables d'environnement
3. Relancer `npm install`
4. Redémarrer l'application

---

**RAUN-RACHID est maintenant prêt pour Windows et GitHub !** 🔥