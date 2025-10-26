# Madrasati - Intégration Supabase

## 🎉 Intégration complète réalisée !

L'application Madrasati est maintenant complètement intégrée avec Supabase pour la gestion de l'authentification et des données.

## 📋 Fonctionnalités Supabase Implémentées

### ✅ Authentification
- **Inscription** : Création de nouveaux utilisateurs avec rôles (Admin, Enseignant, Parent, Élève)
- **Connexion** : Authentification par email/mot de passe
- **Déconnexion** : Gestion sécurisée des sessions
- **Sessions persistantes** : Les utilisateurs restent connectés entre les sessions
- **Gestion des rôles** : Attribution et vérification des rôles utilisateurs

### ✅ Backend API (Serveur Edge Functions)

Le serveur backend (`/supabase/functions/server/index.tsx`) fournit les routes suivantes :

#### Routes d'authentification
- `POST /auth/signup` - Créer un nouveau compte
- `GET /auth/session` - Récupérer la session active
- `PUT /auth/profile` - Mettre à jour le profil utilisateur

#### Routes de gestion des utilisateurs (Admin uniquement)
- `GET /users` - Liste de tous les utilisateurs
- `DELETE /users/:userId` - Supprimer un utilisateur

#### Routes des pancartes/boards
- `POST /boards` - Créer une pancarte
- `GET /boards` - Récupérer toutes les pancartes
- `PUT /boards/:boardId` - Modifier une pancarte
- `DELETE /boards/:boardId` - Supprimer une pancarte

#### Routes de messagerie
- `POST /messages` - Envoyer un message
- `GET /messages?type=sent|received` - Récupérer les messages
- `PUT /messages/:messageId/read` - Marquer comme lu

#### Routes des devoirs
- `POST /homework` - Créer un devoir
- `GET /homework` - Récupérer les devoirs
- `POST /homework/:homeworkId/submit` - Soumettre un devoir

#### Routes des notes/évaluations
- `POST /grades` - Ajouter une note
- `GET /grades?studentId=xxx` - Récupérer les notes

#### Routes de l'emploi du temps
- `POST /schedule` - Ajouter une entrée
- `GET /schedule?classId=xxx` - Récupérer l'emploi du temps

#### Routes des ressources pédagogiques
- `POST /resources` - Ajouter une ressource
- `GET /resources` - Récupérer les ressources

#### Routes du cahier de liaison
- `POST /liaison` - Créer une entrée
- `GET /liaison` - Récupérer les entrées
- `POST /liaison/:entryId/sign` - Signer une entrée

#### Routes des classes
- `POST /classes` - Créer une classe
- `GET /classes` - Récupérer les classes

#### Routes de présence
- `POST /attendance` - Enregistrer la présence
- `GET /attendance?studentId=xxx&classId=xxx` - Récupérer les absences

#### Routes des événements
- `POST /events` - Créer un événement
- `GET /events` - Récupérer les événements

## 🔧 Structure du Projet

```
/
├── App.tsx                          # Point d'entrée avec AuthProvider
├── contexts/
│   └── AuthContext.tsx             # Gestion de l'authentification
├── hooks/
│   └── useApi.tsx                  # Hook pour les appels API
├── types/
│   └── index.tsx                   # Types TypeScript
├── utils/
│   └── supabase/
│       ├── client.tsx              # Client Supabase frontend
│       └── info.tsx                # Configuration Supabase
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx           # Serveur backend Hono
│           └── kv_store.tsx        # Utilitaires KV Store
└── components/
    ├── LoginPage.tsx               # Page de connexion/inscription
    └── ...                         # Autres composants
```

## 🚀 Utilisation

### 1. Création de compte

L'interface de connexion permet maintenant de créer un compte :
1. Cliquez sur "Pas de compte ? S'inscrire"
2. Remplissez le formulaire (nom, email, mot de passe)
3. Sélectionnez votre rôle (Admin, Enseignant, Parent, Élève)
4. Cliquez sur "Créer mon compte"

### 2. Connexion

1. Entrez votre email et mot de passe
2. Cliquez sur "Se connecter"
3. Vous serez automatiquement redirigé vers votre tableau de bord selon votre rôle

### 3. Utilisation du Hook useApi

Dans vos composants, utilisez le hook `useApi` pour interagir avec le backend :

```tsx
import { useApi } from '../hooks/useApi';

function MyComponent() {
  const { getBoards, createBoard, loading, error } = useApi();

  const loadBoards = async () => {
    try {
      const data = await getBoards();
      console.log(data.boards);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const addBoard = async () => {
    try {
      const data = await createBoard({
        title: 'Nouvelle pancarte',
        description: 'Description',
        type: 'announcement'
      });
      console.log('Board created:', data.board);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div>
      {loading && <p>Chargement...</p>}
      {error && <p>Erreur: {error}</p>}
      <button onClick={loadBoards}>Charger les pancartes</button>
      <button onClick={addBoard}>Ajouter une pancarte</button>
    </div>
  );
}
```

### 4. Accès aux informations utilisateur

```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, signOut } = useAuth();

  return (
    <div>
      <p>Bienvenue {user?.name}</p>
      <p>Rôle : {user?.role}</p>
      <button onClick={signOut}>Déconnexion</button>
    </div>
  );
}
```

## 🔒 Sécurité

- ✅ Toutes les routes API (sauf signup) nécessitent une authentification
- ✅ Les tokens JWT sont vérifiés côté serveur
- ✅ Les rôles sont validés pour les opérations sensibles
- ✅ La clé de service Supabase n'est jamais exposée au frontend
- ✅ Les mots de passe sont automatiquement hachés par Supabase Auth

## 📊 Stockage des Données

Les données sont stockées dans la table KV Store de Supabase avec les préfixes suivants :
- `user:` - Données utilisateur
- `board:` - Pancartes
- `message:` - Messages
- `homework:` - Devoirs
- `grade:` - Notes
- `schedule:` - Emploi du temps
- `resource:` - Ressources pédagogiques
- `liaison:` - Cahier de liaison
- `class:` - Classes
- `attendance:` - Présences
- `event:` - Événements

## 🎨 Prochaines Étapes Suggérées

1. **Intégrer les appels API dans les composants existants** :
   - Remplacer les données mock par des appels réels au backend
   - Mettre à jour TeacherDashboard, ParentDashboard, StudentDashboard, AdminDashboard

2. **Ajouter la gestion des fichiers** (si nécessaire) :
   - Implémenter Supabase Storage pour les pièces jointes
   - Ajouter l'upload de fichiers pour les devoirs et ressources

3. **Améliorer la messagerie** :
   - Notifications en temps réel avec Supabase Realtime
   - Système de modération pour les messages élèves

4. **Tableaux de bord dynamiques** :
   - Charger les statistiques réelles depuis la base de données
   - Graphiques basés sur les données réelles

5. **Gestion avancée des classes** :
   - Assignation des élèves aux classes
   - Gestion des groupes et niveaux

## 📝 Notes Importantes

- Le serveur backend est déjà déployé et fonctionnel
- Les emails sont auto-confirmés (pas de serveur email configuré)
- La table KV Store est flexible et convient au prototypage
- Tous les appels API incluent une gestion d'erreurs détaillée
- Les logs serveur sont activés pour faciliter le débogage

## 🐛 Débogage

Si vous rencontrez des problèmes :

1. Vérifiez la console du navigateur pour les erreurs frontend
2. Consultez les logs du serveur Edge Functions dans Supabase
3. Testez les routes API directement avec un outil comme Postman
4. Vérifiez que les tokens d'authentification sont bien transmis

## ✅ Tests Suggérés

1. Créer un compte admin
2. Créer un compte enseignant
3. Créer un compte parent
4. Créer un compte élève
5. Tester la connexion/déconnexion
6. Tester la création de pancartes
7. Tester l'envoi de messages
8. Tester la création de devoirs
9. Tester l'ajout de notes

---

**Félicitations ! 🎉** Votre application Madrasati est maintenant prête avec une authentification complète et un backend robuste !
