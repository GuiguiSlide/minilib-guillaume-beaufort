minilib/
├── frontend/ ← Application React
│ ├── src/
│ │ ├── components/ ← Composants réutilisables (BookCard, Modal...)
│ │ ├── pages/ ← Pages de l'app (Books, Members, Loans...)
│ │ ├── services/ ← Appels API (api.js, bookService.js...)
│ │ └── App.jsx
│ └── package.json
│
├── backend/ ← API Node.js / Express
│ ├── src/
│ │ ├── controllers/ ← Logique de traitement des requêtes
│ │ ├── routes/ ← Définition des endpoints REST
│ │ ├── models/ ← Accès base de données (requêtes SQL)
│ │ ├── middleware/ ← Validation, gestion erreurs, auth
│ │ └── app.js ← Point d'entrée Express
│ └── package.json
│
├── database/
│ ├── schema.sql ← Création des tables
│ └── seed.sql ← Données de test
│
├── docker-compose.yml ← Orchestration des 3 services
└── README.md

# pour utiliser les githooks il faut utiliser la commande
git config core.hooksPath .githooks
# ça vas dire a git de chercher les githooks dans le dossier .githooks
# ces githooks la vont servir pour surveiller les commits et leurs formattages

dans backend package.json "main": "index.js" peut poser probleme