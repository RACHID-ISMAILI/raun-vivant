# RAUN-RACHID - Composants d'Intégration LangueSage

## Overview

Ces composants sont conçus pour l'intégration des capsules de conscience RAUN-RACHID dans l'interface LangueSage existante. Ils maintiennent l'esthétique Matrix (fond noir, caractères verts) et offrent une navigation optimisée via sidebar droite.

## Composants Principaux

### `RaunRachidInterface`
- **Composant principal** qui orchestre l'interface complète
- Gère l'état de sélection des capsules
- Layout flex avec zone principale + sidebar droite

### `CapsuleSidebar`
- **Sidebar droite** avec aperçus des capsules
- Liste scrollable avec mini-cartes
- Indicateur de sélection visuelle
- Compteurs de vues, likes, commentaires
- Largeur fixe : 320px (w-80)

### `CapsuleMainDisplay`
- **Zone principale** d'affichage des capsules
- Affichage complet du contenu sélectionné
- Système de likes, commentaires, partage
- Compteur de vues automatique
- Interface responsive et scrollable

## Utilisation dans LangueSage

### Intégration Complète
```tsx
import RaunRachidInterface from "@/components/raun-rachid";

// Dans votre layout LangueSage
<div className="flex h-screen">
  <MainLangueSageContent className="flex-1" />
  <RaunRachidInterface className="w-96" />
</div>
```

### Intégration Modulaire
```tsx
import { CapsuleSidebar, CapsuleMainDisplay } from "@/components/raun-rachid";

// Usage séparé des composants
<div className="layout-custom">
  <CapsuleMainDisplay capsule={selectedCapsule} />
  <CapsuleSidebar onCapsuleSelect={handleSelect} />
</div>
```

## Fonctionnalités

### Navigation
- ✅ Clic sur capsule sidebar → affichage zone principale
- ✅ Sélection visuelle de la capsule active
- ✅ Scroll indépendant sidebar/contenu principal
- ✅ Indicateurs de statut (vues, likes, commentaires)

### Interactions
- ✅ Système de likes avec feedback visuel
- ✅ Commentaires authentifiés avec timestamp
- ✅ Partage natif/copie dans presse-papiers
- ✅ Compteur de vues uniques automatique

### Authentification
- ✅ Compatible avec le système d'auth existant
- ✅ Actions protégées (commentaires)
- ✅ Graceful fallback pour utilisateurs non-connectés

## Styling

### Thème Matrix
- Fond noir (`bg-black`)
- Texte vert (`text-green-500`)
- Bordures vertes (`border-green-500`)
- Effets de survol (`hover:border-green-400`)
- Police monospace (`font-mono`)

### Responsive
- Sidebar fixe 320px
- Zone principale flexible
- Scroll containerisé
- Mobile-friendly avec adaptations

## API Dependencies

Les composants utilisent les endpoints RAUN-RACHID existants :
- `GET /api/capsules` - Liste des capsules
- `POST /api/capsules/:id/view` - Comptage des vues
- `POST /api/capsules/:id/vote` - Système de likes
- `GET /api/capsules/:id/comments` - Commentaires
- `POST /api/capsules/:id/comments` - Ajout commentaire
- `GET /api/auth/me` - Utilisateur actuel

## Installation dans LangueSage

1. **Copier** le dossier `raun-rachid/` dans `src/components/`
2. **Ajouter** les types Capsule/Comment depuis `@shared/schema`
3. **Configurer** TanStack Query si nécessaire
4. **Importer** et utiliser dans votre layout

## Customisation

### Props principales
```tsx
interface CapsuleSidebarProps {
  onCapsuleSelect: (capsule: Capsule) => void;
  selectedCapsuleId?: number;
  className?: string;
}

interface CapsuleMainDisplayProps {
  capsule: Capsule | null;
  className?: string;
}
```

### Styling personnalisé
Tous les composants acceptent `className` pour override/extension des styles Tailwind.

## État de Production

✅ **Prêt pour production** - Composants testés et fonctionnels
✅ **API intégrée** - Endpoints RAUN-RACHID opérationnels  
✅ **UX optimisée** - Navigation intuitive et responsive
✅ **Esthétique Matrix** - Cohérence visuelle préservée

Les composants sont maintenant prêts pour l'intégration dans LangueSage !