// Preise selbst pflegt Anna in Sanity (bzw. stehen im Startinhalt src/inhalt/standard.ts).

export function euro(betrag: number, sprache: 'de' | 'en') {
  return new Intl.NumberFormat(sprache === 'de' ? 'de-AT' : 'en-GB', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(betrag);
}
