// Platzhalterfotos von Unsplash (freie Lizenz) für den Startinhalt; Quellen in
// quellen.json. In Sanity ersetzt Anna sie durch eigene Fotos.

import quellen from './quellen.json';

export type Kategorie = 'hochzeit' | 'paar' | 'familie' | 'babybauch' | 'portrait' | 'fotografin' | 'wien';

export interface Bild {
  id: string;
  kategorie: Kategorie;
  breite: number;
  hoehe: number;
  fotograf: string;
  profil: string;
  quelle: string;
  alt: { de: string; en: string };
}

const ALT: Record<string, [string, string]> = {
  IfjHaIoAoqE: ['Brautpaar spaziert Hand in Hand über einen Hügel', 'Bride and groom walking hand in hand over a hill'],
  '30UOqDM5QW0': ['Braut mit Blumenstrauß im Arm des Bräutigams', 'Bride holding her bouquet next to the groom'],
  '464ps_nOflw': ['Brautpaar hält sich an den Händen, Schatten im Gras', 'Couple holding hands, shadows on the grass'],
  AbnCRgL2DNs: ['Brautpaar auf der Terrasse eines Schlosses', 'Bride and groom on a castle terrace'],
  FTW8ADj5igs: ['Kuss unter dem Schleier, schwarz-weiß', 'A kiss under the veil, black and white'],
  K8KiCHh4WU4: ['Geschmückter Pavillon für eine freie Trauung', 'Decorated pavilion for an outdoor ceremony'],
  'M2T1j-6Fn8w': ['Eheringe auf einem Rosenstrauß', 'Wedding rings resting on a bouquet of roses'],
  NSVJAAXOYHs: ['Hände des Brautpaars beim ersten Tanz', 'The couple’s hands during the first dance'],
  SiniLJkXhMc: ['Lachendes Brautpaar unter Palmen', 'Laughing bride and groom walking under palm trees'],
  ULHxWq8reao: ['Hochzeitsgäste stoßen an', 'Wedding guests raising their glasses'],
  VUMdDPNxTsg: ['Erster Tanz unter dem Kronleuchter, schwarz-weiß', 'First dance under the chandelier, black and white'],
  jbaF5N0uO0k: ['Brautpaar umarmt sich im Abendlicht', 'Bride and groom embracing in evening light'],
  llWjwo200fo: ['Hände mit Eheringen und Brautstrauß', 'Hands with wedding rings and bouquet'],
  mLIurLmSRAY: ['Brautpaar im Gegenlicht unter dem Schleier', 'Couple under the veil in warm backlight'],
  mvasDnG41is: ['Brautpaar küsst sich auf einem Steg am See', 'Couple kissing on a jetty by the lake'],
  qQ01rvKkE0w: ['Braut im Fensterlicht mit Blumenstrauß', 'Bride in window light holding her bouquet'],
  x40Q9jrEVT0: ['Brautstrauß in sanften Farben', 'Bridal bouquet in soft colours'],
  '--LyFIjXoFY': ['Tanzende Gäste im Festzelt', 'Guests dancing in the marquee'],
  OtNiDIbjIsI: ['Braut mit Schleier, schwarz-weiß', 'Bride with veil, black and white'],
  BcVvVvqiCGA: ['Paar tanzt zwischen Bäumen', 'Couple dancing among the trees'],
  zNHOIzjJiyA: ['Lachendes Paar, sie auf seinem Rücken', 'Laughing couple, piggyback ride'],
  OcxlTBbb6SY: ['Paar sitzt im goldenen Abendlicht', 'Couple sitting in golden hour light'],
  EvcUtLF12XQ: ['Paar auf einem Felsen am Bergsee', 'Couple on a rock by a mountain lake'],
  '2ey7dmVEQv4': ['Paar kuschelt am Morgen im Bett', 'Couple cuddling in bed in the morning'],
  F5hTTI4Hlv4: ['Kuss im Gegenlicht der Sonne', 'A kiss against the sun'],
  CCjgYjUudxE: ['Zwei Hände greifen ineinander, Baum im Hintergrund', 'Two hands reaching for each other, tree behind'],
  '6c4Uhhe68yQ': ['Eltern mit Kleinkind im Abendlicht auf der Wiese', 'Parents with toddler in a meadow at sunset'],
  '4_mJ1TbMK8A': ['Familie sitzt lachend im Blumenfeld', 'Family laughing in a field of flowers'],
  '5NLCaz2wJXE': ['Familie spaziert Hand in Hand über eine Wiese', 'Family walking hand in hand across a meadow'],
  zW4i9Q6CdY0: ['Vater wirft Kind in die Luft, Mutter lacht', 'Father lifting his child up, mother laughing'],
  eHOZjZEx7u8: ['Geschwister umarmen sich im Herbstlicht', 'Siblings hugging in autumn light'],
  Z39a7lqZusU: ['Eltern halten ihr neugeborenes Baby', 'Parents holding their newborn baby'],
  WvVyudMd1Es: ['Mutter und Vater mit Baby am Fenster', 'Mother and father with baby by the window'],
  Z4GKcFAGck4: ['Mutter drückt ihr Baby an sich', 'Mother holding her baby close'],
  '1vnB2l7j3bY': ['Babyfüße unter einer weißen Decke', 'Baby feet under a white blanket'],
  adP0SsdMtMA: ['Schwangere Frau im Feld bei Sonnenuntergang', 'Pregnant woman in a field at sunset'],
  ZNVGL_Pcf74: ['Silhouette einer Schwangeren vor hellem Hintergrund', 'Silhouette of a pregnant woman against a bright backdrop'],
  wqcQ6ODwPxU: ['Schwangere im gelben Kleid im Gras', 'Pregnant woman in a yellow dress in tall grass'],
  son4VHt4Ld0: ['Schwangere im grünen Kleid vor einer Holztür', 'Pregnant woman in a green dress by a wooden door'],
  'IE8KfewAp-w': ['Paar mit Ultraschallbild', 'Couple holding an ultrasound picture'],
  NIZeg731LxM: ['Hände formen ein Herz auf dem Babybauch', 'Hands forming a heart on the baby bump'],
  E_kCh2Ugy3M: ['Frau mit Hut und Blumen im Abendlicht', 'Woman with hat and flowers in evening light'],
  UscugSxMr8U: ['Portrait einer Frau in weißer Bluse', 'Portrait of a woman in a white blouse'],
  AgIXEYfmOio: ['Portrait einer Frau, schwarz-weiß', 'Portrait of a woman, black and white'],
  DrqEIG9Fmxs: ['Frau mit Wildblumen im Gegenlicht', 'Woman holding wildflowers in backlight'],
  cyOKLSgkgCE: ['Portrait eines älteren Mannes', 'Portrait of an older man'],
  '695WiBRrrrI': ['Portrait eines Mannes mit Brille', 'Portrait of a man with glasses'],
  '0fKMSXKi7sM': ['Fotografin mit Hut und Kamera im Feld', 'Photographer with hat and camera in a field'],
  '5SjAaqqCCmY': ['Stephansdom über den Dächern Wiens zur goldenen Stunde', 'St. Stephen’s Cathedral above Vienna’s rooftops at golden hour'],
  Th2MisvdKr0: ['Schloss Belvedere in Wien', 'Belvedere Palace in Vienna'],
};

export const bilder: Bild[] = quellen.map((q) => {
  const [de, en] = ALT[q.id] ?? ['', ''];
  return { ...q, kategorie: q.kategorie as Kategorie, alt: { de, en } };
});
