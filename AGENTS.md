# Website — Anna Ratz Fotografie

Website für die Fotografin **Anna Ratz**: Hochzeiten und private Shootings (Paar, Familie & Baby, Babybauch, Portrait) in **Wien und Niederösterreich**. Deutsch und Englisch. Gebaut mit React und Komponenten von [React Bits](https://reactbits.dev).

## Starten

```
npm install          # einmalig
npm run dev          # http://localhost:5174 (5173 belegt spil)
npm run dev:lan      # dasselbe, im WLAN erreichbar: http://<IP-des-Laptops>:5174 (ufw: Port 5174 freigeben)
npm run build        # Typecheck + Produktions-Build nach dist/
npm run bilder -- <unsplash-suche.json>   # Fotos aus tools/auswahl.json neu laden

cd studio && npm install           # einmalig: Sanity Studio (Annas Bearbeitungsseite)
cd studio && npm run dev           # Studio lokal: http://localhost:3333
cd studio && npm run import        # Startinhalt + Fotos nach Sanity (nur fehlende Seiten)
cd studio && npm run deploy        # Studio online: https://annaratz.sanity.studio
```

## Inhalte pflegen (Sanity)

- **Studio online:** https://annaratz.sanity.studio (Anmeldung mit Google)
- **Projekt:** „Anna Ratz Website“, ID `l06nfkh0`, Dataset `production` (öffentlich lesbar), Organisation „Anna“. Verwaltung: https://www.sanity.io/manage/project/l06nfkh0
- Angelegt und importiert am 17. Okt. 2026 (49 Platzhalterfotos + alle Texte).

Anna pflegt Texte (DE/EN), Preise, Fotos, Kundenstimmen, Kontakt, Impressum und Datenschutz im **Sanity Studio** (`studio/`). Die Website lädt alles beim Start aus Sanity (`src/inhalt/sanity.ts`), sobald `VITE_SANITY_PROJECT_ID` in `Website/.env` steht; ohne diese Variable zeigt sie den Startinhalt aus `src/inhalt/standard.ts`.

- Schema: `studio/schemas/` — Feldnamen müssen mit `src/inhalt/typen.ts` übereinstimmen.
- Feste Beschriftungen (Menü, Knöpfe, Formularfelder) bleiben im Code: `src/i18n/texte.ts`.
- Jede Seite ist genau ein Dokument mit fester ID (`startseite`, `hochzeit`, …); das Studio lässt keine neuen anlegen oder löschen.
- Fehlt Englisch, zeigt die englische Seite den deutschen Text. Ein gelöschtes Einzelbild fällt auf das Startbild zurück.
- Neue Website-Adressen (Domain, LAN, Tailscale) müssen als CORS-Origin ins Sanity-Projekt: `cd studio && npx sanity cors add <url> --no-credentials`. Eingetragen: localhost:5174, 192.168.1.121:5174, 100.102.156.36:5174.
- Die Website fragt die API ohne CDN ab (`useCdn: false`), damit Änderungen beim nächsten Neuladen sofort sichtbar sind; mit CDN hielt der Browser alte Antworten bis zu einer Minute.
- Nach Schema-Änderungen: `cd studio && npm run deploy`.

## Kundengalerien (gebaut 18. Okt. 2026)

Brautpaare und Familien sehen ihre Fotos unter `/galerie/<adresse>` (EN `/en/gallery/…`) und laden sie herunter, **ohne Konto**: Link mit `?code=…` oder Code auf `/galerie` eingeben (Link „Kundengalerie“ im Footer).

- **Wo was liegt:**
  - Galerie-Einträge (Name, Adresse, Code, Ordner, Datum, „Online bis“, Nachricht) im Sanity-Dataset **`kunden`** (privat, damit die Codes nicht öffentlich lesbar sind). Im Studio oben links auf „Kundengalerien“ umschalten (`/kunden`, die Seiten liegen jetzt unter `/website`). Code und „Online bis“ (90 Tage) werden beim Anlegen vorbelegt, der fertige Link steht zum Kopieren im Formular.
  - Fotos in **Cloudflare R2**, Bucket `anna-ratz-galerien`, pro Galerie ein Ordner: `web/` (verkleinert, ca. 2000 px, zum Anschauen), `original/` (volle Auflösung, gleiche Dateinamen) und optional `alle.zip`.
- **Server:** `worker/index.ts` (Cloudflare Worker, nur `/api/*`). Prüft den Code gegen Sanity, gibt ein signiertes Token (12 h, nie länger als „Online bis“) und liefert Fotos aus R2 mit Range-Support. Konfiguration in `wrangler.jsonc`, Typen mit `npx wrangler types worker/worker-configuration.d.ts` neu erzeugen.
- **„Alle herunterladen“:** Liegt `alle.zip` im Ordner, ist es ein normaler Download, der überall funktioniert. Sonst baut der Browser die ZIP selbst (client-zip). Das geht nur in Chrome/Edge am Computer, andere Browser bekommen einen Hinweis und laden einzeln. Empfehlung an Anna: bei großen Hochzeiten `alle.zip` mit hochladen.
- **Lokal testen:** `npm run dev` simuliert Worker und R2 (`.wrangler/state`), Geheimnisse in `.dev.vars` (`SANITY_TOKEN` = Lese-Token „Website Kundengalerie (lesen)“, `GALERIE_SECRET`). Demo-Fotos: `python3 tools/galerie-demo.py`. Demo-Galerien im Dataset `kunden`: `demo-lena-paul` (Code `LENA-2026`, mit ZIP), `demo-familie-huber` (`HUBER-2026`, ohne ZIP), `demo-abgelaufen` (`ALT-2025-X`). Vor dem Livegang im Studio löschen.
- **Kosten:** R2 hat keine Download-Gebühren, Speicher ca. 0,015 $/GB und Monat (10 GB gratis). Abgelaufene Galerien sind gesperrt, die Fotos bleiben aber in R2, bis Anna den Ordner löscht (oder eine Lifecycle-Regel im Bucket).

**Cloudflare (eingerichtet 19. Okt. 2026):** Konto von Gabriel (Account `ab363f53f82f541ae62c8bcb113c3d3e`), R2 aktiv, Bucket `anna-ratz-galerien` mit Standort EU (`"jurisdiction": "eu"` in `wrangler.jsonc`). Worker `anna-ratz` läuft unter **https://anna-ratz.anna-ratz-fotografie.workers.dev** (ganze Website + Galerien), Secrets `SANITY_TOKEN` und `GALERIE_SECRET` (eigener Wert, nicht der aus `.dev.vars`) sind gesetzt. Demo-Fotos liegen dort (`python3 tools/galerie-demo.py --remote`). Studio ist neu deployt, der Kopier-Link zeigt auf die workers.dev-Adresse (`studio/.env`).
Aktualisieren: `npm run build && npx wrangler deploy`. Test-Kopie ohne Worker: GitHub Pages (`git push`, Workflow `.github/workflows/pages.yml`).

**Noch offen:**
1. Domain kaufen, im Cloudflare-Dashboard mit dem Worker verbinden, als CORS-Origin in Sanity eintragen, `SANITY_STUDIO_WEBSITE_URL` in `studio/.env` umstellen und Studio neu deployen.
2. Für Anna: R2-API-Token (Objekt lesen/schreiben, nur dieser Bucket) anlegen und in **Cyberduck** als „Amazon S3“-Verbindung einrichten (Server `<account-id>.eu.r2.cloudflarestorage.com`). Damit zieht sie die Lightroom-Exporte per Drag & Drop in die Ordner.
3. Cloudflare als Auftragsverarbeiter in die Datenschutzerklärung.
4. Demo-Galerien löschen (Studio und R2-Ordner `demo-*`).

## Entscheidungen (17. Okt. 2026)

- Design-Richtung **A „hell & romantisch“**: Creme `#f7f1e8`, Tinte `#2b2622`, Salbei `#5e6b57`. Überschriften *Cormorant Garamond*, Text *Manrope*. Tokens in `src/index.css` (`@theme`).
- **Preise werden angezeigt.**
- **Zweisprachig:** Deutsch unter `/`, Englisch unter `/en/...` (eigene Pfade, z. B. `/hochzeit` ↔ `/en/wedding`).
- Kernstück der Startseite: **Circular Carousel** von React Bits (Gabriels Wunsch).

## Aufbau

- `src/pages/` — Start, Hochzeit, Shootings, Portfolio, Über mich, Anfrage, Recht (Impressum, Datenschutz, Bildnachweis, 404).
- `src/components/reactbits/` — Original-Quellen von React Bits (TS + Tailwind): CircularCarousel, BlurText, Masonry, FadeContent, ScrollReveal, GradualBlur. Nicht umbauen, nur über Props steuern; Updates per `https://reactbits.dev/r/<Name>-TS-TW.json`.
- `src/inhalt/` — Inhaltstypen, Startinhalt, Sanity-Anbindung. `src/i18n/` — feste Beschriftungen und Pfade pro Sprache.
- `src/data/bilder.ts` + `quellen.json` — Platzhalterfotos mit Alt-Texten und Urheber*innen.
- `public/bilder/<kategorie>/<id>-800|1800.webp` — Fotos in zwei Größen.

## Regeln

- **Bilder:** nur frei lizenzierte Stockfotos (Unsplash-Lizenz, kein Unsplash+). Quellen stehen automatisch auf `/bildnachweis`. Stockfotos sind **Platzhalter**: Vor dem Livegang durch Annas eigene Fotos ersetzen, weil fremde Fotos als eigenes Portfolio Kund*innen täuschen würden.
- Animationen sparsam und ruhig, die Fotos sind der Star. Keine WebGL-Hintergründe oder Cursor-Effekte. `prefers-reduced-motion` wird respektiert.
- Schriften lokal über fontsource, nicht von Google Fonts (DSGVO).

## Vor dem Livegang offen (Platzhalter)

- [ ] Eigene Fotos statt Stockfotos (auch das „Anna“-Foto auf Start und Über mich)
- [ ] Preise und Paketinhalte mit Anna abstimmen (im Studio)
- [ ] Kontakt: E-Mail `hallo@annaratz.at`, Telefon, Instagram-Name sind erfunden (Studio → Kontakt & Einstellungen)
- [ ] Kundenstimmen sind Beispieltexte (auf der Seite als solche markiert) → echte Stimmen
- [ ] „Über mich“-Geschichte ist ein Entwurf
- [ ] Impressum und Datenschutzerklärung ausfüllen (Studio → Impressum & Datenschutz)
- [ ] Anfrage-Formular hat kein Backend, es öffnet das Mailprogramm (`mailto:`). Für echten Versand einen Formular-Dienst anbinden.
- [ ] Domain (Hosting läuft auf Cloudflare Workers, siehe Kundengalerien); Bundle ist ~257 kB gzip (Code-Splitting möglich, die Galerie ist schon ausgelagert)
- [ ] Kundengalerien: offene Schritte oben (Cyberduck für Anna, Datenschutz, Demo-Galerien löschen)

Termine (z. B. Livegang, Fototermine) gehören nach `Leben/kalender.md`, nicht hierher.
