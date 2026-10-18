// Ein Dokument pro Seite (Singletons). Die Dokument-ID ist der Name, z. B.
// "startseite" — die Website fragt genau diese IDs ab.

import { defineArrayMember, defineField, defineType } from 'sanity';

const ls = (name: string, title: string, extra: object = {}) => defineField({ name, title, type: 'lString', ...extra });
const lt = (name: string, title: string, extra: object = {}) => defineField({ name, title, type: 'lText', ...extra });
const bild = (name: string, title: string, extra: object = {}) => defineField({ name, title, type: 'foto', ...extra });
const liste = (name: string, title: string, typ: string, extra: object = {}) =>
  defineField({ name, title, type: 'array', of: [defineArrayMember({ type: typ })], ...extra });
const fotoListe = (name: string, title: string, description: string, extra: object = {}) =>
  defineField({ name, title, description, type: 'array', of: [defineArrayMember({ type: 'foto' })], options: { layout: 'grid' }, ...extra });

export const einstellungen = defineType({
  name: 'einstellungen',
  title: 'Kontakt & Einstellungen',
  type: 'document',
  fields: [
    defineField({ name: 'mail', title: 'E-Mail-Adresse', type: 'string', description: 'Hierhin gehen Anfragen aus dem Formular.' }),
    defineField({ name: 'telefon', title: 'Telefon', type: 'string' }),
    defineField({ name: 'instagram', title: 'Instagram-Name', type: 'string', description: 'Ohne @, z. B. annaratz.fotografie' }),
    ls('seitentitel', 'Titel im Browser-Tab und bei Google'),
    lt('beschreibung', 'Beschreibung bei Google'),
  ],
  preview: { prepare: () => ({ title: 'Kontakt & Einstellungen' }) },
});

export const startseite = defineType({
  name: 'startseite',
  title: 'Startseite',
  type: 'document',
  groups: [
    { name: 'oben', title: 'Oben', default: true },
    { name: 'karussell', title: 'Karussell' },
    { name: 'angebote', title: 'Angebote & Über mich' },
    { name: 'ablauf', title: 'Ablauf & Stimmen' },
    { name: 'unten', title: 'Region & Anfrage' },
  ],
  fields: [
    bild('heroBild', 'Großes Foto ganz oben', { group: 'oben' }),
    ls('ueberzeile', 'Kleine Zeile über dem Namen', { group: 'oben' }),
    ls('claim', 'Spruch unter dem Namen', { group: 'oben' }),
    lt('intro', 'Großer Satz darunter', { group: 'oben' }),
    ls('karussellTitel', 'Überschrift', { group: 'karussell' }),
    ls('karussellText', 'Hinweis darunter', { group: 'karussell' }),
    fotoListe('karussell', 'Fotos im Karussell', 'Am schönsten mit 8 bis 14 Fotos. Reihenfolge per Ziehen ändern.', { group: 'karussell' }),
    ls('angeboteTitel', 'Überschrift „Was ich fotografiere“', { group: 'angebote' }),
    ls('hochzeitTitel', 'Kachel Hochzeit: Titel', { group: 'angebote' }),
    lt('hochzeitText', 'Kachel Hochzeit: Text', { group: 'angebote' }),
    bild('hochzeitBild', 'Kachel Hochzeit: Foto', { group: 'angebote' }),
    ls('shootingsTitel', 'Kachel Shootings: Titel', { group: 'angebote' }),
    lt('shootingsText', 'Kachel Shootings: Text', { group: 'angebote' }),
    bild('shootingsBild', 'Kachel Shootings: Foto', { group: 'angebote' }),
    ls('ueberTitel', 'Über mich: Überschrift', { group: 'angebote' }),
    lt('ueberText', 'Über mich: Text', { group: 'angebote' }),
    bild('ueberBild', 'Über mich: Foto', { group: 'angebote' }),
    ls('ablaufTitel', 'Ablauf: Überschrift', { group: 'ablauf' }),
    liste('ablauf', 'Ablauf: Schritte', 'schritt', { group: 'ablauf' }),
    ls('stimmenTitel', 'Kundenstimmen: Überschrift', { group: 'ablauf' }),
    liste('stimmen', 'Kundenstimmen', 'stimme', { group: 'ablauf' }),
    ls('stimmenHinweis', 'Kleiner Hinweis unter den Stimmen', {
      group: 'ablauf',
      description: 'Sobald echte Kundenstimmen drin sind: beide Felder leeren.',
    }),
    ls('regionTitel', 'Region: Überschrift', { group: 'unten' }),
    lt('regionText', 'Region: Text', { group: 'unten' }),
    bild('regionBild', 'Region: Foto', { group: 'unten' }),
    ls('ctaTitel', 'Anfrage-Band: Überschrift', { group: 'unten', description: 'Das dunkle Band mit Foto am Ende jeder Seite.' }),
    lt('ctaText', 'Anfrage-Band: Text', { group: 'unten' }),
    bild('ctaBild', 'Anfrage-Band: Hintergrundfoto', { group: 'unten' }),
  ],
  preview: { prepare: () => ({ title: 'Startseite' }) },
});

export const hochzeit = defineType({
  name: 'hochzeit',
  title: 'Hochzeit',
  type: 'document',
  groups: [
    { name: 'kopf', title: 'Kopf', default: true },
    { name: 'pakete', title: 'Pakete & Preise' },
    { name: 'tag', title: 'Tagesablauf' },
    { name: 'galerie', title: 'Galerie' },
    { name: 'faq', title: 'Fragen' },
  ],
  fields: [
    ls('ueberzeile', 'Kleine Zeile über dem Titel', { group: 'kopf' }),
    ls('titel', 'Titel', { group: 'kopf' }),
    lt('intro', 'Einleitung', { group: 'kopf' }),
    bild('kopfbild', 'Foto oben', { group: 'kopf' }),
    ls('paketeTitel', 'Überschrift Pakete', { group: 'pakete' }),
    liste('pakete', 'Pakete', 'paket', { group: 'pakete', description: 'Am besten drei Pakete.' }),
    ls('extrasTitel', 'Überschrift Extras', { group: 'pakete' }),
    liste('extras', 'Extras', 'extra', { group: 'pakete' }),
    ls('anfahrt', 'Hinweis zur Anfahrt', { group: 'pakete' }),
    ls('tagTitel', 'Überschrift', { group: 'tag' }),
    liste('tag', 'Abschnitte', 'tagesabschnitt', { group: 'tag' }),
    ls('galerieTitel', 'Überschrift', { group: 'galerie' }),
    fotoListe('galerie', 'Fotos', 'Reihenfolge per Ziehen ändern.', { group: 'galerie' }),
    ls('faqTitel', 'Überschrift', { group: 'faq' }),
    liste('faq', 'Fragen & Antworten', 'frage', { group: 'faq' }),
  ],
  preview: { prepare: () => ({ title: 'Hochzeit' }) },
});

export const shootings = defineType({
  name: 'shootings',
  title: 'Private Shootings',
  type: 'document',
  fields: [
    ls('ueberzeile', 'Kleine Zeile über dem Titel'),
    ls('titel', 'Titel'),
    lt('intro', 'Einleitung'),
    bild('kopfbild', 'Foto oben'),
    liste('arten', 'Shooting-Arten', 'shootingArt', { description: 'Jede Art bekommt einen eigenen Abschnitt mit Preis und zwei Fotos.' }),
    ls('gutschein', 'Satz zu Gutscheinen'),
    ls('faqTitel', 'Überschrift Fragen'),
    liste('faq', 'Fragen & Antworten', 'frage'),
  ],
  preview: { prepare: () => ({ title: 'Private Shootings' }) },
});

export const portfolio = defineType({
  name: 'portfolio',
  title: 'Portfolio',
  type: 'document',
  fields: [
    ls('ueberzeile', 'Kleine Zeile über dem Titel'),
    ls('titel', 'Titel'),
    liste('bilder', 'Fotos', 'portfolioBild', {
      description: 'Jedes Foto bekommt eine Kategorie für den Filter. Reihenfolge per Ziehen ändern.',
      options: { layout: 'grid' },
    }),
  ],
  preview: { prepare: () => ({ title: 'Portfolio' }) },
});

export const ueberMich = defineType({
  name: 'ueberMich',
  title: 'Über mich',
  type: 'document',
  fields: [
    ls('ueberzeile', 'Kleine Zeile über dem Titel'),
    ls('titel', 'Titel'),
    bild('bild', 'Foto von dir'),
    liste('absaetze', 'Text (ein Eintrag pro Absatz)', 'lText'),
    defineField({ name: 'unterschrift', title: 'Unterschrift', type: 'string' }),
    ls('werteTitel', 'Überschrift „Was mir wichtig ist“'),
    liste('werte', 'Werte', 'wert'),
    fotoListe('bilderleiste', 'Fotoleiste unten', 'Vier Fotos sehen am besten aus.'),
  ],
  preview: { prepare: () => ({ title: 'Über mich' }) },
});

export const anfrage = defineType({
  name: 'anfrage',
  title: 'Anfrage',
  type: 'document',
  fields: [
    ls('ueberzeile', 'Kleine Zeile über dem Titel'),
    ls('titel', 'Titel'),
    lt('intro', 'Einleitung'),
    bild('bild', 'Foto neben dem Formular'),
    liste('arten', 'Auswahl „Worum geht es?“', 'lString', {
      description: 'Tipp: Die Namen der Shooting-Arten genau gleich schreiben, dann ist beim Klick auf „Anfrage senden“ die richtige Art vorausgewählt.',
    }),
  ],
  preview: { prepare: () => ({ title: 'Anfrage' }) },
});

export const rechtliches = defineType({
  name: 'rechtliches',
  title: 'Impressum & Datenschutz',
  type: 'document',
  fields: [
    defineField({ name: 'impressum', title: 'Impressum', type: 'lLangtext' }),
    defineField({ name: 'datenschutz', title: 'Datenschutzerklärung', type: 'lLangtext' }),
  ],
  preview: { prepare: () => ({ title: 'Impressum & Datenschutz' }) },
});

export const SEITEN = [startseite, hochzeit, shootings, portfolio, ueberMich, anfrage, einstellungen, rechtliches];
