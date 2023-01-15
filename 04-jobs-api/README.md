#### Setup

```bash
npm install && npm start
```

#### Setup Connexion À La Base De Données

1. Créer db.js
2. Setup .env dans la racine

#### Routers

- jobs.js

#### Tables

- users
- jobs

#### Users

Regex de validation d'e-mail

```regex
/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
```

#### Enregister L'utilisateur

- Valider nom, email et mot de passe - dans le contrôleur
- Hasher le mot de passe (avec bcryptjs)
- sauvegarde l'utilisateur
- Générer un token
- Envoyer la réponse avec le token

#### Générer Une Clef

[All keys generator ](https://www.allkeysgenerator.com/)

#### Connecter L'utilisateur

- Valider email et mot de passe - dans le contrôleur
- Si email or mot de passe est manquant, throw BadRequestError
- Trouver l'utilisateur
- Comparer les mots de passes
- Si l'utiliseur ou le mot de passe ne correspond pas, throw UnauthenticatedError
- Si c'est correcte, générer un token
- Envoyer la réponse avec le token

#### Erreurs Postgres

- Erreurs de validation
- email dupliqué

#### Securité

- helmet
- cors
- xss-clean
- express-rate-limit

Swagger UI

```yaml
/jobs/{id}:
  parameters:
    - in: path
      name: id
      schema:
        type: string
      required: true
      description: the job id
```
