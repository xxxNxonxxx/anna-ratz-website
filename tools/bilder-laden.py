"""Lädt die ausgewählten Unsplash-Fotos (tools/auswahl.json) als WebP in zwei
Größen nach public/bilder/ und schreibt die Quellen nach src/data/quellen.json.

  python3 tools/bilder-laden.py <unsplash-suchergebnisse.json>

Die Suchergebnisse stammen aus der Unsplash-Suche (nur Lizenz „free“, kein Unsplash+).
"""
import json, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
auswahl = json.loads((ROOT / 'tools/auswahl.json').read_text())
daten = json.loads(Path(sys.argv[1]).read_text())
if isinstance(daten, str):
    daten = json.loads(daten)
index = {p['id']: p for ps in daten.values() for p in ps}

quellen = []
for kat, ids in auswahl.items():
    ziel = ROOT / 'public/bilder' / kat
    ziel.mkdir(parents=True, exist_ok=True)
    for pid in ids:
        p = index[pid]
        for breite in (800, 1800):
            datei = ziel / f'{pid}-{breite}.webp'
            if not datei.exists():
                subprocess.run(['curl', '-sf', '-o', str(datei), f"{p['raw']}?w={breite}&q=72&fm=webp"], check=True)
        quellen.append({
            'id': pid, 'kategorie': kat, 'breite': p['w'], 'hoehe': p['h'],
            'fotograf': p['user'], 'profil': f"https://unsplash.com/@{p['un']}",
            'quelle': f"https://unsplash.com/photos/{p['slug']}",
        })
        print(kat, pid)

(ROOT / 'src/data').mkdir(parents=True, exist_ok=True)
(ROOT / 'src/data/quellen.json').write_text(json.dumps(quellen, ensure_ascii=False, indent=1))
