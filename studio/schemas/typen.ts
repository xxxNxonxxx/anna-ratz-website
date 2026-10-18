// Wiederverwendbare Feldtypen: zweisprachige Texte, Foto, Listeneinträge.
// Feldnamen müssen mit src/inhalt/typen.ts der Website übereinstimmen.

import { defineArrayMember, defineField, defineType } from 'sanity';

const zweiSprachen = (typ: 'string' | 'text', zeilen?: number) => [
  defineField({ name: 'de', title: 'Deutsch', type: typ, ...(zeilen ? { rows: zeilen } : {}) }),
  defineField({
    name: 'en',
    title: 'English',
    type: typ,
    description: 'Leer lassen = auf der englischen Seite steht der deutsche Text.',
    ...(zeilen ? { rows: zeilen } : {}),
  }),
];

export const lString = defineType({
  name: 'lString',
  title: 'Text (kurz)',
  type: 'object',
  options: { columns: 2 },
  fields: zweiSprachen('string'),
  preview: { select: { title: 'de', subtitle: 'en' } },
});

export const lText = defineType({
  name: 'lText',
  title: 'Text (lang)',
  type: 'object',
  options: { columns: 2 },
  fields: zweiSprachen('text', 4),
  preview: { select: { title: 'de', subtitle: 'en' } },
});

export const lLangtext = defineType({
  name: 'lLangtext',
  title: 'Seitentext',
  type: 'object',
  fields: zweiSprachen('text', 14),
});

export const foto = defineType({
  name: 'foto',
  title: 'Foto',
  type: 'image',
  options: { hotspot: true },
  description: 'Foto in voller Auflösung hochladen – die Website verkleinert es selbst. Mit „Bearbeiten“ (Stift) den wichtigsten Bildteil markieren.',
  fields: [
    defineField({
      name: 'alt',
      title: 'Bildbeschreibung',
      type: 'lString',
      description: 'Was ist zu sehen? Für Blinde und für Google, z. B. „Brautpaar beim ersten Tanz“.',
    }),
    defineField({
      name: 'credit',
      title: 'Bildnachweis (nur bei fremden Fotos)',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      description: 'Bei eigenen Fotos leer lassen.',
      fields: [
        defineField({ name: 'name', title: 'Fotograf*in', type: 'string' }),
        defineField({ name: 'link', title: 'Link zur Person', type: 'url' }),
        defineField({ name: 'quelle', title: 'Link zum Foto', type: 'url' }),
      ],
    }),
  ],
  preview: { select: { media: 'asset', title: 'alt.de' } },
});

export const frage = defineType({
  name: 'frage',
  title: 'Frage',
  type: 'object',
  fields: [
    defineField({ name: 'frage', title: 'Frage', type: 'lString' }),
    defineField({ name: 'antwort', title: 'Antwort', type: 'lText' }),
  ],
  preview: { select: { title: 'frage.de', subtitle: 'antwort.de' } },
});

export const schritt = defineType({
  name: 'schritt',
  title: 'Schritt',
  type: 'object',
  fields: [
    defineField({ name: 'titel', title: 'Titel', type: 'lString' }),
    defineField({ name: 'text', title: 'Text', type: 'lText' }),
  ],
  preview: { select: { title: 'titel.de', subtitle: 'text.de' } },
});

export const stimme = defineType({
  name: 'stimme',
  title: 'Kundenstimme',
  type: 'object',
  fields: [
    defineField({ name: 'text', title: 'Zitat', type: 'lText' }),
    defineField({ name: 'name', title: 'Name', type: 'string', description: 'z. B. „Lena & Markus“' }),
    defineField({ name: 'ort', title: 'Anlass / Ort', type: 'lString', description: 'z. B. „Hochzeit in der Wachau“' }),
  ],
  preview: { select: { title: 'name', subtitle: 'text.de' } },
});

export const paket = defineType({
  name: 'paket',
  title: 'Paket',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'lString' }),
    defineField({ name: 'dauer', title: 'Dauer', type: 'lString', description: 'z. B. „5 Stunden“' }),
    defineField({ name: 'preis', title: 'Preis in €', type: 'number', validation: (r) => r.required().min(0) }),
    defineField({ name: 'punkte', title: 'Was enthalten ist', type: 'array', of: [defineArrayMember({ type: 'lString' })] }),
    defineField({ name: 'beliebt', title: 'Als „Am beliebtesten“ hervorheben', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { title: 'name.de', preis: 'preis', beliebt: 'beliebt' },
    prepare: ({ title, preis, beliebt }) => ({ title, subtitle: `${preis ?? '?'} €${beliebt ? ' · am beliebtesten' : ''}` }),
  },
});

export const extra = defineType({
  name: 'extra',
  title: 'Extra',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'lString' }),
    defineField({ name: 'preis', title: 'Preis in €', type: 'number', validation: (r) => r.required().min(0) }),
    defineField({ name: 'ab', title: '„ab“ vor den Preis schreiben', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { title: 'name.de', preis: 'preis', ab: 'ab' },
    prepare: ({ title, preis, ab }) => ({ title, subtitle: `${ab ? 'ab ' : ''}${preis ?? '?'} €` }),
  },
});

export const tagesabschnitt = defineType({
  name: 'tagesabschnitt',
  title: 'Abschnitt des Tages',
  type: 'object',
  fields: [
    defineField({ name: 'zeit', title: 'Tageszeit', type: 'lString' }),
    defineField({ name: 'titel', title: 'Titel', type: 'lString' }),
    defineField({ name: 'text', title: 'Text', type: 'lText' }),
  ],
  preview: { select: { title: 'titel.de', subtitle: 'zeit.de' } },
});

export const shootingArt = defineType({
  name: 'shootingArt',
  title: 'Shooting-Art',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'lString' }),
    defineField({ name: 'preis', title: 'Preis ab (€)', type: 'number', validation: (r) => r.required().min(0) }),
    defineField({ name: 'dauer', title: 'Dauer & Bilder', type: 'lString', description: 'z. B. „1 Stunde · ca. 40 Bilder“' }),
    defineField({ name: 'text', title: 'Beschreibung', type: 'lText' }),
    defineField({ name: 'bildGross', title: 'Großes Foto', type: 'foto' }),
    defineField({ name: 'bildKlein', title: 'Kleines Foto (überlappend)', type: 'foto' }),
  ],
  preview: {
    select: { title: 'name.de', preis: 'preis', media: 'bildGross' },
    prepare: ({ title, preis, media }) => ({ title, subtitle: `ab ${preis ?? '?'} €`, media }),
  },
});

export const wert = defineType({
  name: 'wert',
  title: 'Wert',
  type: 'object',
  fields: [
    defineField({ name: 'titel', title: 'Titel', type: 'lString' }),
    defineField({ name: 'text', title: 'Text', type: 'lText' }),
  ],
  preview: { select: { title: 'titel.de', subtitle: 'text.de' } },
});

export const portfolioBild = defineType({
  name: 'portfolioBild',
  title: 'Portfolio-Foto',
  type: 'object',
  fields: [
    defineField({ name: 'foto', title: 'Foto', type: 'foto' }),
    defineField({
      name: 'kategorie',
      title: 'Kategorie',
      type: 'string',
      options: {
        list: [
          { title: 'Hochzeit', value: 'hochzeit' },
          { title: 'Paar', value: 'paar' },
          { title: 'Familie', value: 'familie' },
          { title: 'Babybauch', value: 'babybauch' },
          { title: 'Portrait', value: 'portrait' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { media: 'foto', kategorie: 'kategorie', title: 'foto.alt.de' },
    prepare: ({ media, kategorie, title }) => ({ media, title: title || 'Foto', subtitle: kategorie }),
  },
});

export const TYPEN = [lString, lText, lLangtext, foto, frage, schritt, stimme, paket, extra, tagesabschnitt, shootingArt, wert, portfolioBild];
