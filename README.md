# Journal Intime Numérique 

Application mobile React Native (Expo) permettant à un utilisateur de tenir
un journal intime privé et sécurisé sur son téléphone.

Projet réalisé pour le cours **React Native** — UCCC (Faculté des Sciences
Informatiques), Prof. Events Bernadotte.

## Fonctionnalités

- Écran d'accueil (Splash) avec navigation vers inscription / connexion
- Inscription (email + mot de passe + confirmation, avec validation)
- Connexion sécurisée
- Déconnexion
- Création, lecture (triée par date) et suppression d'entrées de journal
- Chaque entrée peut avoir une humeur et des étiquettes (tags)
- Recherche simple par titre, texte, étiquette ou date
- Routes protégées : impossible d'accéder au journal sans être connecté
- Stockage local chiffré (AES) — aucune donnée n'est écrite en clair

## Architecture du projet

```
journal-intime/
├── App.js                     # Point d'entrée, navigation (public vs privé)
├── src/
│   ├── context/
│   │   └── AuthContext.js     # Inscription, connexion, déconnexion, session
│   ├── screens/
│   │   ├── SplashScreen.js
│   │   ├── LoginScreen.js
│   │   ├── SignUpScreen.js
│   │   ├── HomeScreen.js      # Liste des entrées + recherche
│   │   ├── AddEntryScreen.js  # Formulaire de création
│   │   └── EntryDetailScreen.js
│   ├── components/
│   │   └── EntryCard.js       # Carte d'affichage d'une entrée
│   └── utils/
│       ├── security.js        # Hachage, sel, dérivation de clé, chiffrement AES
│       └── storage.js         # Accès AsyncStorage (utilisateurs + entrées chiffrées)
```

### Pourquoi cette structure ?

- **`context/AuthContext.js`** centralise toute la logique d'authentification
  via l'API `Context` de React (comme demandé dans le cahier des charges :
  `useContext`). Le composant racine (`App.js`) lit l'état `user` pour
  décider quelle pile de navigation afficher — c'est ce mécanisme qui
  **protège les routes** : tant qu'il n'y a pas de session valide, les
  écrans du journal ne sont tout simplement pas montés dans le navigateur.
- **`utils/security.js`** et **`utils/storage.js`** sont séparés du reste
  pour isoler toute la logique sensible (mots de passe, chiffrement) dans
  des modules testables indépendamment de l'UI.

## Sécurité — mesures mises en place

1. **Mots de passe jamais stockés en clair.**
   Chaque utilisateur a un **sel** aléatoire unique (16 octets). On stocke
   `SHA-256(mot_de_passe + sel)`, jamais le mot de passe lui-même.
2. **Chiffrement des données locales (AES).**
   Les entrées du journal sont chiffrées avec AES avant d'être écrites dans
   `AsyncStorage`. La **clé de chiffrement** est dérivée du mot de passe via
   PBKDF2 (1000 itérations) au moment de la connexion, et vit **uniquement
   en mémoire** (React state) — elle n'est jamais persistée sur le disque.
   Si quelqu'un extrait le stockage brut du téléphone, il ne voit que du
   texte chiffré illisible.
3. **Validation côté client** : format d'email (regex), robustesse du mot
   de passe (6+ caractères, 1 majuscule, 1 chiffre), confirmation du mot
   de passe, messages d'erreur clairs.
4. **Routes protégées** : les écrans du journal (`Home`, `AddEntry`,
   `EntryDetail`) ne sont accessibles que si `AuthContext.user` n'est pas
   `null`.
5. **Déconnexion propre** : la clé de chiffrement est effacée de la mémoire
   à la déconnexion (`setEncryptionKey(null)`).

> Limite assumée (à mentionner dans la présentation si besoin) : dans une
> version de production, on utiliserait `expo-secure-store` (Keychain /
> Keystore) pour stocker un token de session au lieu de garder la clé
> uniquement en mémoire — ce qui éviterait de redemander le mot de passe
> à chaque redémarrage complet de l'app.

## Installation et lancement

Prérequis : Node.js (18+), et l'application **Expo Go** sur votre téléphone
(ou un émulateur Android/iOS).

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
npx expo start

# 3. Scanner le QR code avec l'app Expo Go (Android)
#    ou avec l'appareil photo (iOS)
```

### Générer l'APK

```bash
npx expo install eas-cli
eas build -p android --profile preview
```
(nécessite un compte Expo gratuit — `eas login`)

          | `crypto-js` (AES, SHA-256, PBKDF2)      |

## Auteur

PIERRE ANTOINE Judel — UCCC, Faculté des Sciences Informatiques
