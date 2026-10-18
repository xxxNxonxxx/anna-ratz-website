import { AnfrageBand, Einblenden } from '../components/Bausteine.tsx';
import { Foto } from '../components/Foto.tsx';
import { useSprache } from '../i18n/sprache.ts';

export function UeberMich() {
  const { i, l } = useSprache();
  const u = i.ueberMich;

  return (
    <>
      <section className="rahmen grid items-start gap-12 pt-32 pb-24 sm:pt-40 md:grid-cols-[1fr_1.2fr] md:gap-20">
        <div className="md:sticky md:top-28">
          <div className="overflow-hidden rounded-t-[999px] rounded-b-2xl">
            <Foto foto={u.bild} sofort sizes="(min-width: 768px) 40vw, 100vw" className="aspect-[3/4] w-full animate-langsam-zoom" />
          </div>
        </div>
        <div className="md:pt-16">
          <p className="ueberzeile">{l(u.ueberzeile)}</p>
          <h1 className="mt-5 text-6xl sm:text-7xl">{l(u.titel)}</h1>
          <div className="mt-10 space-y-6 text-lg text-grau">
            {u.absaetze.map((a, n) => (
              <Einblenden key={n}>
                <p className="whitespace-pre-line">{l(a)}</p>
              </Einblenden>
            ))}
          </div>
          {u.unterschrift && <p className="mt-10 font-serif text-4xl italic">{u.unterschrift}</p>}
        </div>
      </section>

      {u.werte.length > 0 && (
        <section className="bg-sand/60">
          <div className="rahmen py-24 sm:py-32">
            <h2 className="text-center text-5xl sm:text-6xl">{l(u.werteTitel)}</h2>
            <div className="mt-16 grid gap-10 md:grid-cols-3">
              {u.werte.map((w, n) => (
                <Einblenden key={n} verzoegerung={n * 0.12}>
                  <div className="text-center">
                    <span className="font-serif text-6xl text-salbei italic">{String(n + 1).padStart(2, '0')}</span>
                    <h3 className="mt-3 text-3xl">{l(w.titel)}</h3>
                    <p className="mx-auto mt-3 max-w-xs text-grau">{l(w.text)}</p>
                  </div>
                </Einblenden>
              ))}
            </div>
          </div>
        </section>
      )}

      {u.bilderleiste.length > 0 && (
        <section className="rahmen grid grid-cols-2 gap-4 py-24 md:grid-cols-4">
          {u.bilderleiste.map((f, n) => (
            <Einblenden key={n} verzoegerung={n * 0.08}>
              <div className="overflow-hidden rounded-xl">
                <Foto foto={f} sizes="25vw" className="aspect-[3/4] w-full" />
              </div>
            </Einblenden>
          ))}
        </section>
      )}

      <AnfrageBand />
    </>
  );
}
