# Comptes de Test - Madrasati

## 🔑 Comptes de démonstration

**🎯 ACCÈS INSTANTANÉ !** Utilisez les boutons "Comptes démo" sur la page de connexion pour créer et vous connecter automatiquement !

Pour tester rapidement l'application, utilisez ces comptes de démonstration :

### 👨‍💼 Administrateur
- **Rôle** : Admin
- **Email** : `admin@madrasati.com`
- **Mot de passe** : `demo123`
- **Nom** : Admin Principal
- **Accès** :
  - Gestion des utilisateurs
  - Gestion des classes
  - Configuration de l'application
  - Surveillance du curriculum
  - Statistiques globales

### 👨‍🏫 Enseignant
- **Rôle** : Enseignant
- **Email** : `prof.martin@madrasati.com`
- **Mot de passe** : `demo123`
- **Nom** : M. Martin
- **Accès** :
  - Création de pancartes
  - Gestion des devoirs
  - Saisie des notes
  - Messagerie avec parents et élèves
  - Gestion de l'emploi du temps
  - Ressources pédagogiques
  - Absences et présences

### 👨‍👩‍👧 Parent
- **Rôle** : Parent
- **Email** : `parent.dupont@madrasati.com`
- **Mot de passe** : `demo123`
- **Nom** : Mme Dupont
- **Accès** :
  - Consultation des pancartes
  - Signature du cahier de liaison
  - Messagerie avec enseignants
  - Consultation des notes de l'enfant
  - Consultation des devoirs
  - Emploi du temps
  - Parent Café (forum)

### 🎓 Élève
- **Rôle** : Élève
- **Email** : `eleve.sarah@madrasati.com`
- **Mot de passe** : `demo123`
- **Nom** : Sarah Dupont
- **Accès** :
  - Consultation des pancartes
  - Messagerie élève (modérée)
  - Devoirs et soumissions
  - Consultation des notes
  - Emploi du temps
  - Ressources pédagogiques

---

## 📝 Comment créer ces comptes

### 🎯 Méthode Rapide (RECOMMANDÉE) :

1. Sur la page de connexion, cliquez sur **"🎯 Accès rapide - Comptes démo"**
2. Choisissez le rôle que vous voulez tester (Admin, Enseignant, Parent, ou Élève)
3. Le compte sera créé automatiquement et vous serez connecté instantanément !

### Via l'interface web (méthode manuelle) :

1. Cliquez sur **"Pas de compte ? S'inscrire"**
2. Remplissez les informations :
   - Nom complet
   - Adresse email
   - Mot de passe (minimum 6 caractères)
3. Sélectionnez le rôle approprié
4. Cliquez sur **"Créer mon compte"**
5. Vous serez automatiquement connecté

### Via l'API (pour tests automatisés) :

```bash
# Créer un compte admin
curl -X POST https://flmoihpzyczvjunypbqk.supabase.co/functions/v1/make-server-9846636e/auth/signup \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@madrasati.com",
    "password": "admin123",
    "name": "Admin Principal",
    "role": "admin",
    "metadata": {
      "schoolId": "school-001"
    }
  }'
```

---

## 🧪 Scénarios de Test Suggérés

### Test 1 : Flux Enseignant → Parent
1. Connectez-vous en tant qu'**Enseignant**
2. Créez une nouvelle pancarte "Sortie scolaire"
3. Ajoutez un devoir "Mathématiques - Exercices page 42"
4. Envoyez un message à un parent
5. Déconnectez-vous
6. Connectez-vous en tant que **Parent**
7. Vérifiez que la pancarte est visible
8. Vérifiez que le devoir apparaît
9. Répondez au message de l'enseignant
10. Signez une entrée du cahier de liaison

### Test 2 : Flux Enseignant → Élève
1. Connectez-vous en tant qu'**Enseignant**
2. Créez un devoir "Rédaction : Mon héros préféré"
3. Ajoutez une note pour un élève
4. Déconnectez-vous
5. Connectez-vous en tant qu'**Élève**
6. Consultez le devoir
7. Soumettez le devoir
8. Consultez vos notes

### Test 3 : Gestion Admin
1. Connectez-vous en tant qu'**Admin**
2. Consultez la liste des utilisateurs
3. Créez une nouvelle classe
4. Consultez les statistiques globales
5. Configurez les paramètres de l'école

### Test 4 : Messagerie Multi-rôles
1. Créez les 4 comptes (Admin, Enseignant, Parent, Élève)
2. Testez l'envoi de messages entre :
   - Enseignant ↔ Parent
   - Enseignant ↔ Élève
   - Élève ↔ Élève (avec modération)
3. Vérifiez les notifications de messages non lus
4. Testez le marquage comme "lu"

### Test 5 : Cycle Complet d'un Devoir
1. **Enseignant** : Créer un devoir avec date limite
2. **Élève** : Consulter et soumettre le devoir
3. **Enseignant** : Consulter la soumission
4. **Enseignant** : Noter le devoir avec feedback
5. **Élève** : Consulter la note et le feedback
6. **Parent** : Consulter la note de l'enfant

### Test 6 : Cahier de Liaison
1. **Enseignant** : Créer une entrée de liaison "Autorisation sortie"
2. Marquer comme "Nécessite une signature"
3. **Parent** : Consulter l'entrée
4. **Parent** : Signer l'entrée
5. **Enseignant** : Vérifier la signature

---

## 🔍 Points de Vérification

### Authentification
- ✅ Inscription fonctionnelle
- ✅ Connexion avec email/mot de passe
- ✅ Session persistante (rechargement de page)
- ✅ Déconnexion propre
- ✅ Redirection selon le rôle

### Autorisation
- ✅ Accès aux fonctionnalités selon le rôle
- ✅ Routes protégées
- ✅ Opérations admin réservées aux admins
- ✅ Visibilité des données selon le rôle

### Données
- ✅ Création de données (pancartes, devoirs, messages)
- ✅ Lecture des données
- ✅ Modification des données
- ✅ Suppression des données
- ✅ Filtrage par utilisateur/classe

### Interface
- ✅ Loading states pendant les requêtes
- ✅ Messages d'erreur clairs
- ✅ Notifications toast (succès/erreur)
- ✅ Interface responsive
- ✅ Navigation fluide

---

## 🐛 Problèmes Connus & Solutions

### "User not found" après connexion
- **Cause** : Les données utilisateur ne sont pas dans le KV store
- **Solution** : Recréer le compte via l'inscription

### "Unauthorized" sur les requêtes API
- **Cause** : Token expiré ou invalide
- **Solution** : Se déconnecter et se reconnecter

### Messages ne s'affichent pas
- **Cause** : Filtrage incorrect ou recipientId manquant
- **Solution** : Vérifier que recipientId est bien défini lors de l'envoi

### Données ne se chargent pas
- **Cause** : Erreur réseau ou serveur
- **Solution** : Vérifier la console navigateur et les logs serveur

---

## 📊 Données de Test Suggérées

### Classes à créer
- CP-A (Niveau 1, Année 2024-2025)
- CE1-B (Niveau 2, Année 2024-2025)
- CE2-C (Niveau 3, Année 2024-2025)

### Matières
- Français
- Mathématiques
- Sciences
- Histoire-Géographie
- Arts plastiques
- Éducation physique

### Types de pancartes
- Annonces (sorties, événements)
- Informations (réunions, calendrier)
- Autorisations (photos, sorties)
- Félicitations (réussites)

### Types d'évaluations
- Contrôle continu
- Évaluation trimestrielle
- Exercices
- Projets
- Participation

---

## 🎯 Objectifs de Test

1. **Fonctionnel** : Toutes les fonctionnalités marchent
2. **Performance** : Chargement rapide des données
3. **UX** : Navigation intuitive et fluide
4. **Sécurité** : Accès contrôlé selon les rôles
5. **Fiabilité** : Pas d'erreurs lors des opérations courantes

---

**Bon test ! 🚀**
