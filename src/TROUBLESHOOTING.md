# 🔧 Dépannage - Madrasati

> Guide de résolution des problèmes courants

---

## 🔑 Problèmes de Connexion

### ❌ "Invalid login credentials"

**Contexte :** Vous voyez cette erreur dans la console lors de l'utilisation des comptes démo.

**Explication :**
- C'est **NORMAL** lors de la première utilisation d'un compte démo
- L'application tente d'abord de se connecter
- Si le compte n'existe pas, elle reçoit "Invalid login credentials"
- Puis elle crée automatiquement le compte
- Et vous connecte ensuite

**Solution :**
- ✅ **Aucune action requise** - Le système gère cela automatiquement
- Le message dans la console peut être ignoré
- Vous verrez un toast "Création du compte de démonstration en cours..."
- Suivi de "Compte créé ! Connecté en tant que [Nom] !"

**Si le problème persiste :**
1. Vérifiez que vous avez bien cliqué sur un bouton de compte démo
2. Attendez quelques secondes pour la création du compte
3. Si rien ne se passe, rafraîchissez la page (F5)
4. Réessayez avec le bouton démo

---

### ❌ "User not found" ou "Failed to fetch user data"

**Contexte :** Vous êtes connecté mais l'application ne charge pas vos données.

**Causes possibles :**
1. Le serveur backend n'a pas créé les métadonnées utilisateur
2. Problème de connexion au serveur Supabase
3. Session expirée

**Solution :**
1. **Déconnexion complète :**
   - Cliquez sur votre avatar
   - Sélectionnez "Déconnexion"
   
2. **Reconnexion avec compte démo :**
   - Utilisez les boutons "🎯 Accès rapide - Comptes démo"
   - Le système recréera les données nécessaires

3. **Si le problème persiste :**
   - Ouvrez la console du navigateur (F12)
   - Cherchez des messages d'erreur détaillés
   - Vérifiez que l'URL du serveur est correcte

---

### ❌ "Failed to sign up"

**Contexte :** La création de compte échoue.

**Causes possibles :**
1. Email déjà utilisé
2. Mot de passe trop court (minimum 6 caractères)
3. Problème de connexion au serveur

**Solution :**
1. **Email déjà utilisé :**
   - Utilisez l'option "Se connecter" au lieu de "S'inscrire"
   - Ou utilisez un autre email

2. **Mot de passe :**
   - Assurez-vous qu'il fait au moins 6 caractères
   - Les comptes démo utilisent "demo123" (7 caractères)

3. **Pour les comptes démo :**
   - Utilisez les boutons dédiés qui gèrent tout automatiquement
   - Pas besoin de créer manuellement

---

## 🔄 Problèmes de Chargement

### ⏳ "Chargement..." infini

**Contexte :** L'écran reste bloqué sur "Chargement..."

**Solution :**
1. **Attendez 10 secondes** - La première connexion peut prendre du temps
2. **Rafraîchissez la page** (F5)
3. **Videz le cache :**
   - Chrome/Edge : Ctrl+Shift+Delete
   - Firefox : Ctrl+Shift+Delete
   - Safari : Cmd+Option+E
4. **Réessayez** avec un compte démo

---

### 🔄 Page blanche

**Contexte :** L'application ne s'affiche pas du tout.

**Solution :**
1. **Vérifiez la console :**
   - F12 pour ouvrir les DevTools
   - Onglet "Console"
   - Cherchez des erreurs en rouge

2. **Rafraîchissez avec Ctrl+F5**
   - Force le rechargement complet

3. **Vérifiez votre connexion Internet**

4. **Essayez un autre navigateur**
   - Chrome, Firefox, Edge, Safari

---

## 📱 Problèmes d'Interface

### 🖼️ Images manquantes

**Contexte :** Certaines images ne s'affichent pas.

**Solution :**
- C'est normal - Les images proviennent d'Unsplash
- Elles se chargent progressivement
- Un placeholder s'affiche en attendant

---

### 🎨 Styles incorrects

**Contexte :** L'interface ne ressemble pas aux captures d'écran.

**Solution :**
1. **Videz le cache** du navigateur
2. **Rafraîchissez** avec Ctrl+F5
3. **Vérifiez votre navigateur :**
   - Chrome 90+
   - Firefox 88+
   - Safari 14+
   - Edge 90+

---

### 📱 Responsive ne fonctionne pas

**Contexte :** L'affichage mobile est cassé.

**Solution :**
1. **Rafraîchissez la page**
2. **Redimensionnez la fenêtre** du navigateur
3. **Sur mobile :** Rechargez la page
4. **Vérifiez le zoom :** Doit être à 100%

---

## 🔐 Problèmes de Session

### 🚪 Déconnexion automatique

**Contexte :** Vous êtes déconnecté de façon inattendue.

**Explication :**
- Les sessions Supabase expirent après un certain temps
- C'est un comportement de sécurité normal

**Solution :**
- Reconnectez-vous avec vos identifiants
- Ou utilisez les boutons de compte démo

---

### 🔑 "Unauthorized"

**Contexte :** Certaines actions retournent "Unauthorized".

**Solution :**
1. **Déconnectez-vous complètement**
2. **Reconnectez-vous**
3. **Vérifiez votre rôle :**
   - Admin : Accès complet
   - Enseignant : Gestion de classe
   - Parent : Consultation enfant
   - Élève : Accès limité

---

## 🗄️ Problèmes de Données

### 📊 "No data available"

**Contexte :** Les tableaux de bord sont vides.

**Explication :**
- C'est normal pour un nouveau compte
- Aucune donnée n'a été créée encore

**Solution pour tester :**
1. **En tant qu'Enseignant :**
   - Créez une pancarte
   - Ajoutez un devoir
   - Saisissez des notes

2. **En tant qu'Admin :**
   - Créez une classe
   - Ajoutez des utilisateurs

3. **En tant que Parent/Élève :**
   - Attendez que l'enseignant crée du contenu
   - Ou changez de compte pour créer des données

---

### 💾 Données non sauvegardées

**Contexte :** Les modifications ne sont pas enregistrées.

**Solution :**
1. **Vérifiez la connexion Internet**
2. **Attendez le message de confirmation**
3. **Rafraîchissez la page** pour vérifier
4. **Consultez la console** (F12) pour les erreurs

---

## 🌐 Problèmes de Backend

### ⚠️ "Failed to fetch"

**Contexte :** Erreur lors de la communication avec le serveur.

**Causes possibles :**
1. Serveur backend en maintenance
2. Problème de CORS
3. URL incorrecte

**Solution :**
1. **Vérifiez `/utils/supabase/info.tsx` :**
   - `projectId` doit être correct
   - `publicAnonKey` doit être valide

2. **Consultez les logs serveur**
   - Dans le dashboard Supabase
   - Edge Functions logs

3. **Attendez quelques minutes** et réessayez

---

### 🔧 Erreurs 500 (Internal Server Error)

**Contexte :** Le serveur retourne une erreur 500.

**Solution :**
1. **Consultez les logs** Edge Functions
2. **Vérifiez les variables d'environnement** :
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - SUPABASE_DB_URL

3. **Redéployez** les Edge Functions si nécessaire

---

## 📞 Support Avancé

### 🐛 Rapporter un Bug

Si vous rencontrez un problème non listé ici :

1. **Collectez les informations :**
   - Message d'erreur exact
   - Étapes pour reproduire
   - Capture d'écran
   - Console logs (F12)

2. **Vérifiez la console :**
   ```
   F12 → Console → Copiez les erreurs
   ```

3. **Vérifiez le Network :**
   ```
   F12 → Network → Filtrer par "Failed"
   ```

4. **Informations système :**
   - Navigateur et version
   - Système d'exploitation
   - Rôle utilisateur utilisé

---

## ✅ Checklist de Vérification

Avant de demander de l'aide, vérifiez :

- [ ] J'ai rafraîchi la page (F5 ou Ctrl+F5)
- [ ] J'ai vidé le cache du navigateur
- [ ] J'ai essayé avec un compte démo
- [ ] J'ai vérifié la console (F12)
- [ ] J'ai testé sur un autre navigateur
- [ ] J'ai vérifié ma connexion Internet
- [ ] J'ai attendu au moins 10 secondes
- [ ] J'ai lu ce guide de dépannage

---

## 🎯 Solutions Rapides Résumées

| Problème | Solution Rapide |
|----------|----------------|
| Invalid login credentials | Normal - Ignorez, le compte se crée auto |
| Chargement infini | Rafraîchir (F5) |
| Page blanche | Vider cache + Ctrl+F5 |
| Données vides | Normal pour nouveau compte |
| Déconnexion auto | Reconnectez-vous |
| Images manquantes | Attendez le chargement |
| Failed to fetch | Vérifiez connexion Internet |
| Unauthorized | Déconnexion + Reconnexion |

---

## 🚀 Redémarrage Propre

Pour repartir de zéro :

1. **Déconnectez-vous**
2. **Videz le cache** du navigateur
3. **Fermez tous les onglets** de l'application
4. **Rafraîchissez** la page
5. **Utilisez un compte démo** pour vous reconnecter
6. **Testez** une fonctionnalité simple

---

## 📚 Documentation Connexe

- [DEMARRAGE_RAPIDE.md](DEMARRAGE_RAPIDE.md) - Guide de démarrage
- [CREDENTIALS.md](CREDENTIALS.md) - Identifiants de connexion
- [README_SUPABASE.md](README_SUPABASE.md) - API Backend
- [VERIFICATION.md](VERIFICATION.md) - Tests de validation

---

**💡 Astuce :** 90% des problèmes sont résolus avec un simple rafraîchissement (F5) et une reconnexion !

---

*Dernière mise à jour : ${new Date().toLocaleDateString('fr-FR')}*
