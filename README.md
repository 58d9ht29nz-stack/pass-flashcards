# PASS Cards — MVP

Application web React + TypeScript + Tailwind pensée pour créer et réviser des flashcards à partir de cours PASS.

## Fonctionnalités MVP
- Import de plusieurs PDF et fichiers texte + copier/coller
- Extraction de texte PDF côté navigateur avec PDF.js
- Détection locale de termes, définitions, valeurs et comparaisons
- Génération de flashcards sans API grâce au mode démo local
- Couche API IA optionnelle via URL configurable
- Édition et suppression des cartes
- Révision recto/verso + 4 niveaux de réponse
- Répétition espacée simple : 1 / 3 / 7 / 14 jours
- Tableau de bord et progression
- Sauvegarde automatique dans `localStorage`

## Lancer
```bash
npm install
npm run dev
```
Puis ouvrir l'URL affichée par Vite, généralement `http://localhost:5173`.

Build production :
```bash
npm run build
npm run preview
```

## Première utilisation
1. Accueil → `Nouveau cours`.
2. Donne un nom et une matière.
3. Importe un PDF ou colle le texte.
4. Ouvre le cours → `Générer les flashcards`.
5. Va dans `Flashcards` ou `Révisions`.

## Connecter une IA
Le champ `URL de l’API IA` attend un endpoint qui accepte un POST JSON contenant `{ "prompt": "..." }` et renvoie soit un tableau JSON de cartes, soit `{ cards: [...] }`.

Pour un vrai produit, recommandé : faire l'appel IA depuis un backend (Node/Express, Supabase Edge Function, Cloudflare Worker, etc.) et garder la clé secrète uniquement côté serveur.

`.env.example` est fourni pour préparer des variables d'environnement, mais le MVP actuel permet aussi de configurer l'URL depuis l'écran Paramètres.

## Données
Les données sont stockées localement dans le navigateur sous la clé `pass-flashcards-mvp-v1`. Elles persistent après fermeture de l'application, mais ne sont pas synchronisées entre appareils.

## Déploiement
- Vercel : importer le projet Git, build `npm run build`, output `dist`.
- Netlify : build `npm run build`, publish `dist`.
- Cloudflare Pages : build `npm run build`, output `dist`.

## Évolutions recommandées
1. OCR des images (Tesseract.js ou service OCR).
2. Backend IA sécurisé.
3. Auth + base PostgreSQL/Supabase.
4. Import/export Anki.
5. QCM PASS générés par IA.
6. Algorithme FSRS plus avancé.
7. Synchronisation multi-appareils.
