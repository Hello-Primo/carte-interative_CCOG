# Carte Interactive CCOG

Application Next.js (React) pour visualiser les points et dates de collecte des déchets de la Guyane Ouest (CCOG), avec carte interactive (Leaflet), interface en français, et support PWA.

## Fonctionnalités

- **Carte interactive** avec [react-leaflet](https://react-leaflet.js.org/) (OpenStreetMap)
- **Affichage des points de collecte** et tracés routiers par commune
- **Filtres dynamiques** (points, encombrants, déchets verts)
- **Interface moderne** avec Tailwind CSS
- **PWA** (Progressive Web App) : installable, offline partiel (cache dynamique)
- **Manifest PWA** conforme (icônes, screenshots, shortcuts)
- **Déploiement Vercel** prêt à l’emploi

## Installation

```bash
git clone https://github.com/Hello-Primo/carte-interative_CCOG.git
cd carte-interactive-ccog
npm install
```

## Développement local

```bash
npm run dev
```

L’application sera disponible sur [http://localhost:3000](http://localhost:3000).

## Build & export statique

```bash
npm run build
npm run export
```

Les fichiers statiques seront dans le dossier `out/` (pour déploiement GitHub Pages, Netlify, etc.).

## Déploiement Vercel

1. Poussez votre repo sur GitHub.
2. Connectez-le à [Vercel](https://vercel.com/).
3. Vercel détecte Next.js et déploie automatiquement.

## PWA (Progressive Web App)

- Icônes PWA : `public/icon-192.png` et `public/icon-512.png`
- Screenshot PWA : `public/screenshot-1440x900.jpg`
- Manifest conforme : `public/manifest.json`
- Service worker : `public/service-worker.js` (cache dynamique des tuiles OSM déjà visitées)

**Limite offline** : seules les tuiles de carte déjà visitées en ligne sont accessibles hors connexion (limite technique et licence OSM).

## Personnalisation

- **Ajoutez vos propres points/zones** dans les fichiers de données (ex : `src/app/sousZonesSLM.js`)
- **Modifiez l’UI** dans `src/app/CarteInteractive.js`
- **Changez les couleurs/typographie** via Tailwind CSS (`globals.css`)

## Dépendances principales

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [react-leaflet](https://react-leaflet.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [next-pwa](https://github.com/shadowwalker/next-pwa) (optionnel selon config)
- [PWA Builder Studio](https://www.pwabuilder.com/) (pour le manifest/service worker)
