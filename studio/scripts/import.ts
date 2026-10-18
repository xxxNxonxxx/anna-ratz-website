// Lädt den Startinhalt der Website (src/inhalt/standard.ts) samt Fotos nach Sanity.
//
//   npm run import                         # legt nur fehlende Seiten an
//   UEBERSCHREIBEN=1 npm run import        # ersetzt alle Seiten (Annas Änderungen gehen verloren!)
//
// Läuft mit dem Login von `sanity login` (--with-user-token).

import { createReadStream } from 'node:fs';
import { basename, join } from 'node:path';
import { getCliClient } from 'sanity/cli';
import { STANDARD } from '../../src/inhalt/standard.ts';

const client = getCliClient({ apiVersion: '2026-10-01' });
const PUBLIC = join(process.cwd(), '..', 'public');
const ueberschreiben = process.env.UEBERSCHREIBEN === '1';

// Welcher Schema-Typ in welcher Liste steckt (Sanity braucht _type bei Listeneinträgen).
const LISTEN_TYP: Record<string, string> = {
  ablauf: 'schritt',
  stimmen: 'stimme',
  pakete: 'paket',
  punkte: 'lString',
  extras: 'extra',
  tag: 'tagesabschnitt',
  faq: 'frage',
  karussell: 'foto',
  galerie: 'foto',
  bilderleiste: 'foto',
  bilder: 'portfolioBild',
  absaetze: 'lText',
  werte: 'wert',
  'shootings.arten': 'shootingArt',
  'anfrage.arten': 'lString',
};

const hochgeladen = new Map<string, string>();

async function asset(pfad: string) {
  if (!hochgeladen.has(pfad)) {
    const a = await client.assets.upload('image', createReadStream(join(PUBLIC, pfad)), { filename: basename(pfad) });
    hochgeladen.set(pfad, a._id);
    console.log('  Foto', basename(pfad));
  }
  return hochgeladen.get(pfad)!;
}

let schluessel = 0;
const neuerKey = () => `k${(schluessel++).toString(36)}${Math.random().toString(36).slice(2, 7)}`;

async function umwandeln(wert: unknown, dokument: string, feld: string): Promise<unknown> {
  if (Array.isArray(wert)) {
    const typ = LISTEN_TYP[`${dokument}.${feld}`] ?? LISTEN_TYP[feld];
    if (!typ) throw new Error(`Unbekannter Listentyp: ${dokument}.${feld}`);
    const aus = [];
    for (const eintrag of wert) {
      const u = (await umwandeln(eintrag, dokument, feld)) as Record<string, unknown>;
      aus.push({ ...u, _type: typ, _key: neuerKey() });
    }
    return aus;
  }
  if (wert && typeof wert === 'object') {
    const o = wert as Record<string, unknown>;
    if (typeof o.url === 'function') {
      const f = o as unknown as { url: (b: number) => string; alt: object; credit?: object };
      return {
        _type: 'foto',
        asset: { _type: 'reference', _ref: await asset(f.url(1800)) },
        alt: f.alt,
        ...(f.credit ? { credit: f.credit } : {}),
      };
    }
    const aus: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(o)) aus[k] = await umwandeln(v, dokument, k);
    return aus;
  }
  return wert;
}

for (const [dokument, inhalt] of Object.entries(STANDARD)) {
  if (!ueberschreiben && (await client.getDocument(dokument))) {
    console.log(`${dokument}: gibt es schon, übersprungen`);
    continue;
  }
  console.log(`${dokument}: lade hoch …`);
  const daten = (await umwandeln(inhalt, dokument, '')) as Record<string, unknown>;
  await client.createOrReplace({ _id: dokument, _type: dokument, ...daten });
  console.log(`${dokument}: fertig`);
}
console.log(`Import abgeschlossen, ${hochgeladen.size} Fotos hochgeladen.`);
