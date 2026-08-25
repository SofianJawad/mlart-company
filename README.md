# ML'Art Company — Site vitrine

Site de **ML'Art Company**, compagnie d'arts de la scène des Monts du Lyonnais :
spectacles, prestations événementielles sur-mesure et ateliers.

## 🎭 La solution choisie : gratuit et sans entretien

| Élément        | Choix                                                        | Coût    |
| -------------- | ------------------------------------------------------------ | ------- |
| Générateur     | [Astro](https://astro.build) (site statique)                 | 0 €     |
| CMS (édition)  | [Decap CMS](https://decapcms.org) (ex-Netlify CMS), en français | 0 €     |
| Hébergement    | [Netlify](https://www.netlify.com)                           | 0 €     |
| Formulaire     | Netlify Forms                                                | 0 €     |
| Police         | Google Fonts (Cormorant Garamond + Nunito Sans)              | 0 €     |

**Pourquoi cette combinaison ?** Le site est un ensemble de pages statiques (rapides,
impossibles à pirater) généré automatiquement à chaque modification. Le contenu s'édite dans un
panneau d'administration web **en français** (`https://votre-site.fr/admin`), comme un traitement
de texte : pas de base de données, pas de mises à jour de sécurité, pas de maintenance.

## 🚀 Déploiement (20 minutes, une seule fois)

> La personne qui gère le site n'a **jamais** besoin de refaire ces étapes.

1. **Créer un compte GitHub** (gratuit) : https://github.com/signup
2. **Créer un dépôt** : bouton vert « New » → nommer par ex. `mlart-company` → « Create repository ».
3. **Envoyer le site dans le dépôt** : dans ce dossier, ouvrir un terminal et taper :

   ```bash
   git init
   git add .
   git commit -m "Site ML'Art Company"
   git branch -M main
   git remote add origin https://github.com/VOTRE-PSEUDO/mlart-company.git
   git push -u origin main
   ```

4. **Créer un compte Netlify** (gratuit) : https://app.netlify.com/signup (avec le compte GitHub).
5. **Importer le site** : « Add new site » → « Import an existing project » → choisir le dépôt
   `mlart-company` → « Deploy ». Netlify détecte tout seul (`netlify.toml`) et le site est en
   ligne en ~1 minute à l'adresse `https://mlart-company.netlify.app`.

### Activer le panneau d'administration

1. Dans Netlify : **Site configuration → Identity** → « Enable Identity ».
2. **Identity → Registration** : cocher « Invite only ».
3. « Invite users » → saisir l'email de la personne qui gère le site → envoyer l'invitation.
4. Dans **Site configuration → Identity → Services** : « Enable Git Gateway ».
5. Ouvrir `https://mlart-company.netlify.app/admin/` → « Login with Netlify Identity » →
   l'email reçu sert de mot de passe de connexion (ou magic link).

### Activer les notifications du formulaire de contact

Dans Netlify : **Forms** → « Active forms » → `contact` → « Notifications » → « Add
notification » → « Email notification » → saisir l'adresse qui doit recevoir les messages
(il est aussi possible de brancher Slack, Telegram…). Les messages envoyés depuis le site
apparaissent dans l'onglet **Forms** de Netlify.

### (Facultatif) Nom de domaine personnalisé

Acheter un domaine (ex. `mlart-company.fr`, ~10 €/an chez OVH, Gandi, Ionos…) puis dans Netlify :
**Domain settings → Add a domain** → suivre les instructions (le nom de domaine doit pointer
vers Netlify, qui fournit aussi le certificat HTTPS automatiquement).

## ✏️ Modifier le contenu au quotidien

1. Aller sur `https://votre-site.fr/admin/` et se connecter.
2. Les rubriques du panneau correspondent aux pages :

| Rubrique du panneau            | Effet sur le site                                    |
| ------------------------------ | ---------------------------------------------------- |
| **Spectacles**                 | Les 3 fiches (Rêveries, Cabaret, Ascenseur) + création de nouveaux spectacles (avec photo, vidéo, dossier PDF, galerie, lieux de tournée) |
| **Prestations événementielles**| Les 5 prestations de la page Événementiel            |
| **Ateliers**                   | Les 3 cartes de la page Ateliers                      |
| **Partenaires**                | Le bandeau « Ils nous ont fait confiance » (ajout/suppression de logos) |
| **Paramètres du site**         | Email, téléphone, adresse, liens Instagram/Facebook (affichés dans le pied de page et la page Contact) |

3. Cliquer sur **« Publier »** : le site est reconstruit automatiquement en ~1 minute.

> 💡 Les images s'importent directement dans le panneau (bouton « Choisir un fichier »).
> Les photos actuelles sont des illustrations temporaires : pensez à les remplacer par les
> vraies photos de la compagnie.

## 🛠️ Développement local (pour les développeurs)

```bash
npm install
npm run dev        # site en local : http://localhost:4321
npm run admin      # serveur Decap local (utilisé par /admin en dev)
```

Structure :

```
src/
  content/          ← TOUT le contenu éditable (markdown + frontmatter)
    spectacles/     ← fiches spectacles (1 fichier = 1 spectacle)
    prestations/    ← prestations événementielles
    ateliers/       ← ateliers
    partenaires/    ← logos partenaires
    settings/       ← coordonnées de contact
  layouts/          ← gabarit de page
  components/       ← en-tête, pied de page, bandeaux…
  pages/            ← pages du site (Astro)
  styles/           ← design system (couleurs, typographies)
public/
  admin/            ← panneau Decap CMS (config.yml = collections du CMS)
  images/           ← images du site (les imports du panneau vont dans images/uploads)
scripts/            ← utilitaires de génération (à relancer seulement si on modifie les listes)
```

## ✅ Points de vigilance (une seule fois, à la mise en ligne)

- Dans `astro.config.mjs` et `public/admin/config.yml` : remplacer l'URL du site par la
  véritable adresse (ex. `https://www.mlart-company.fr`).
- Dans `src/content/settings/contact.md` (ou via le panneau, plus simple) : saisir la vraie
  adresse email et le vrai numéro de téléphone.
- Vérifier les crédits des spectacles dans le panneau (rubrique Spectacles) : ils sont
  volontairement génériques.
