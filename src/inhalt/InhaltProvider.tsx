import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { ladeAusSanity, sanityAktiv } from './sanity.ts';
import { STANDARD } from './standard.ts';
import type { Inhalt } from './typen.ts';

const InhaltKontext = createContext<Inhalt>(STANDARD);

export function InhaltProvider({ children }: { children: ReactNode }) {
  const [inhalt, setInhalt] = useState<Inhalt | null>(sanityAktiv ? null : STANDARD);

  useEffect(() => {
    if (!sanityAktiv) return;
    ladeAusSanity(STANDARD)
      .then(setInhalt)
      .catch((fehler) => {
        console.error('Sanity nicht erreichbar, zeige Startinhalt.', fehler);
        setInhalt(STANDARD);
      });
  }, []);

  // Kurz leere Creme-Fläche statt aufblitzender alter Inhalte.
  if (!inhalt) return <div className="min-h-screen bg-creme" aria-busy="true" />;
  return <InhaltKontext.Provider value={inhalt}>{children}</InhaltKontext.Provider>;
}

export function useInhalt() {
  return useContext(InhaltKontext);
}
