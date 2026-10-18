// Kundengalerie: eine Galerie pro Hochzeit oder Shooting. Liegt im privaten
// Dataset „kunden“, damit die Codes nicht öffentlich lesbar sind. Die Fotos
// selbst liegen in Cloudflare R2 im Ordner `ordner` (web/, original/, alle.zip).

import { defineField, defineType } from 'sanity';
import { GalerieLink } from './GalerieLink';

const ZEICHEN = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // ohne 0/O, 1/I/L

export function neuerCode(): string {
  const zufall = crypto.getRandomValues(new Uint32Array(8));
  const z = Array.from(zufall, (n) => ZEICHEN[n % ZEICHEN.length]).join('');
  return `${z.slice(0, 4)}-${z.slice(4)}`;
}

const inTagen = (tage: number) => new Date(Date.now() + tage * 86400000).toISOString().slice(0, 10);

export const galerie = defineType({
  name: 'galerie',
  title: 'Kundengalerie',
  type: 'document',
  fields: [
    defineField({
      name: 'paar',
      title: 'Name',
      type: 'string',
      description: 'Steht groß über der Galerie, z. B. „Lena & Paul“ oder „Familie Huber“.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Adresse',
      type: 'slug',
      description: 'Teil des Links: …/galerie/lena-paul. Auf „Erzeugen“ klicken.',
      options: { source: 'paar', maxLength: 60 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'code',
      title: 'Zugangscode',
      type: 'string',
      description: 'Wird automatisch erzeugt. Nur ändern, wenn ein Code weitergegeben wurde, der nicht hätte sollen.',
      initialValue: neuerCode,
      validation: (r) =>
        r.required().custom((wert) => (String(wert ?? '').replace(/[^A-Za-z0-9]/g, '').length >= 8 ? true : 'Mindestens 8 Buchstaben oder Ziffern.')),
    }),
    defineField({
      name: 'link',
      title: 'Link für das Paar',
      type: 'string',
      readOnly: true,
      description: 'Diesen Link per Mail oder WhatsApp schicken. Der Code steckt schon drin.',
      components: { input: GalerieLink },
    }),
    defineField({
      name: 'ordner',
      title: 'Ordner im Fotospeicher',
      type: 'string',
      description:
        'Name des Ordners in Cloudflare R2. Leer lassen = gleich wie die Adresse. Darin: „web“ (verkleinert, ca. 2000 px), „original“ (volle Auflösung) und optional „alle.zip“.',
    }),
    defineField({ name: 'datum', title: 'Datum der Hochzeit / des Shootings', type: 'date', options: { dateFormat: 'DD.MM.YYYY' } }),
    defineField({
      name: 'ablauf',
      title: 'Online bis',
      type: 'date',
      options: { dateFormat: 'DD.MM.YYYY' },
      description: 'Danach ist die Galerie nicht mehr erreichbar. Standard: 90 Tage.',
      initialValue: () => inTagen(90),
    }),
    defineField({ name: 'aktiv', title: 'Galerie freigeschaltet', type: 'boolean', initialValue: true }),
    defineField({
      name: 'hinweis',
      title: 'Persönliche Nachricht',
      type: 'text',
      rows: 3,
      description: 'Optional, steht über den Fotos, z. B. „Danke, dass ich euren Tag begleiten durfte!“',
    }),
  ],
  orderings: [{ title: 'Neueste zuerst', name: 'neu', by: [{ field: '_createdAt', direction: 'desc' }] }],
  preview: {
    select: { title: 'paar', datum: 'datum', ablauf: 'ablauf', aktiv: 'aktiv' },
    prepare: ({ title, datum, ablauf, aktiv }) => {
      const de = (d?: string) => (d ? d.split('-').reverse().join('.') : '');
      const vorbei = ablauf && ablauf < new Date().toISOString().slice(0, 10);
      return {
        title,
        subtitle: [datum && de(datum), aktiv === false ? 'gesperrt' : vorbei ? 'abgelaufen' : ablauf && `online bis ${de(ablauf)}`].filter(Boolean).join(' · '),
      };
    },
  },
});
