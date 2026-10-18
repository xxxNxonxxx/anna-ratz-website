// Form aller Inhalte, die Anna im Sanity Studio pflegt. Feldnamen sind identisch
// mit dem Studio-Schema (studio/schemas), damit Sanity-Daten ohne Umbau passen.

/** Text in beiden Sprachen. Fehlt Englisch, zeigt die Seite Deutsch. */
export interface L {
  de: string;
  en: string;
}

export interface Foto {
  /** URL in der gewünschten Breite. */
  url: (breite: number) => string;
  breite: number;
  hoehe: number;
  alt: L;
  /** CSS object-position aus dem Fokuspunkt, den Anna im Studio setzt. */
  position?: string;
  credit?: { name: string; link?: string; quelle?: string };
}

export type Kategorie = 'hochzeit' | 'paar' | 'familie' | 'babybauch' | 'portrait';

export interface Frage {
  frage: L;
  antwort: L;
}

export interface Inhalt {
  einstellungen: {
    mail: string;
    telefon: string;
    instagram: string;
    seitentitel: L;
    beschreibung: L;
  };
  startseite: {
    heroBild: Foto;
    ueberzeile: L;
    claim: L;
    intro: L;
    karussellTitel: L;
    karussellText: L;
    karussell: Foto[];
    angeboteTitel: L;
    hochzeitTitel: L;
    hochzeitText: L;
    hochzeitBild: Foto;
    shootingsTitel: L;
    shootingsText: L;
    shootingsBild: Foto;
    ueberTitel: L;
    ueberText: L;
    ueberBild: Foto;
    ablaufTitel: L;
    ablauf: { titel: L; text: L }[];
    stimmenTitel: L;
    stimmen: { text: L; name: string; ort: L }[];
    stimmenHinweis?: L;
    regionTitel: L;
    regionText: L;
    regionBild: Foto;
    ctaTitel: L;
    ctaText: L;
    ctaBild: Foto;
  };
  hochzeit: {
    ueberzeile: L;
    titel: L;
    intro: L;
    kopfbild: Foto;
    paketeTitel: L;
    pakete: { name: L; dauer: L; preis: number; punkte: L[]; beliebt?: boolean }[];
    extrasTitel: L;
    extras: { name: L; preis: number; ab?: boolean }[];
    anfahrt: L;
    tagTitel: L;
    tag: { zeit: L; titel: L; text: L }[];
    galerieTitel: L;
    galerie: Foto[];
    faqTitel: L;
    faq: Frage[];
  };
  shootings: {
    ueberzeile: L;
    titel: L;
    intro: L;
    kopfbild: Foto;
    arten: { name: L; preis: number; dauer: L; text: L; bildGross: Foto; bildKlein: Foto }[];
    gutschein: L;
    faqTitel: L;
    faq: Frage[];
  };
  portfolio: {
    ueberzeile: L;
    titel: L;
    bilder: { foto: Foto; kategorie: Kategorie }[];
  };
  ueberMich: {
    ueberzeile: L;
    titel: L;
    bild: Foto;
    absaetze: L[];
    unterschrift: string;
    werteTitel: L;
    werte: { titel: L; text: L }[];
    bilderleiste: Foto[];
  };
  anfrage: {
    ueberzeile: L;
    titel: L;
    intro: L;
    bild: Foto;
    arten: L[];
  };
  rechtliches: {
    impressum: L;
    datenschutz: L;
  };
}
