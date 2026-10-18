// Kundengalerie: Brautpaare und Familien sehen hier ihre Fotos und laden sie
// herunter, ohne Konto. Zugang mit Code (oder Link mit ?code=…). Die Daten kommen
// vom Worker unter /api/galerie (worker/index.ts), die Fotos aus Cloudflare R2.

import { downloadZip } from 'client-zip';
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { SEITEN, useSprache } from '../i18n/sprache.ts';
import { DEMO, demoAnmelden, demoFotoUrl, demoInhalt } from './galerieDemo.ts';

interface FotoEintrag {
  name: string;
  groesse: number;
}

interface GalerieDaten {
  token: string;
  paar: string;
  slug: string;
  datum: string | null;
  ablauf: string | null;
  hinweis: string | null;
  fotos: FotoEintrag[];
  zip: { groesse: number } | null;
  gesamt: number;
}

type Fehler = 'falsch' | 'abgelaufen' | 'fehler';

const API = '/api/galerie';
const speicherKey = (slug: string) => `galerie:${slug}`;

function tokenLesen(slug: string): string | null {
  try {
    return sessionStorage.getItem(speicherKey(slug));
  } catch {
    return null;
  }
}

function tokenMerken(slug: string, token: string | null) {
  try {
    if (token) sessionStorage.setItem(speicherKey(slug), token);
    else sessionStorage.removeItem(speicherKey(slug));
  } catch {
    // privates Fenster: dann eben ohne Merken
  }
}

async function anmelden(code: string, slug?: string): Promise<GalerieDaten | Fehler> {
  if (DEMO) return demoAnmelden(code, slug);
  try {
    const r = await fetch(`${API}/anmelden`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ code, slug }),
    });
    if (r.ok) return (await r.json()) as GalerieDaten;
    if (r.status === 401) return 'falsch';
    if (r.status === 403) return 'abgelaufen';
    return 'fehler';
  } catch {
    return 'fehler';
  }
}

async function laden(slug: string, token: string): Promise<GalerieDaten | null> {
  if (DEMO) return demoInhalt(slug);
  const r = await fetch(`${API}/${encodeURIComponent(slug)}?t=${encodeURIComponent(token)}`).catch(() => null);
  if (!r?.ok) return null;
  return { ...((await r.json()) as Omit<GalerieDaten, 'token'>), token };
}

const fotoUrl = (d: GalerieDaten, art: 'web' | 'original', name: string, herunterladen = false) =>
  DEMO
    ? demoFotoUrl(art, name)
    : `${API}/${encodeURIComponent(d.slug)}/${art}/${encodeURIComponent(name)}?t=${encodeURIComponent(d.token)}${herunterladen ? '&laden' : ''}`;

export function Kundengalerie() {
  const { slug } = useParams();
  const [suche] = useSearchParams();
  const navigate = useNavigate();
  const { sprache } = useSprache();
  const [daten, setDaten] = useState<GalerieDaten | null>(null);
  const [fehler, setFehler] = useState<Fehler | null>(null);
  const [laeuft, setLaeuft] = useState(Boolean(slug));

  // Galerien nicht in Suchmaschinen
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  // Link mit Code oder gemerktes Token
  useEffect(() => {
    if (!slug) return;
    let aktiv = true;
    const code = suche.get('code');
    (async () => {
      setLaeuft(true);
      if (code) {
        const antwort = await anmelden(code, slug);
        if (!aktiv) return;
        // Code aus der Adresszeile nehmen, damit er nicht in Verlauf oder Screenshots landet
        navigate(`${SEITEN.galerie[sprache]}/${slug}`, { replace: true });
        if (typeof antwort === 'string') setFehler(antwort);
        else {
          tokenMerken(slug, antwort.token);
          setDaten(antwort);
        }
      } else {
        const token = tokenLesen(slug);
        const d = token ? await laden(slug, token) : null;
        if (!aktiv) return;
        if (d) setDaten(d);
        else tokenMerken(slug, null);
      }
      setLaeuft(false);
    })();
    return () => {
      aktiv = false;
    };
    // nur beim Öffnen einer Galerie, nicht bei jeder Änderung der Adresszeile
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (daten && daten.slug === slug) {
    return (
      <GalerieAnsicht
        daten={daten}
        abmelden={() => {
          tokenMerken(daten.slug, null);
          setDaten(null);
          navigate(SEITEN.galerie[sprache]);
        }}
      />
    );
  }

  return (
    <CodeEingabe
      laeuft={laeuft}
      fehler={fehler}
      absenden={async (code) => {
        setLaeuft(true);
        setFehler(null);
        const antwort = await anmelden(code, slug);
        setLaeuft(false);
        if (typeof antwort === 'string') return setFehler(antwort);
        tokenMerken(antwort.slug, antwort.token);
        setDaten(antwort);
        if (antwort.slug !== slug) navigate(`${SEITEN.galerie[sprache]}/${antwort.slug}`);
      }}
    />
  );
}

function CodeEingabe({ laeuft, fehler, absenden }: { laeuft: boolean; fehler: Fehler | null; absenden: (code: string) => void }) {
  const { t, pfad } = useSprache();
  const g = t.galerie;
  const [code, setCode] = useState('');
  const senden = (e: FormEvent) => {
    e.preventDefault();
    if (code.trim()) absenden(code);
  };
  return (
    <section className="rahmen flex min-h-[80dvh] items-center pt-32 pb-24">
      <div className="mx-auto w-full max-w-md text-center">
        <p className="ueberzeile">{g.ueberzeile}</p>
        <h1 className="mt-5 text-5xl sm:text-6xl">{g.eingabeTitel}</h1>
        <p className="mt-6 text-grau">{g.eingabeText}</p>
        <form onSubmit={senden} className="mt-10 space-y-4 text-left">
          <label className="block">
            <span className="text-sm text-grau">{g.code}</span>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              placeholder="ABCD-EFGH"
              className="mt-1 w-full rounded-xl border border-linie bg-white/70 px-4 py-3.5 text-center font-mono text-xl tracking-[0.2em] uppercase outline-none focus:border-salbei-dunkel"
            />
          </label>
          {fehler && (
            <p role="alert" className="rounded-xl bg-rose/20 px-4 py-3 text-sm">
              {g[fehler]}{' '}
              {fehler === 'abgelaufen' && (
                <Link to={pfad('anfrage')} className="underline underline-offset-2">
                  {t.nav.anfrage}
                </Link>
              )}
            </p>
          )}
          <button type="submit" className="knopf w-full" disabled={laeuft}>
            {laeuft ? g.pruefe : g.oeffnen}
          </button>
        </form>
      </div>
    </section>
  );
}

function GalerieAnsicht({ daten, abmelden }: { daten: GalerieDaten; abmelden: () => void }) {
  const { t, sprache } = useSprache();
  const g = t.galerie;
  const [offen, setOffen] = useState<number | null>(null);
  const datum = (d: string | null) => (d ? new Date(`${d}T12:00:00`).toLocaleDateString(sprache === 'de' ? 'de-AT' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '');

  return (
    <>
      <header className="rahmen pt-32 pb-12 text-center sm:pt-40">
        <p className="ueberzeile">{g.ueberzeile}</p>
        <h1 className="mt-5 text-5xl sm:text-7xl">{daten.paar}</h1>
        {daten.datum && <p className="mt-4 font-serif text-2xl text-grau italic">{datum(daten.datum)}</p>}
        {daten.hinweis && <p className="mx-auto mt-8 max-w-xl whitespace-pre-line text-lg">{daten.hinweis}</p>}
        <p className="mt-8 text-sm text-grau">
          {g.fotos(daten.fotos.length)} · {groesse(daten.zip?.groesse ?? daten.gesamt, sprache)}
          {daten.ablauf && ` · ${g.onlineBis} ${datum(daten.ablauf)}`}
        </p>
        {daten.fotos.length > 0 && <AlleLaden daten={daten} />}
      </header>

      {daten.fotos.length === 0 ? (
        <p className="rahmen pb-32 text-center text-grau">{g.leer}</p>
      ) : (
        <section className="mx-auto max-w-[1600px] columns-2 gap-2 px-2 pb-24 sm:columns-3 sm:gap-3 sm:px-4 lg:columns-4" aria-label={g.ueberzeile}>
          {daten.fotos.map((f, i) => (
            <button
              key={f.name}
              type="button"
              onClick={() => setOffen(i)}
              className="group relative mb-2 block w-full overflow-hidden rounded-md bg-sand sm:mb-3"
              aria-label={`${i + 1} / ${daten.fotos.length}`}
            >
              <img
                src={fotoUrl(daten, 'web', f.name)}
                alt=""
                loading="lazy"
                decoding="async"
                className="min-h-24 w-full transition duration-700 group-hover:scale-[1.02]"
              />
            </button>
          ))}
        </section>
      )}

      <p className="pb-16 text-center">
        <button type="button" onClick={abmelden} className="text-sm text-grau underline underline-offset-4 hover:text-tinte">
          {g.abmelden}
        </button>
      </p>

      {offen !== null && <Grossansicht daten={daten} index={offen} setIndex={setOffen} />}
    </>
  );
}

function groesse(bytes: number, sprache: 'de' | 'en'): string {
  const zahl = (n: number, stellen: number) => n.toLocaleString(sprache === 'de' ? 'de-AT' : 'en-GB', { maximumFractionDigits: stellen });
  if (bytes >= 1e9) return `${zahl(bytes / 1e9, 1)} GB`;
  return `${zahl(Math.max(bytes / 1e6, 0.1), bytes >= 1e7 ? 0 : 1)} MB`;
}

// Chrome/Edge am Computer können direkt auf die Festplatte schreiben. Damit lässt
// sich die ZIP-Datei im Browser bauen, ohne alles im Speicher zu halten.
type SpeicherDialog = (o: { suggestedName: string; types: { description: string; accept: Record<string, string[]> }[] }) => Promise<{
  createWritable: () => Promise<WritableStream<Uint8Array>>;
}>;

function AlleLaden({ daten }: { daten: GalerieDaten }) {
  const { t, sprache } = useSprache();
  const g = t.galerie;
  const [stand, setStand] = useState<{ art: 'laeuft'; anteil: number } | { art: 'fertig' | 'abbruch' | 'browser' } | null>(null);
  const dateiname = `Anna-Ratz-${daten.slug}.zip`;

  // Fertige ZIP-Datei von Anna: einfacher Link, funktioniert überall
  if (daten.zip) {
    return (
      <div className="mt-8">
        <a href={`${API}/${encodeURIComponent(daten.slug)}/zip?t=${encodeURIComponent(daten.token)}`} download={dateiname} className="knopf">
          {g.alleLaden} · {groesse(daten.zip.groesse, sprache)}
        </a>
        <p className="mx-auto mt-3 max-w-md text-xs text-grau">{g.zipHinweis}</p>
      </div>
    );
  }

  const starten = async () => {
    const dialog = (window as unknown as { showSaveFilePicker?: SpeicherDialog }).showSaveFilePicker;
    if (!dialog) return setStand({ art: 'browser' });
    let ziel: WritableStream<Uint8Array>;
    try {
      const datei = await dialog({ suggestedName: dateiname, types: [{ description: 'ZIP', accept: { 'application/zip': ['.zip'] } }] });
      ziel = await datei.createWritable();
    } catch {
      return; // Dialog abgebrochen
    }
    setStand({ art: 'laeuft', anteil: 0 });
    async function* dateien() {
      for (const f of daten.fotos) {
        const r = await fetch(fotoUrl(daten, 'original', f.name));
        if (!r.ok) throw new Error(f.name);
        yield { name: f.name, input: r, size: f.groesse };
      }
    }
    let geschrieben = 0;
    const zaehler = new TransformStream<Uint8Array, Uint8Array>({
      transform(stueck, weiter) {
        geschrieben += stueck.byteLength;
        setStand({ art: 'laeuft', anteil: Math.min(1, geschrieben / Math.max(1, daten.gesamt)) });
        weiter.enqueue(stueck);
      },
    });
    try {
      await downloadZip(dateien()).body!.pipeThrough(zaehler).pipeTo(ziel);
      setStand({ art: 'fertig' });
    } catch {
      setStand({ art: 'abbruch' });
    }
  };

  return (
    <div className="mt-8">
      <button type="button" onClick={starten} disabled={stand?.art === 'laeuft'} className="knopf">
        {stand?.art === 'laeuft' ? `${g.zipLaeuft} ${Math.round(stand.anteil * 100)} %` : `${g.alleLaden} · ${groesse(daten.gesamt, sprache)}`}
      </button>
      {stand?.art === 'laeuft' && (
        <div className="mx-auto mt-4 h-1 max-w-xs overflow-hidden rounded-full bg-linie" role="progressbar" aria-valuenow={Math.round(stand.anteil * 100)}>
          <div className="h-full bg-salbei-dunkel transition-[width]" style={{ width: `${stand.anteil * 100}%` }} />
        </div>
      )}
      <p className="mx-auto mt-3 max-w-md text-xs text-grau" role="status">
        {stand?.art === 'fertig' ? g.zipFertig : stand?.art === 'abbruch' ? g.zipAbbruch : stand?.art === 'browser' ? g.zipBrowser : g.zipHinweis}
      </p>
    </div>
  );
}

function Grossansicht({ daten, index, setIndex }: { daten: GalerieDaten; index: number; setIndex: (i: number | null) => void }) {
  const { t } = useSprache();
  const g = t.galerie;
  const n = daten.fotos.length;
  const foto = daten.fotos[index];
  const gehe = useCallback((schritt: number) => setIndex((index + schritt + n) % n), [index, n, setIndex]);
  const wisch = useRef<number | null>(null);
  const schliessenRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const taste = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIndex(null);
      if (e.key === 'ArrowRight') gehe(1);
      if (e.key === 'ArrowLeft') gehe(-1);
    };
    window.addEventListener('keydown', taste);
    const vorher = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', taste);
      document.body.style.overflow = vorher;
    };
  }, [gehe, setIndex]);

  useEffect(() => schliessenRef.current?.focus(), []);

  // nächstes Foto vorladen
  useEffect(() => {
    const vor = new Image();
    vor.src = fotoUrl(daten, 'web', daten.fotos[(index + 1) % n].name);
  }, [daten, index, n]);

  const knopf = 'grid size-11 place-items-center rounded-full bg-white/10 text-2xl text-creme transition hover:bg-white/20';
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${index + 1} / ${n}`}
      className="fixed inset-0 z-50 flex flex-col bg-tinte"
      onTouchStart={(e) => (wisch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (wisch.current === null) return;
        const dx = e.changedTouches[0].clientX - wisch.current;
        if (Math.abs(dx) > 50) gehe(dx < 0 ? 1 : -1);
        wisch.current = null;
      }}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 text-sm text-creme/80">
        <span className="tabular-nums">
          {index + 1} / {n}
        </span>
        <div className="flex items-center gap-3">
          <a href={fotoUrl(daten, 'original', foto.name, true)} download={foto.name} className="rounded-full border border-creme/30 px-4 py-2 text-creme transition hover:bg-creme hover:text-tinte">
            {g.einzeln}
          </a>
          <button ref={schliessenRef} type="button" onClick={() => setIndex(null)} className={knopf} aria-label={g.schliessen}>
            ×
          </button>
        </div>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-4 sm:px-16">
        <img key={foto.name} src={fotoUrl(daten, 'web', foto.name)} alt="" className="max-h-full max-w-full object-contain" />
        {n > 1 && (
          <>
            <button type="button" onClick={() => gehe(-1)} className={`${knopf} absolute top-1/2 left-3 hidden -translate-y-1/2 sm:grid`} aria-label={g.zurueck}>
              ‹
            </button>
            <button type="button" onClick={() => gehe(1)} className={`${knopf} absolute top-1/2 right-3 hidden -translate-y-1/2 sm:grid`} aria-label={g.weiter}>
              ›
            </button>
          </>
        )}
      </div>
    </div>
  );
}
