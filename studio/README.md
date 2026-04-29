# Sanity Studio (parent-coach-playbook-studio)

The CMS that powers article editing without touching code.

## First-time setup

1. Install dependencies (one time):
   ```
   cd studio
   npm install
   ```
2. Initialize a Sanity project (creates the cloud-hosted project):
   ```
   npx sanity init --bare
   ```
   Pick "Create new project". Name it `parent-coach-playbook`. Use the `production` dataset.

3. Copy the `projectId` Sanity prints into:
   - `studio/sanity.config.ts` (replace `YOUR_PROJECT_ID`)
   - The site root `.env` as `PUBLIC_SANITY_PROJECT_ID=...`

4. Run the studio locally:
   ```
   npm run dev
   ```
   It opens at http://localhost:3333

5. Deploy the studio (free, hosted by Sanity):
   ```
   npm run deploy
   ```
   Pick a hostname like `parent-coach-playbook` so you log in at
   https://parent-coach-playbook.sanity.studio

## Schemas

- article — every issue
- author — bylines
- gear — affiliate picks
- leadMagnet — free downloads
- page — static pages (about, etc.)
- newsletterIssue — Kit archive mirror
- siteSettings — nav, footer, social

## Migrating Astro markdown content into Sanity

The site ships with three sample articles as markdown in `src/content/articles/`.
When you're ready to switch to Sanity, follow the migration steps in the root `README.md`.
