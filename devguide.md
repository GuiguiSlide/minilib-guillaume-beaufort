minilib/
| **l'intéraction clients/l'interface utilisateurs**
├── frontend/ ← Application React
│ ├── src/
│ │ ├── components/ ← Composants réutilisables (BookCard, Modal...)
│ │ ├── pages/ ← Pages de l'app (Books, Members, Loans...)
│ │ ├── services/ ← Appels API (api.js, bookService.js...)
│ │ └── App.jsx
│ └── package.json
│ **la connection entre la database et le frontend**
├── backend/ ← API Node.js / Express
│ ├── src/
│ │ ├── controllers/ ← Logique de traitement des requêtes
│ │ ├── routes/ ← Définition des endpoints REST
│ │ ├── models/ ← Accès base de données (requêtes SQL)
│ │ ├── middleware/ ← Validation, gestion erreurs, auth
│ │ └── app.js ← Point d'entrée Express
│ └── package.json
│ **la ou on enregistre les données**
|  # ici c'est juste un dossier pour les scripts sql pour la bdd
├── database/
│ ├── schema.sql ← Création des tables
│ └── seed.sql ← Données de test
│
├── docker-compose.yml ← Orchestration des 3 services
└── README.md

# bruno c'est un faux frontend pour tester le backend

TODO: https://drive.google.com/file/d/1ZeUPT1kK9xHyq_NF7W8t_E6bJuYErQyc/view section F vps