# Carte Interactive CCOG (Next.js)

Ce projet est une migration de la carte interactive CCOG vers Next.js avec support PWA, Leaflet (via react-leaflet), Tailwind CSS et interface en français.

## Fonctionnalités prévues

- Carte interactive Leaflet (OpenStreetMap)
- Sélection de commune et filtres
- Affichage des points et tracés routiers
- Support PWA (offline, installation)
- UI moderne avec Tailwind CSS

## Démarrage

Pour démarrer le serveur de développement, utilisez l'une des commandes suivantes :

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir le résultat.

Vous pouvez commencer à modifier la page en modifiant `app/page.js`. La page se met à jour automatiquement lorsque vous modifiez le fichier.

Ce projet utilise [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) pour optimiser et charger automatiquement la police [Geist](https://vercel.com/font), une nouvelle famille de polices pour Vercel.

## À faire

- Intégrer la carte et la logique métier dans `src/app/page.js`
- Ajouter le manifest et le service worker dans `public/`
- Adapter la logique JS existante en React/Next.js

## En savoir plus

Pour en savoir plus sur Next.js, consultez les ressources suivantes :

- [Documentation Next.js](https://nextjs.org/docs) - découvrez les fonctionnalités et l'API de Next.js.
- [Apprendre Next.js](https://nextjs.org/learn) - un tutoriel interactif sur Next.js.

Vous pouvez consulter [le dépôt GitHub de Next.js](https://github.com/vercel/next.js) - vos retours et contributions sont les bienvenus !

## Déployer sur Vercel

Le moyen le plus simple de déployer votre application Next.js est d'utiliser la [plateforme Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) des créateurs de Next.js.

Consultez notre [documentation sur le déploiement Next.js](https://nextjs.org/docs/app/building-your-application/deploying) pour plus de détails.
