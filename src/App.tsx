import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout.tsx';
import { SEITEN, type Seite } from './i18n/sprache.ts';
import { Anfrage } from './pages/Anfrage.tsx';
import { Hochzeit } from './pages/Hochzeit.tsx';
import { Portfolio } from './pages/Portfolio.tsx';
import { Bildnachweis, Datenschutz, Impressum, NichtGefunden } from './pages/Recht.tsx';
import { Shootings } from './pages/Shootings.tsx';
import { Start } from './pages/Start.tsx';
import { UeberMich } from './pages/UeberMich.tsx';

// Kundengalerie nur laden, wenn jemand sie öffnet (eigener Code-Teil inkl. ZIP)
const Galerie = lazy(() => import('./pages/Kundengalerie.tsx').then((m) => ({ default: m.Kundengalerie })));
function Kundengalerie() {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <Galerie />
    </Suspense>
  );
}

const KOMPONENTEN: Record<Seite, () => React.JSX.Element> = {
  start: Start,
  hochzeit: Hochzeit,
  shootings: Shootings,
  portfolio: Portfolio,
  ueber: UeberMich,
  anfrage: Anfrage,
  impressum: Impressum,
  datenschutz: Datenschutz,
  bildnachweis: Bildnachweis,
  galerie: Kundengalerie,
};

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {Object.entries(SEITEN).flatMap(([seite, pfade]) => {
          const Komponente = KOMPONENTEN[seite as Seite];
          return [
            <Route key={`${seite}-de`} path={pfade.de} element={<Komponente />} />,
            <Route key={`${seite}-en`} path={pfade.en} element={<Komponente />} />,
          ];
        })}
        <Route path={`${SEITEN.galerie.de}/:slug`} element={<Kundengalerie />} />
        <Route path={`${SEITEN.galerie.en}/:slug`} element={<Kundengalerie />} />
        <Route path="*" element={<NichtGefunden />} />
      </Route>
    </Routes>
  );
}
