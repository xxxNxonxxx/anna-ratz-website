import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? '',
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  },
  // Adresse des Studios nach `npm run deploy`: https://annaratz.sanity.studio
  studioHost: 'annaratz',
  deployment: { appId: 'to86m7nskj3yguna7fceowox', autoUpdates: true },
});
