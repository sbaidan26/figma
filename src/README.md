# 🎓 Madrasati - Carnet de Liaison Numérique

> Application web complète pour l'enseignement primaire avec système d'authentification Supabase

![Madrasati](https://img.shields.io/badge/Version-1.0.0-green)
![React](https://img.shields.io/badge/React-18.3-blue)
![Supabase](https://img.shields.io/badge/Supabase-Integrated-green)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)

---

## 🚀 Démarrage Ultra-Rapide

> **Nouveau ?** Consultez **[START_HERE.md](START_HERE.md)** pour un guide en 3 étapes !

### 1. Accédez à l'Application
L'application est déjà déployée et fonctionnelle !

### 2. Connectez-vous avec un Compte Démo

**Sur la page de connexion :**
1. Cliquez sur **"🎯 Accès rapide - Comptes démo"**
2. Choisissez un rôle (Admin, Enseignant, Parent, ou Élève)
3. Connexion automatique ! ✨

**Ou utilisez ces credentials :**

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| 👨‍💼 Admin | admin@madrasati.com | demo123 |
| 👨‍🏫 Enseignant | prof.martin@madrasati.com | demo123 |
| 👨‍👩‍👧 Parent | parent.dupont@madrasati.com | demo123 |
| 🎓 Élève | eleve.sarah@madrasati.com | demo123 |

📖 **Plus de détails :** Voir [`CREDENTIALS.md`](CREDENTIALS.md)

---

## 📚 Documentation

### Guides Rapides
- 📘 **[DEMARRAGE_RAPIDE.md](DEMARRAGE_RAPIDE.md)** - Commencez ici !
- 🔑 **[CREDENTIALS.md](CREDENTIALS.md)** - Tous les comptes de test
- 🧪 **[COMPTES_TEST.md](COMPTES_TEST.md)** - Scénarios de test détaillés
- ⚡ **[QUICK_FIX.md](QUICK_FIX.md)** - Solutions en 30 secondes
- 🔧 **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Guide de dépannage complet
- 🔍 **[DEBUG_LOGS.md](DEBUG_LOGS.md)** - Comprendre les logs

### Documentation Technique
- 🗄️ **[README_SUPABASE.md](README_SUPABASE.md)** - API et backend complet
- 🔧 **[INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md)** - Intégration technique
- 💻 **[ExampleSupabaseIntegration.tsx](components/ExampleSupabaseIntegration.tsx)** - Exemples de code

---

## ✨ Fonctionnalités

### 🔐 Authentification Complète
- ✅ 4 rôles utilisateurs (Admin, Enseignant, Parent, Élève)
- ✅ Inscription et connexion sécurisées
- ✅ Sessions persistantes
- ✅ Comptes de démonstration pour tests rapides

### 📊 Tableaux de Bord Différenciés

#### 👨‍💼 Tableau de Bord Admin
- Gestion des utilisateurs et classes
- Statistiques globales
- Configuration de l'application
- Surveillance du curriculum

#### 👨‍🏫 Tableau de Bord Enseignant
- Création de pancartes/annonces
- Gestion des devoirs et soumissions
- Saisie et gestion des notes
- Messagerie école-famille
- Emploi du temps de classe
- Ressources pédagogiques

#### 👨‍👩‍👧 Tableau de Bord Parent
- Consultation des pancartes
- Cahier de liaison avec signatures
- Messagerie avec enseignants
- Suivi des notes de l'enfant
- Consultation des devoirs
- Parent Café (forum)

#### 🎓 Tableau de Bord Élève
- Pancartes et annonces
- Messagerie élève (modérée)
- Soumission des devoirs
- Consultation des notes
- Emploi du temps personnel
- Ressources pédagogiques

### 🎨 Design System
- Police Nunito pour une lecture facile
- Palette pastel douce (vert menthe, bleu ciel, beige doré)
- Icônes cartoon SVG animées
- Bordures arrondies 20px
- Responsive mobile-first
- Esthétique orientale discrète

---

## 🛠️ Technologies

### Frontend
- **React 18.3** - Framework UI
- **TypeScript** - Typage statique
- **Tailwind CSS v4** - Styling
- **Motion/React** - Animations
- **Lucide React** - Icônes
- **Recharts** - Graphiques
- **Shadcn/UI** - Composants

### Backend
- **Supabase** - Backend as a Service
- **Supabase Auth** - Authentification
- **Supabase Edge Functions** - API serverless
- **Hono** - Framework serveur
- **KV Store** - Base de données

---

## 📁 Structure du Projet

```
madrasati/
├── App.tsx                      # Point d'entrée
├── components/                  # Composants React
│   ├── AdminDashboard.tsx
│   ├── TeacherDashboard.tsx
│   ├── ParentDashboard.tsx
│   ├── StudentDashboard.tsx
│   ├── LoginPage.tsx
│   └── ui/                      # Composants UI Shadcn
├── contexts/
│   └── AuthContext.tsx          # Context d'authentification
├── hooks/
│   └── useApi.tsx               # Hook API personnalisé
├── types/
│   └── index.tsx                # Types TypeScript
├── utils/
│   └── supabase/
│       ├── client.tsx           # Client Supabase
│       └── info.tsx             # Configuration
└── supabase/
    └── functions/
        └── server/
            └── index.tsx        # Backend API
```

---

## 🔌 API Backend

### Routes Disponibles

#### Authentification
- `POST /auth/signup` - Créer un compte
- `GET /auth/session` - Session active
- `PUT /auth/profile` - Mettre à jour le profil

#### Gestion des Données
- `/boards` - Pancartes/Annonces
- `/messages` - Messagerie
- `/homework` - Devoirs
- `/grades` - Notes
- `/schedule` - Emploi du temps
- `/resources` - Ressources pédagogiques
- `/liaison` - Cahier de liaison
- `/classes` - Gestion des classes
- `/attendance` - Présences/Absences
- `/events` - Événements

📖 **Documentation complète :** Voir [`README_SUPABASE.md`](README_SUPABASE.md)

---

## 💻 Développement

### Utiliser les Hooks

```tsx
import { useAuth } from './contexts/AuthContext';
import { useApi } from './hooks/useApi';

function MonComposant() {
  const { user } = useAuth();
  const { getBoards, createBoard } = useApi();
  
  // Utiliser les fonctions...
}
```

### Exemples Complets
Consultez [`components/ExampleSupabaseIntegration.tsx`](components/ExampleSupabaseIntegration.tsx) pour des exemples détaillés.

---

## 🧪 Tests

### Comptes de Test Prêts
Utilisez les boutons "Comptes démo" sur la page de connexion pour un accès instantané !

### Scénarios Suggérés
1. **Flux Enseignant → Élève**
   - Créer un devoir
   - Soumettre le devoir (compte élève)
   - Noter le devoir
   
2. **Flux Enseignant → Parent**
   - Créer une pancarte
   - Envoyer un message
   - Signer le cahier de liaison (compte parent)

3. **Gestion Admin**
   - Créer une classe
   - Gérer les utilisateurs
   - Consulter les statistiques

📖 **Scénarios détaillés :** Voir [`COMPTES_TEST.md`](COMPTES_TEST.md)

---

## 🎯 Prochaines Étapes

### Pour les Développeurs
1. Consulter [`ExampleSupabaseIntegration.tsx`](components/ExampleSupabaseIntegration.tsx)
2. Intégrer les API dans les composants existants
3. Remplacer les données mock par des données réelles
4. Ajouter des fonctionnalités avancées

### Pour les Testeurs
1. Tester tous les rôles utilisateur
2. Valider tous les scénarios de [`COMPTES_TEST.md`](COMPTES_TEST.md)
3. Reporter les bugs et suggestions

### Fonctionnalités Futures
- 📱 Notifications push
- 💬 Chat en temps réel
- 📎 Upload de fichiers (Supabase Storage)
- 📊 Tableaux de bord avec données réelles
- 🌐 Multilingue (FR/AR)
- 📧 Notifications par email

---

## 📞 Support

### Documentation
- Guide de démarrage : [`DEMARRAGE_RAPIDE.md`](DEMARRAGE_RAPIDE.md)
- Credentials : [`CREDENTIALS.md`](CREDENTIALS.md)
- API Backend : [`README_SUPABASE.md`](README_SUPABASE.md)

### Problèmes Courants

**"Invalid login credentials" dans la console**
→ Normal lors de la première utilisation des comptes démo - Ignorez ce message

**"Unauthorized"**
→ Déconnectez-vous et reconnectez-vous

**"User not found"**
→ Utilisez les boutons "Comptes démo" pour créer le compte

**Données ne s'affichent pas**
→ Vérifiez la console du navigateur (F12)

📖 **Plus de solutions :** Consultez [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 🎨 Design

### Palette de Couleurs
- **Primary** : #2bb59a (Vert menthe)
- **Secondary** : #beeaf7 (Bleu ciel)
- **Accent** : #f1e8da (Beige doré)
- **Warning** : #f5c25b (Jaune doux)

### Police
- **Nunito** - Poids 200-700

### Composants
- Bordures arrondies 20px
- Ombres douces
- Animations fluides
- Icons cartoon animés

---

## 📄 Licence

Propriétaire - Tous droits réservés

---

## 🙏 Remerciements

- Design inspiré de Beneylu School
- Composants UI par Shadcn
- Icons par Lucide
- Backend par Supabase

---

## ⚡ Quick Start

```bash
# 1. Ouvrez l'application
# 2. Cliquez sur "🎯 Accès rapide - Comptes démo"
# 3. Choisissez un rôle
# 4. Explorez l'application !
```

**C'est aussi simple que ça !** 🚀

---

**Développé avec ❤️ pour l'éducation**
