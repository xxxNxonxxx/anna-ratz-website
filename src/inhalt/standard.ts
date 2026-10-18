// Startinhalt der Seite. Er wird angezeigt, solange kein Sanity-Projekt
// verbunden ist, und beim ersten Import nach Sanity hochgeladen. Danach pflegt
// Anna alles im Studio; Änderungen hier wirken dann nicht mehr.
//
// PLATZHALTER: Fotos (Unsplash), Preise, Kontaktdaten, Kundenstimmen,
// „Über mich“-Text, Impressum und Datenschutz.

import { bilder } from '../data/bilder.ts';
import type { Foto, Inhalt, L } from './typen.ts';

const l = (de: string, en: string): L => ({ de, en });

const nachId = new Map(bilder.map((b) => [b.id, b]));

/** Lokales Platzhalterfoto aus public/bilder. */
export function lokalesFoto(id: string): Foto {
  const b = nachId.get(id);
  if (!b) throw new Error(`Unbekanntes Bild: ${id}`);
  return {
    url: (breite) => `${import.meta.env.BASE_URL}bilder/${b.kategorie}/${b.id}-${breite > 800 ? 1800 : 800}.webp`,
    breite: b.breite,
    hoehe: b.hoehe,
    alt: b.alt,
    credit: { name: b.fotograf, link: b.profil, quelle: b.quelle },
  };
}

const f = lokalesFoto;

export const STANDARD: Inhalt = {
  einstellungen: {
    mail: 'hallo@annaratz.at',
    telefon: '+43 660 000 00 00',
    instagram: 'annaratz.fotografie',
    seitentitel: l(
      'Anna Ratz Fotografie · Hochzeiten & Private Shootings in Wien und Niederösterreich',
      'Anna Ratz Photography · Weddings & Portrait Sessions in Vienna and Lower Austria',
    ),
    beschreibung: l(
      'Hochzeitsfotografin und Fotografin für Paar-, Familien-, Babybauch- und Portraitshootings in Wien und Niederösterreich. Natürliche, warme Bilder.',
      'Wedding photographer and portrait photographer for couples, families, maternity and portraits in Vienna and Lower Austria. Natural, warm photos.',
    ),
  },

  startseite: {
    heroBild: f('IfjHaIoAoqE'),
    ueberzeile: l('Hochzeits- & Familienfotografin · Wien & Niederösterreich', 'Wedding & family photographer · Vienna & Lower Austria'),
    claim: l('Echte Momente, leise erzählt.', 'Real moments, quietly told.'),
    intro: l(
      'Ich fotografiere, wie sich ein Tag angefühlt hat – nicht nur, wie er ausgesehen hat. Ohne steife Posen, mit viel Zeit und einem Auge für die kleinen Dinge dazwischen.',
      'I photograph how a day felt – not just how it looked. No stiff poses, plenty of time and an eye for the small things in between.',
    ),
    karussellTitel: l('Ausgewählte Momente', 'Selected moments'),
    karussellText: l('Zieh das Karussell zur Seite oder klick auf ein Bild.', 'Drag the carousel or click a photo.'),
    karussell: [
      'qQ01rvKkE0w', 'BcVvVvqiCGA', '6c4Uhhe68yQ', 'jbaF5N0uO0k', 'adP0SsdMtMA', 'E_kCh2Ugy3M',
      'mLIurLmSRAY', 'zNHOIzjJiyA', 'Z39a7lqZusU', '30UOqDM5QW0', 'wqcQ6ODwPxU', 'AbnCRgL2DNs',
    ].map(f),
    angeboteTitel: l('Was ich fotografiere', 'What I photograph'),
    hochzeitTitel: l('Hochzeit', 'Weddings'),
    hochzeitText: l(
      'Vom Standesamt bis zum letzten Tanz – eine ruhige Begleitung für euren ganzen Tag.',
      'From the registry office to the last dance – calm, unobtrusive coverage of your whole day.',
    ),
    hochzeitBild: f('AbnCRgL2DNs'),
    shootingsTitel: l('Private Shootings', 'Portrait sessions'),
    shootingsText: l(
      'Paar, Familie, Babybauch oder Portrait – entspannt draußen oder bei euch zu Hause.',
      'Couples, families, maternity or portraits – relaxed, outdoors or in your home.',
    ),
    shootingsBild: f('6c4Uhhe68yQ'),
    ueberTitel: l('Hallo, ich bin Anna.', 'Hi, I’m Anna.'),
    ueberText: l(
      'Fotografin aus Wien, Kaffee-Liebhaberin und überzeugt davon, dass die schönsten Bilder entstehen, wenn man vergisst, dass eine Kamera da ist.',
      'A Vienna-based photographer, coffee lover and firm believer that the best pictures happen once you forget there is a camera.',
    ),
    ueberBild: f('0fKMSXKi7sM'),
    ablaufTitel: l('So arbeiten wir zusammen', 'How we work together'),
    ablauf: [
      {
        titel: l('Kennenlernen', 'Getting to know you'),
        text: l(
          'Wir trinken einen Kaffee – in Wien oder per Video – und reden über eure Wünsche.',
          'We meet for coffee – in Vienna or on a video call – and talk about what you have in mind.',
        ),
      },
      {
        titel: l('Shooting', 'The shoot'),
        text: l(
          'Ich begleite euch unaufdringlich und gebe Anleitung nur dort, wo ihr sie braucht.',
          'I stay in the background and only give direction where you need it.',
        ),
      },
      {
        titel: l('Eure Galerie', 'Your gallery'),
        text: l(
          'Nach zwei bis vier Wochen bekommt ihr alle Bilder bearbeitet in einer Online-Galerie.',
          'Two to four weeks later you receive every edited photo in an online gallery.',
        ),
      },
    ],
    stimmenTitel: l('Liebe Worte', 'Kind words'),
    stimmen: [
      {
        text: l(
          'Wir haben uns keine Sekunde beobachtet gefühlt – und trotzdem ist jeder Moment auf den Bildern.',
          'We never felt watched for a second – and yet every moment is in the photos.',
        ),
        name: 'Lena & Markus',
        ort: l('Hochzeit in der Wachau', 'Wedding in the Wachau valley'),
      },
      {
        text: l(
          'Unser Kleiner war nur zehn Tage alt. Anna hatte alle Geduld der Welt und die Bilder hängen jetzt bei uns im Wohnzimmer.',
          'Our little one was only ten days old. Anna had all the patience in the world, and the photos now hang in our living room.',
        ),
        name: 'Sophie',
        ort: l('Familienshooting in Wien', 'Family session in Vienna'),
      },
      {
        text: l('Ich hasse es, fotografiert zu werden. Diese Bilder liebe ich.', 'I hate having my picture taken. I love these photos.'),
        name: 'Julia',
        ort: l('Portrait im Prater', 'Portrait in the Prater'),
      },
    ],
    stimmenHinweis: l('Beispieltexte – werden durch echte Kundenstimmen ersetzt.', 'Sample texts – to be replaced with real client reviews.'),
    regionTitel: l('Zuhause in Wien & Niederösterreich', 'At home in Vienna & Lower Austria'),
    regionText: l(
      'Vom Stadtpark bis zum Heurigen, von der Wachau bis ins Weinviertel: In Wien und Niederösterreich ist die Anfahrt inklusive. Für Hochzeiten im restlichen Österreich und im Ausland erstelle ich gern ein Angebot.',
      'From the Stadtpark to a wine tavern, from the Wachau to the Weinviertel: travel within Vienna and Lower Austria is included. For weddings elsewhere in Austria or abroad I am happy to send a quote.',
    ),
    regionBild: f('5SjAaqqCCmY'),
    ctaTitel: l('Ist euer Datum noch frei?', 'Is your date still free?'),
    ctaText: l(
      'Schreibt mir ein paar Zeilen zu euch und eurem Plan – ich melde mich innerhalb von zwei Tagen.',
      'Send me a few lines about yourselves and your plans – I will reply within two days.',
    ),
    ctaBild: f('mvasDnG41is'),
  },

  hochzeit: {
    ueberzeile: l('Hochzeitsfotografie', 'Wedding photography'),
    titel: l('Euer Tag, so wie er war.', 'Your day, just as it was.'),
    intro: l(
      'Ich begleite euch vom Getting Ready bis auf die Tanzfläche – ruhig, aufmerksam und mit Blick für die Momente, die man sonst verpasst: die Hand der Oma, die Tränen des Trauzeugen, das Lachen beim Anstoßen.',
      'I accompany you from getting ready to the dance floor – calm, attentive and looking out for the moments you would otherwise miss: grandma’s hand, the best man’s tears, the laughter during the toast.',
    ),
    kopfbild: f('mLIurLmSRAY'),
    paketeTitel: l('Pakete', 'Packages'),
    pakete: [
      {
        name: l('Standesamt', 'Registry office'),
        dauer: l('2 Stunden', '2 hours'),
        preis: 690,
        punkte: [
          l('Trauung & Gratulationen', 'Ceremony & congratulations'),
          l('Kurzes Paarshooting', 'Short couple shoot'),
          l('Gruppenfotos', 'Group photos'),
          l('ca. 120 bearbeitete Bilder', 'approx. 120 edited photos'),
          l('Online-Galerie', 'Online gallery'),
        ],
      },
      {
        name: l('Halber Tag', 'Half day'),
        dauer: l('5 Stunden', '5 hours'),
        preis: 1690,
        beliebt: true,
        punkte: [
          l('Trauung bis Abendessen', 'Ceremony to dinner'),
          l('Paarshooting zur goldenen Stunde', 'Golden hour couple shoot'),
          l('Gruppen- & Familienfotos', 'Group & family photos'),
          l('ca. 350 bearbeitete Bilder', 'approx. 350 edited photos'),
          l('Online-Galerie', 'Online gallery'),
        ],
      },
      {
        name: l('Ganzer Tag', 'Full day'),
        dauer: l('10 Stunden', '10 hours'),
        preis: 2690,
        punkte: [
          l('Getting Ready bis Party', 'Getting ready to party'),
          l('Kennenlern-Shooting vorab', 'Engagement shoot beforehand'),
          l('Paar-, Gruppen- & Detailfotos', 'Couple, group & detail photos'),
          l('ca. 700 bearbeitete Bilder', 'approx. 700 edited photos'),
          l('Online-Galerie & USB-Stick', 'Online gallery & USB stick'),
        ],
      },
    ],
    extrasTitel: l('Extras', 'Extras'),
    extras: [
      { name: l('Jede weitere Stunde', 'Each additional hour'), preis: 190 },
      { name: l('Fotobuch (30 × 30 cm, Leinen)', 'Photo book (30 × 30 cm, linen)'), preis: 390, ab: true },
    ],
    anfahrt: l('Anfahrt in Wien und Niederösterreich inklusive.', 'Travel within Vienna and Lower Austria included.'),
    tagTitel: l('Wie ich euren Tag begleite', 'How I cover your day'),
    tag: [
      {
        zeit: l('Vormittag', 'Morning'),
        titel: l('Getting Ready', 'Getting ready'),
        text: l('Kleid, Anzug, Nervosität – die stillen Minuten davor.', 'The dress, the suit, the nerves – the quiet minutes before.'),
      },
      {
        zeit: l('Mittag', 'Midday'),
        titel: l('Trauung', 'Ceremony'),
        text: l('Standesamt, Kirche oder frei: Ich bin da, ohne zu stören.', 'Registry office, church or outdoors: I am there without getting in the way.'),
      },
      {
        zeit: l('Nachmittag', 'Afternoon'),
        titel: l('Paarshooting', 'Couple shoot'),
        text: l('Zwanzig Minuten nur für euch zwei, ganz ohne Posen-Stress.', 'Twenty minutes just for the two of you, no posing stress.'),
      },
      {
        zeit: l('Abend', 'Evening'),
        titel: l('Feier', 'Celebration'),
        text: l('Reden, Torte, erster Tanz – und die volle Tanzfläche danach.', 'Speeches, cake, first dance – and the packed dance floor after.'),
      },
    ],
    galerieTitel: l('Aus Hochzeiten', 'From weddings'),
    galerie: bilder.filter((b) => b.kategorie === 'hochzeit').map((b) => f(b.id)),
    faqTitel: l('Häufige Fragen', 'Frequently asked'),
    faq: [
      {
        frage: l('Wie früh sollten wir anfragen?', 'How early should we enquire?'),
        antwort: l(
          'Für Samstage im Mai bis September meist 12 bis 18 Monate vorher. Unter der Woche und im Winter oft auch kurzfristig.',
          'For Saturdays from May to September usually 12 to 18 months ahead. Weekdays and winter dates are often available at short notice.',
        ),
      },
      {
        frage: l('Wann bekommen wir unsere Bilder?', 'When will we get our photos?'),
        antwort: l(
          'Eine kleine Vorschau innerhalb einer Woche, die ganze Galerie nach vier bis sechs Wochen.',
          'A small sneak peek within a week, the full gallery after four to six weeks.',
        ),
      },
      {
        frage: l('Wie läuft die Buchung ab?', 'How does booking work?'),
        antwort: l(
          'Nach dem Kennenlernen bekommt ihr einen Vertrag. Mit einer Anzahlung von 30 % ist euer Datum fix reserviert.',
          'After we have met you receive a contract. A 30 % deposit secures your date.',
        ),
      },
      {
        frage: l('Fotografierst du auch außerhalb von Wien und Niederösterreich?', 'Do you travel beyond Vienna and Lower Austria?'),
        antwort: l(
          'Sehr gerne. Für ganz Österreich und das Ausland berechne ich die Anfahrt und, wenn nötig, eine Übernachtung.',
          'Happily. For the rest of Austria and abroad I charge travel and, if needed, accommodation.',
        ),
      },
    ],
  },

  shootings: {
    ueberzeile: l('Private Shootings', 'Portrait sessions'),
    titel: l('Für die Menschen, die euch wichtig sind.', 'For the people who matter to you.'),
    intro: l(
      'Ein Shooting mit mir fühlt sich eher an wie ein Spaziergang als wie ein Termin. Wir suchen gemeinsam einen Ort, der zu euch passt – einen Park, eine Wiese im Wienerwald oder euer Wohnzimmer.',
      'A session with me feels more like a walk than an appointment. Together we pick a place that suits you – a park, a meadow in the Vienna Woods or your own living room.',
    ),
    kopfbild: f('4_mJ1TbMK8A'),
    arten: [
      {
        name: l('Paarshooting', 'Couples'),
        preis: 290,
        dauer: l('1 Stunde · ca. 40 Bilder', '1 hour · approx. 40 photos'),
        text: l(
          'Für Verliebte, Verlobte und alle, die schon lange zusammen sind. Auch schön als Geschenk zum Jahrestag.',
          'For sweethearts, the newly engaged and couples who have been together for ages. A lovely anniversary gift, too.',
        ),
        bildGross: f('BcVvVvqiCGA'),
        bildKlein: f('zNHOIzjJiyA'),
      },
      {
        name: l('Familie & Baby', 'Family & baby'),
        preis: 340,
        dauer: l('1,5 Stunden · ca. 50 Bilder', '1.5 hours · approx. 50 photos'),
        text: l(
          'Kinder sind keine Models – und das ist gut so. Ich fotografiere, wie ihr wirklich seid, gern auch bei euch zu Hause.',
          'Children are not models – and that is a good thing. I photograph you as you really are, at home if you like.',
        ),
        bildGross: f('zW4i9Q6CdY0'),
        bildKlein: f('Z39a7lqZusU'),
      },
      {
        name: l('Babybauch', 'Maternity'),
        preis: 290,
        dauer: l('1 Stunde · ca. 40 Bilder', '1 hour · approx. 40 photos'),
        text: l(
          'Am schönsten zwischen der 30. und 36. Woche. Allein, zu zweit oder mit den großen Geschwistern.',
          'Best between weeks 30 and 36. On your own, as a couple or with big brothers and sisters.',
        ),
        bildGross: f('adP0SsdMtMA'),
        bildKlein: f('NIZeg731LxM'),
      },
      {
        name: l('Portrait', 'Portrait'),
        preis: 220,
        dauer: l('45 Minuten · ca. 25 Bilder', '45 minutes · approx. 25 photos'),
        text: l(
          'Für dich, für deine Website oder einfach, weil es Zeit ist für ein Bild, auf dem du dich selbst magst.',
          'For you, for your website, or simply because it is time for a photo of yourself you actually like.',
        ),
        bildGross: f('E_kCh2Ugy3M'),
        bildKlein: f('AgIXEYfmOio'),
      },
    ],
    gutschein: l('Alle Shootings gibt es auch als Gutschein.', 'Every session is also available as a gift voucher.'),
    faqTitel: l('Gut zu wissen', 'Good to know'),
    faq: [
      {
        frage: l('Was sollen wir anziehen?', 'What should we wear?'),
        antwort: l(
          'Was ihr gern tragt, in ruhigen, zueinander passenden Farben. Nach der Buchung bekommt ihr einen kleinen Styling-Guide.',
          'Whatever you feel good in, in calm colours that go together. After booking you receive a short styling guide.',
        ),
      },
      {
        frage: l('Was, wenn es regnet?', 'What if it rains?'),
        antwort: l('Dann verschieben wir kostenlos – oder machen Bilder bei euch zu Hause.', 'We reschedule free of charge – or take photos in your home.'),
      },
      {
        frage: l('Bekommen wir alle Bilder?', 'Do we get all the photos?'),
        antwort: l(
          'Ihr bekommt alle gelungenen Bilder fertig bearbeitet in hoher Auflösung zum Download.',
          'You receive every good shot, fully edited, in high resolution to download.',
        ),
      },
    ],
  },

  portfolio: {
    ueberzeile: l('Portfolio', 'Portfolio'),
    titel: l('Ausgewählte Arbeiten', 'Selected work'),
    bilder: bilder
      .filter((b) => ['hochzeit', 'paar', 'familie', 'babybauch', 'portrait'].includes(b.kategorie))
      .map((b) => ({ foto: f(b.id), kategorie: b.kategorie as Inhalt['portfolio']['bilder'][number]['kategorie'] })),
  },

  ueberMich: {
    ueberzeile: l('Über mich', 'About'),
    titel: l('Hallo, ich bin Anna.', 'Hi, I’m Anna.'),
    bild: f('0fKMSXKi7sM'),
    absaetze: [
      l(
        'Ich bin in Wien aufgewachsen und habe mit vierzehn die alte Kamera meines Opas geerbt. Seitdem fotografiere ich Menschen – zuerst meine Freundinnen, dann ihre Hochzeiten, inzwischen auch ihre Kinder.',
        'I grew up in Vienna and inherited my grandfather’s old camera when I was fourteen. I have been photographing people ever since – first my friends, then their weddings, and now their children.',
      ),
      l(
        'Mir ist wichtig, dass ihr euch vor meiner Kamera wohlfühlt. Ich gebe sanfte Anleitung, wo sie hilft, und halte mich zurück, wo das Leben von selbst passiert.',
        'What matters most to me is that you feel at ease in front of my camera. I give gentle direction where it helps and step back where life happens on its own.',
      ),
      l(
        'Wenn ich nicht fotografiere, findet man mich beim Heurigen, auf dem Naschmarkt oder mit einem Buch im Augarten.',
        'When I am not taking photos you will find me at a Heuriger, at the Naschmarkt or reading a book in the Augarten.',
      ),
    ],
    unterschrift: 'Anna',
    werteTitel: l('Was mir wichtig ist', 'What matters to me'),
    werte: [
      { titel: l('Natürlich', 'Natural'), text: l('Echte Gefühle statt einstudierter Posen.', 'Real feelings instead of rehearsed poses.') },
      {
        titel: l('Zeitlos', 'Timeless'),
        text: l('Warme, ehrliche Farben, die auch in zwanzig Jahren noch gefallen.', 'Warm, honest colours you will still love in twenty years.'),
      },
      {
        titel: l('Persönlich', 'Personal'),
        text: l(
          'Ich nehme nur wenige Hochzeiten im Jahr an – damit jede die volle Aufmerksamkeit bekommt.',
          'I only take on a few weddings a year, so each one gets my full attention.',
        ),
      },
    ],
    bilderleiste: ['DrqEIG9Fmxs', 'eHOZjZEx7u8', 'x40Q9jrEVT0', 'OcxlTBbb6SY'].map(f),
  },

  anfrage: {
    ueberzeile: l('Anfrage', 'Contact'),
    titel: l('Erzählt mir von euch.', 'Tell me about you.'),
    intro: l(
      'Ich melde mich innerhalb von zwei Werktagen mit Verfügbarkeit und allen Details.',
      'I will get back to you within two working days with my availability and all the details.',
    ),
    bild: f('464ps_nOflw'),
    arten: [
      l('Hochzeit', 'Wedding'),
      l('Paarshooting', 'Couples'),
      l('Familie & Baby', 'Family & baby'),
      l('Babybauch', 'Maternity'),
      l('Portrait', 'Portrait'),
      l('Gutschein', 'Gift voucher'),
      l('Etwas anderes', 'Something else'),
    ],
  },

  rechtliches: {
    impressum: l(
      'Platzhalter – wird vor dem Livegang ausgefüllt.\n\nAnna Ratz\n[Adresse]\n[E-Mail · Telefon]\n[Unternehmensgegenstand, Gewerbebehörde, Kammer]',
      'Placeholder – will be completed before launch.\n\nAnna Ratz\n[Address]\n[Email · Phone]\n[Business purpose, trade authority, chamber]',
    ),
    datenschutz: l('Platzhalter – wird vor dem Livegang ausgefüllt.', 'Placeholder – will be completed before launch.'),
  },
};
