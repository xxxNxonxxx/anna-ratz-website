import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useSprache, type Seite } from '../i18n/sprache.ts';

type MenueSeite = Extract<Seite, 'hochzeit' | 'shootings' | 'portfolio' | 'ueber' | 'anfrage'>;
const MENUE: MenueSeite[] = ['hochzeit', 'shootings', 'portfolio', 'ueber'];

export function Layout() {
  const { t, i, l, sprache, pfad, andereSprache } = useSprache();
  const kontakt = i.einstellungen;
  const { pathname } = useLocation();
  const [offen, setOffen] = useState(false);
  const [gescrollt, setGescrollt] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setOffen(false);
  }, [pathname]);

  const seitentitel = l(kontakt.seitentitel);
  const beschreibung = l(kontakt.beschreibung);
  useEffect(() => {
    document.documentElement.lang = sprache;
    document.title = seitentitel;
    document.querySelector('meta[name="description"]')?.setAttribute('content', beschreibung);
  }, [sprache, seitentitel, beschreibung]);

  useEffect(() => {
    const pruefe = () => setGescrollt(window.scrollY > 24);
    pruefe();
    window.addEventListener('scroll', pruefe, { passive: true });
    return () => window.removeEventListener('scroll', pruefe);
  }, []);

  const linkKlasse = ({ isActive }: { isActive: boolean }) =>
    `relative py-1 transition hover:text-tinte after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-tinte after:transition-transform ${
      isActive ? 'text-tinte after:scale-x-100' : 'text-grau after:scale-x-0 hover:after:scale-x-100'
    }`;

  return (
    <>
      <a href="#inhalt" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:bg-creme focus:px-4 focus:py-2">
        {t.nav.zumInhalt}
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
          gescrollt || offen ? 'bg-creme/85 shadow-[0_1px_0_var(--color-linie)] backdrop-blur-md' : ''
        }`}
      >
        <div className="rahmen flex h-20 items-center justify-between gap-6">
          <Link to={pfad('start')} className="font-serif text-2xl leading-none tracking-tight">
            Anna Ratz
            <span className="ml-2 align-middle font-sans text-[0.62rem] tracking-[0.3em] text-grau uppercase">
              {t.nav.fotografie}
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm lg:flex" aria-label="Hauptmenü">
            {MENUE.map((s) => (
              <NavLink key={s} to={pfad(s)} className={linkKlasse}>
                {t.nav[s]}
              </NavLink>
            ))}
            <Link to={andereSprache} className="text-xs tracking-[0.2em] text-grau hover:text-tinte" hrefLang={sprache === 'de' ? 'en' : 'de'} aria-label={t.nav.sprache}>
              {t.nav.spracheKurz}
            </Link>
            <Link to={pfad('anfrage')} className="knopf px-5 py-2.5">
              {t.nav.anfrage}
            </Link>
          </nav>
          <button
            className="flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
            onClick={() => setOffen((o) => !o)}
            aria-expanded={offen}
            aria-controls="mobil-menue"
            aria-label={offen ? t.nav.schliessen : t.nav.menue}
          >
            <span className="relative block h-3 w-6">
              <span className={`absolute left-0 h-px w-6 bg-tinte transition ${offen ? 'top-1.5 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 h-px w-6 bg-tinte transition ${offen ? 'top-1.5 -rotate-45' : 'top-3'}`} />
            </span>
          </button>
        </div>
        <AnimatePresence>
          {offen && (
            <motion.nav
              id="mobil-menue"
              className="h-[calc(100dvh-5rem)] overflow-y-auto bg-creme lg:hidden"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <ul className="rahmen flex flex-col gap-2 pt-8">
                {[...MENUE, 'anfrage' as const].map((s, i) => (
                  <motion.li key={s} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 * i + 0.1 }}>
                    <NavLink to={pfad(s)} className="block py-2 font-serif text-5xl">
                      {t.nav[s]}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
              <div className="rahmen mt-10 flex items-center gap-6 border-t border-linie pt-6 text-sm text-grau">
                <Link to={andereSprache} hrefLang={sprache === 'de' ? 'en' : 'de'}>
                  {t.nav.sprache}
                </Link>
                <a href={`mailto:${kontakt.mail}`}>{kontakt.mail}</a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main id="inhalt">
        <Outlet />
      </main>

      <footer className="border-t border-linie bg-sand/60">
        <div className="rahmen grid gap-10 py-16 sm:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-serif text-3xl">Anna Ratz</p>
            <p className="mt-3 max-w-xs text-sm text-grau">{l(i.startseite.ueberzeile)}</p>
          </div>
          <ul className="space-y-2 text-sm">
            {MENUE.map((s) => (
              <li key={s}>
                <Link to={pfad(s)} className="text-grau hover:text-tinte">
                  {t.nav[s]}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="space-y-2 text-sm text-grau">
            <li>
              <a href={`mailto:${kontakt.mail}`} className="hover:text-tinte">
                {kontakt.mail}
              </a>
            </li>
            {kontakt.telefon && (
              <li>
                <a href={`tel:${kontakt.telefon.replace(/\s/g, '')}`} className="hover:text-tinte">
                  {kontakt.telefon}
                </a>
              </li>
            )}
            {kontakt.instagram && (
              <li>
                <a href={`https://instagram.com/${kontakt.instagram}`} className="hover:text-tinte" rel="noreferrer" target="_blank">
                  Instagram @{kontakt.instagram}
                </a>
              </li>
            )}
            <li>
              <Link to={andereSprache} hrefLang={sprache === 'de' ? 'en' : 'de'} className="hover:text-tinte">
                {t.nav.sprache}
              </Link>
            </li>
          </ul>
        </div>
        <div className="rahmen flex flex-wrap gap-x-6 gap-y-2 border-t border-linie py-6 text-xs text-grau">
          <span>© {new Date().getFullYear()} Anna Ratz</span>
          <Link to={pfad('impressum')} className="hover:text-tinte">
            {t.footer.impressum}
          </Link>
          <Link to={pfad('datenschutz')} className="hover:text-tinte">
            {t.footer.datenschutz}
          </Link>
          <Link to={pfad('bildnachweis')} className="hover:text-tinte">
            {t.footer.bildnachweis}
          </Link>
          <Link to={pfad('galerie')} className="hover:text-tinte">
            {t.galerie.footer}
          </Link>
        </div>
      </footer>
    </>
  );
}
