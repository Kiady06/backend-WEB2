# Exam Hub API

API du gestionnaire d'examens QCM **Exam Hub**. Deux rôles distincts :

- **Admin** : gestion des étudiants, cours, examens, questions et résultats.
- **Étudiant** : passage des examens, consultation de ses résultats (note calculée côté serveur).

Toute erreur renvoie un objet JSON de la forme `{ "message": "..." }`.

## Stack technique

- **Runtime** : Node.js
- **Framework** : Express + TypeScript
- **Base de données** : PostgreSQL (`pg`)
- **Validation** : Zod
- **Authentification** : JWT (`Bearer <token>`), token valable 24h, payload `{ userId, role }`
- **Mots de passe** : hachés en bcrypt

## Architecture

Le projet suit un pattern en couches, **Route → Controller → Service → Repository** :

```
src/
├── config/         # connexion DB, CORS, variables d'environnement
├── models/         # interfaces TS + schémas de validation Zod
├── repositories/    # accès aux données (requêtes SQL brutes via pg)
├── services/        # règles métier, gestion des erreurs (NotFoundError, ConflictError...)
├── controllers/      # gestion req/res, délègue aux services
├── middlewares/       # authMiddleware, roleMiddleware, validate, errorHandler
├── routes/            # déclaration des routes Express
└── index.ts            # point d'entrée, montage des routers
```

- Les **routes** valident les entrées (Zod) et vérifient l'authentification/le rôle avant d'atteindre le contrôleur.
- Les **services** contiennent la logique métier et lèvent des erreurs typées (`NotFoundError`, `ConflictError`...), interceptées par un `errorHandler` global.
- Les **repositories** sont les seuls à parler à PostgreSQL.

## Prérequis

- Node.js (version 18+ recommandée)
- PostgreSQL

## Installation

```bash
git clone <url-du-repo>
cd exam-hub-api
npm install
```

## Variables d'environnement

Créer un fichier `.env` à la racine (adapter selon `src/config/db.ts` et `src/env.ts`) :

```env
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/exam_hub
JWT_SECRET=change-me
```

## Base de données

Exécuter le script SQL de création des tables (`users`, `courses`, `exams`, `questions`, `choices`, `attempts`, `answers`) avant de démarrer le serveur. Voir `schema.sql` (ou l'emplacement équivalent dans le repo) pour le détail des contraintes (clés étrangères, `CHECK (end_date > start_date)`, unicité `(student_id, exam_id)`, etc.).

> ⚠️ Si tu utilises le tri des questions par `position`, pense à appliquer :
> ```sql
> ALTER TABLE questions ADD COLUMN position INTEGER NOT NULL DEFAULT 1;
> ```

## Lancer le projet

```bash
npm run dev     # mode développement (hot-reload)
npm run build   # compilation TypeScript
npm start        # exécution du build
```

*(adapte ces commandes à celles réellement définies dans ton `package.json`)*

## Sécurité

- Toutes les routes (sauf `POST /auth/login`) exigent un header `Authorization: Bearer <token>`.
- Le rôle (`admin` / `student`) est vérifié par des middlewares dédiés (`requireAdmin` / routes `/my/*` réservées aux étudiants).
- Un compte désactivé (`is_active = false`) ne peut plus se connecter ("Account disabled").
- Les étudiants ne voient jamais `is_correct` avant d'avoir soumis leur examen (RG-07) ; la note est toujours calculée côté serveur (RG-05/06), jamais envoyée par le client.
- Un examen ne peut être passé qu'une seule fois par étudiant (RG-02, contrainte `UNIQUE (student_id, exam_id)`).

## Aperçu des endpoints

| Ressource | Méthode | Route | Accès |
|---|---|---|---|
| Auth | POST | `/auth/login` | Public |
| Students | GET / POST | `/students` | Admin |
| Students | PUT / DELETE | `/students/:id` | Admin |
| Courses | GET / POST | `/courses` | Admin |
| Courses | PUT / DELETE | `/courses/:id` | Admin |
| Exams | GET / POST | `/exams` | Admin |
| Exams | GET / PUT / DELETE | `/exams/:id` | Admin |
| Exams | GET | `/exams/:id/results` | Admin |
| Questions | GET / POST | `/exams/:id/questions` | Admin |
| Questions | PUT / DELETE | `/questions/:id` | Admin |
| My | GET | `/my/exams` | Étudiant |
| My | GET | `/my/exams/:id` | Étudiant |
| My | POST | `/my/exams/:id/submit` | Étudiant |
| My | GET | `/my/results` | Étudiant |

Détail complet des schémas de requête/réponse : voir la spec OpenAPI du projet.

## Règles de gestion principales

- **RG-02** : un examen ne peut être soumis qu'une seule fois par étudiant.
- **RG-04** : une question doit avoir entre 2 et 6 choix, exactement 1 correct.
- **RG-05/06** : la note est calculée côté serveur ; une question sans réponse vaut 0 point.
- **RG-07** : les choix envoyés à l'étudiant avant soumission ne contiennent jamais `is_correct`.
- **RG-08** : impossible de modifier/supprimer les questions d'un examen qui a déjà des tentatives.
- **RG-09** : suppression refusée pour un cours qui a des examens, ou un examen qui a des tentatives.
- **RG-10** : un étudiant n'est jamais supprimé physiquement, seulement désactivé (`is_active = false`).
- **RG-12** : la soumission renvoie une correction complète (question par question).

## Workflow Git

Une branche par fonctionnalité, préfixée selon son type :

```bash
git checkout -b feat/add-new-ressources
```

Préfixes courants : `feat/`, `fix/`, `chore/`, `refactor/`.