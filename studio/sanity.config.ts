import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'parent-coach-playbook',
  title: 'The Parent-Coach Playbook',
  // After running `npx sanity init`, paste your projectId and dataset here
  // (or set SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET env vars).
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'YOUR_PROJECT_ID',
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
