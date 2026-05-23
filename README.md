# Site for Managers

A small sneaker resale inventory board built with React, Vite, Tailwind CSS, and localStorage.

## Features

- Kanban-style columns for new, in-progress, and sold pairs
- Add, edit, delete, move, filter, and sort sneakers
- Real starter sneaker names, style codes, and product images
- Data saved locally in the browser

## Local Development

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

## Build

```bash
npm run lint
npm run build
```

## GitHub Pages

This project includes a GitHub Actions workflow that builds the app and publishes the `dist` folder to GitHub Pages.

After pushing to GitHub:

1. Open the repository settings.
2. Go to **Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push to the `main` branch.

The Vite base path is configured for a repository named `Site-for-Managers`. If the repository name changes, update `repoName` in `vite.config.ts`.
