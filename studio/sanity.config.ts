// Annas Bearbeitungsseite mit zwei Bereichen (oben links umschalten):
// „Website“ = feste Liste der Seiten (keine „neuen Dokumente“),
// „Kundengalerien“ = privates Dataset `kunden` mit den Zugangscodes.

import { deDELocale } from '@sanity/locale-de-de';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { galerie } from './schemas/galerie';
import { SEITEN } from './schemas/seiten';
import { TYPEN } from './schemas/typen';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? '';
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';

const SINGLETONS = new Set<string>(SEITEN.map((s) => s.name));

export default defineConfig([
  {
    name: 'anna-ratz',
    title: 'Anna Ratz · Website',
    basePath: '/website',
    projectId,
    dataset,
    plugins: [
      structureTool({
        title: 'Website',
        structure: (S) =>
          S.list()
            .title('Seiten')
            .items(
              SEITEN.flatMap((seite, i) => {
                const eintrag = S.listItem()
                  .title(seite.title ?? seite.name)
                  .id(seite.name)
                  .child(
                    S.document()
                      .schemaType(seite.name)
                      .documentId(seite.name)
                      .title(seite.title ?? seite.name),
                  );
                // Trennlinie vor den Einstellungen
                return seite.name === 'einstellungen' && i > 0 ? [S.divider(), eintrag] : [eintrag];
              }),
            ),
      }),
      deDELocale(),
    ],
    schema: {
      types: [...TYPEN, ...SEITEN],
      // Seiten gibt es genau einmal: nicht neu anlegen.
      templates: (vorlagen) => vorlagen.filter(({ schemaType }) => !SINGLETONS.has(schemaType)),
    },
    document: {
      // Seiten nicht löschen oder duplizieren können.
      actions: (aktionen, { schemaType }) =>
        SINGLETONS.has(schemaType) ? aktionen.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action)) : aktionen,
      newDocumentOptions: (optionen) => optionen.filter(({ templateId }) => !SINGLETONS.has(templateId)),
    },
  },
  {
    name: 'kunden',
    title: 'Kundengalerien',
    subtitle: 'Fotos für Brautpaare und Familien',
    basePath: '/kunden',
    projectId,
    dataset: 'kunden',
    plugins: [
      structureTool({
        title: 'Galerien',
        structure: (S) =>
          S.documentTypeList('galerie')
            .title('Kundengalerien')
            .defaultOrdering([{ field: '_createdAt', direction: 'desc' }]),
      }),
      deDELocale(),
    ],
    schema: { types: [galerie] },
  },
]);
