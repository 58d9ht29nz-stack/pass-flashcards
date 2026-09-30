# Contrat API IA

Le frontend envoie :

```json
{ "prompt": "..." }
```

L'endpoint doit répondre par un tableau :

```json
[
  {
    "term": "Exopeptidase",
    "importance": 3,
    "type": "definition",
    "question": "Qu'est-ce qu'une exopeptidase ?",
    "answer": "Enzyme qui hydrolyse les liaisons peptidiques aux extrémités d'une chaîne.",
    "tags": ["enzyme", "biochimie", "QCM"]
  }
]
```

Il est aussi accepté de renvoyer `{ "cards": [...] }`.

## Production
Pour une vraie application, ne mets pas une clé secrète dans `VITE_AI_API_KEY`. Le navigateur est contrôlé par l'utilisateur. Utilise plutôt une fonction serveur :

`React → /api/generate → fournisseur IA`

La fonction serveur garde la clé dans une variable secrète et renvoie uniquement le JSON des cartes.
