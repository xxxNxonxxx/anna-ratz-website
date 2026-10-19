import { Link } from 'react-router-dom';
import { AnfrageBand, Einblenden } from '../components/Bausteine.tsx';
import { Foto } from '../components/Foto.tsx';
import BlurText from '../components/reactbits/BlurText.tsx';
import CircularCarousel from '../components/reactbits/CircularCarousel.tsx';
import GradualBlur from '../components/reactbits/GradualBlur.tsx';
import ScrollReveal from '../components/reactbits/ScrollReveal.tsx';
import { euro } from '../data/preise.ts';
import { useSprache } from '../i18n/sprache.ts';

export function Start() {
  const { t, i, l, sprache, pfad } = useSprache();
  const s = i.startseite;
  const ab = (preise: number[]) => (preise.length ? `${t.allgemein.ab} ${euro(Math.min(...preise), sprache)}` : '');
  const karussell = s.karussell.map((f) => ({ src: f.url(800), alt: l(f.alt), title: l(f.alt) }));

  return (
    <>
      {/* Hero */}
      <section className="relative h-[100svh] min-h-[600px] overflow-hidden">
        <Foto foto={s.heroBild} sofort sizes="100vw" className="absolute inset-0 h-full w-full animate-langsam-zoom object-[50%_60%]" />
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-creme to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-creme/60 via-creme/10 via-45% to-transparent" />
        <div className="relative rahmen flex h-full flex-col justify-end pb-20 sm:pb-28">
          <p className="ueberzeile">{l(s.ueberzeile)}</p>
          {/* BlurText rendert ein <p> mit Einzelbuchstaben; die Überschrift für Google und Screenreader steht hier. */}
          <h1 className="sr-only">Anna Ratz – {l(s.ueberzeile)}</h1>
          <div aria-hidden>
            <BlurText
              text="Anna Ratz"
              animateBy="letters"
              direction="bottom"
              delay={35}
              stepDuration={0.25}
              trigger="load"
              className="mt-4 font-serif text-7xl leading-none sm:text-8xl lg:text-[10rem]"
            />
          </div>
          <p className="mt-5 font-serif text-2xl text-grau italic sm:text-3xl">{l(s.claim)}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to={pfad('anfrage')} className="knopf">
              {t.allgemein.anfragen}
            </Link>
            <Link to={pfad('portfolio')} className="knopf-hell">
              {t.allgemein.portfolio}
            </Link>
          </div>
        </div>
        <GradualBlur position="bottom" height="5rem" strength={1.5} layers={5} curve="bezier" />
      </section>

      {/* Haltung */}
      {l(s.intro) && (
        <section className="rahmen py-24 sm:py-36">
          <ScrollReveal
            key={sprache}
            baseOpacity={0.12}
            enableBlur
            blurStrength={6}
            baseRotation={0}
            containerClassName="mx-auto max-w-4xl"
            textClassName="text-center font-serif text-3xl leading-snug sm:text-5xl sm:leading-[1.15]"
          >
            {l(s.intro)}
          </ScrollReveal>
        </section>
      )}

      {/* Circular Carousel */}
      {karussell.length > 0 && (
        <section className="overflow-hidden bg-sand/60 py-20 sm:py-28">
          <div className="rahmen text-center">
            <p className="ueberzeile">Portfolio</p>
            <h2 className="mt-4 text-5xl sm:text-6xl">{l(s.karussellTitel)}</h2>
            <p className="mt-3 text-sm text-grau">{l(s.karussellText)}</p>
          </div>
          {/* Das Karussell skaliert sich auf die Breite seines Containers. Am Handy ist er
              daher breiter als der Bildschirm, damit die Karten groß bleiben; die Ränder
              schneidet die Sektion ab. */}
          <div className="relative left-1/2 mt-6 h-[460px] w-[230vw] -translate-x-1/2 sm:h-[620px] md:w-full">
            <CircularCarousel
              key={`${sprache}-${karussell.length}`}
              items={karussell}
              preset="cylinder"
              intro="rise"
              cardWidth={250}
              aspectRatio={0.72}
              gap={28}
              autoplay="drift"
              speed={9}
              fadeColor="#efe6d8"
              depthFade={0.65}
              innerShade={0.75}
              cornerRadius={14}
              captions
            />
          </div>
          <div className="mt-4 text-center">
            <Link to={pfad('portfolio')} className="knopf-hell">
              {t.allgemein.portfolio}
            </Link>
          </div>
        </section>
      )}

      {/* Angebote */}
      <section className="rahmen py-24 sm:py-32">
        <h2 className="text-center text-5xl sm:text-6xl">{l(s.angeboteTitel)}</h2>
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {[
            { seite: 'hochzeit' as const, foto: s.hochzeitBild, titel: s.hochzeitTitel, text: s.hochzeitText, preis: ab(i.hochzeit.pakete.map((p) => p.preis)) },
            { seite: 'shootings' as const, foto: s.shootingsBild, titel: s.shootingsTitel, text: s.shootingsText, preis: ab(i.shootings.arten.map((a) => a.preis)) },
          ].map((a, n) => (
            <Einblenden key={a.seite} verzoegerung={n * 0.15}>
              <Link to={pfad(a.seite)} className="group block">
                <div className="overflow-hidden rounded-2xl">
                  <Foto foto={a.foto} sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/5] w-full transition duration-[1.2s] ease-out group-hover:scale-105" />
                </div>
                <div className="mt-6 flex items-baseline justify-between gap-4">
                  <h3 className="text-4xl">{l(a.titel)}</h3>
                  <span className="text-sm whitespace-nowrap text-grau">{a.preis}</span>
                </div>
                <p className="mt-2 max-w-md text-grau">{l(a.text)}</p>
                <span className="mt-4 inline-block border-b border-tinte/30 pb-0.5 text-sm transition group-hover:border-tinte">{t.allgemein.mehr} →</span>
              </Link>
            </Einblenden>
          ))}
        </div>
      </section>

      {/* Über mich */}
      <section className="bg-sand/60">
        <div className="rahmen grid items-center gap-12 py-24 md:grid-cols-2 sm:py-32">
          <Einblenden>
            <div className="mx-auto max-w-sm overflow-hidden rounded-t-[999px] rounded-b-2xl">
              <Foto foto={s.ueberBild} sizes="(min-width: 768px) 30vw, 90vw" className="aspect-[3/4] w-full" />
            </div>
          </Einblenden>
          <Einblenden verzoegerung={0.15}>
            <p className="ueberzeile">{t.nav.ueber}</p>
            <h2 className="mt-4 text-5xl sm:text-6xl">{l(s.ueberTitel)}</h2>
            <p className="mt-6 max-w-md text-lg text-grau">{l(s.ueberText)}</p>
            <Link to={pfad('ueber')} className="knopf-hell mt-8">
              {t.allgemein.mehr}
            </Link>
          </Einblenden>
        </div>
      </section>

      {/* Ablauf */}
      {s.ablauf.length > 0 && (
        <section className="rahmen py-24 sm:py-32">
          <h2 className="text-center text-5xl sm:text-6xl">{l(s.ablaufTitel)}</h2>
          <ol className="mt-16 grid gap-12 md:grid-cols-3">
            {s.ablauf.map((schritt, n) => (
              <Einblenden key={n} verzoegerung={n * 0.12}>
                <li className="border-t border-linie pt-6">
                  <span className="font-serif text-6xl text-salbei italic">{String(n + 1).padStart(2, '0')}</span>
                  <h3 className="mt-3 text-3xl">{l(schritt.titel)}</h3>
                  <p className="mt-3 text-grau">{l(schritt.text)}</p>
                </li>
              </Einblenden>
            ))}
          </ol>
        </section>
      )}

      {/* Stimmen */}
      {s.stimmen.length > 0 && (
        <section className="bg-salbei-dunkel text-creme">
          <div className="rahmen py-24 sm:py-32">
            <h2 className="text-center text-5xl sm:text-6xl">{l(s.stimmenTitel)}</h2>
            <div className="mt-16 grid gap-12 md:grid-cols-3">
              {s.stimmen.map((st, n) => (
                <Einblenden key={n} verzoegerung={n * 0.12}>
                  <figure>
                    <span className="font-serif text-7xl leading-none text-creme/40" aria-hidden>
                      “
                    </span>
                    <blockquote className="-mt-6 font-serif text-2xl leading-snug italic">{l(st.text)}</blockquote>
                    <figcaption className="mt-5 text-sm text-creme/70">
                      {[st.name, l(st.ort)].filter(Boolean).join(' · ')}
                    </figcaption>
                  </figure>
                </Einblenden>
              ))}
            </div>
            {l(s.stimmenHinweis) && <p className="mt-14 text-center text-xs text-creme/50">{l(s.stimmenHinweis)}</p>}
          </div>
        </section>
      )}

      {/* Region */}
      <section className="rahmen grid items-center gap-12 py-24 md:grid-cols-[1fr_1.2fr] sm:py-32">
        <Einblenden>
          <h2 className="text-5xl sm:text-6xl">{l(s.regionTitel)}</h2>
          <p className="mt-6 max-w-md text-lg text-grau">{l(s.regionText)}</p>
        </Einblenden>
        <Einblenden verzoegerung={0.15}>
          <div className="overflow-hidden rounded-2xl">
            <Foto foto={s.regionBild} sizes="(min-width: 768px) 55vw, 100vw" className="aspect-[3/2] w-full" />
          </div>
        </Einblenden>
      </section>

      <AnfrageBand />
    </>
  );
}
