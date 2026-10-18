import { Link } from 'react-router-dom';
import { AnfrageBand, Einblenden, Fragen, Seitenkopf } from '../components/Bausteine.tsx';
import { Foto } from '../components/Foto.tsx';
import { euro } from '../data/preise.ts';
import { useSprache } from '../i18n/sprache.ts';

export function Shootings() {
  const { t, i, l, sprache, pfad } = useSprache();
  const s = i.shootings;

  return (
    <>
      <Seitenkopf ueberzeile={s.ueberzeile} titel={s.titel} intro={s.intro} foto={s.kopfbild} />

      <div className="rahmen space-y-28 py-16 sm:space-y-40 sm:py-24">
        {s.arten.map((art, n) => {
          const gespiegelt = n % 2 === 1;
          return (
            <section key={n} className="grid items-center gap-12 md:grid-cols-2 md:gap-20" data-art={n}>
              <Einblenden className={gespiegelt ? 'md:order-2' : ''}>
                <div className="relative pr-10 pb-16 sm:pr-16">
                  <div className="overflow-hidden rounded-2xl">
                    <Foto foto={art.bildGross} sizes="(min-width: 768px) 45vw, 90vw" className="aspect-[4/5] w-full" />
                  </div>
                  {art.bildKlein && (
                    <div className="absolute right-0 bottom-0 w-[42%] overflow-hidden rounded-xl border-[6px] border-creme shadow-xl">
                      <Foto foto={art.bildKlein} sizes="20vw" className="aspect-square w-full" />
                    </div>
                  )}
                </div>
              </Einblenden>
              <Einblenden verzoegerung={0.15}>
                <p className="ueberzeile">{String(n + 1).padStart(2, '0')}</p>
                <h2 className="mt-3 text-5xl sm:text-6xl">{l(art.name)}</h2>
                <p className="mt-6 max-w-md text-lg text-grau">{l(art.text)}</p>
                <div className="mt-8 flex items-baseline gap-4 border-t border-linie pt-6">
                  <span className="font-serif text-4xl">
                    <span className="text-xl text-grau">{t.allgemein.ab} </span>
                    {euro(art.preis, sprache)}
                  </span>
                  <span className="text-sm text-grau">{l(art.dauer)}</span>
                </div>
                <Link to={pfad('anfrage')} state={{ art: l(art.name) }} className="knopf mt-8">
                  {t.allgemein.anfragen}
                </Link>
              </Einblenden>
            </section>
          );
        })}
        {l(s.gutschein) && <p className="text-center font-serif text-3xl italic">{l(s.gutschein)}</p>}
      </div>

      <Fragen titel={s.faqTitel} eintraege={s.faq} />
      <AnfrageBand />
    </>
  );
}
