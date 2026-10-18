"""Legt zwei Demo-Kundengalerien im LOKALEN R2-Speicher an (.wrangler/state).

  python3 tools/galerie-demo.py

- demo-lena-paul:    alle Hochzeits-Platzhalterfotos + fertige alle.zip
- demo-familie-huber: 6 Fotos, ohne alle.zip (testet „Alle herunterladen“ im Browser)

Die passenden Galerie-Einträge (Codes) stehen im Sanity-Dataset „kunden“.
Braucht Pillow (pip install pillow) und das lokale wrangler (npm install).
"""

import shutil
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path

from PIL import Image

WEBSITE = Path(__file__).resolve().parent.parent
QUELLE = WEBSITE / "public" / "bilder" / "hochzeit"
BUCKET = "anna-ratz-galerien"


def hochladen(datei: Path, key: str) -> None:
    subprocess.run(
        ["npx", "wrangler", "r2", "object", "put", f"{BUCKET}/{key}", "--file", str(datei), "--local"],
        cwd=WEBSITE,
        check=True,
        stdout=subprocess.DEVNULL,
    )
    print("  ", key)


def galerie(ordner: str, bilder: list[Path], mit_zip: bool, tmp: Path) -> None:
    print(ordner)
    originale = []
    for i, bild in enumerate(bilder, 1):
        name = f"{ordner.removeprefix('demo-')}-{i:03d}.jpg"
        groß = Image.open(bild.with_name(bild.name.replace("-800", "-1800"))).convert("RGB")
        klein = Image.open(bild).convert("RGB")
        o, w = tmp / f"o-{name}", tmp / f"w-{name}"
        groß.save(o, "JPEG", quality=92)
        klein.save(w, "JPEG", quality=82)
        hochladen(o, f"{ordner}/original/{name}")
        hochladen(w, f"{ordner}/web/{name}")
        originale.append((o, name))
    if mit_zip:
        z = tmp / f"{ordner}.zip"
        with zipfile.ZipFile(z, "w", zipfile.ZIP_STORED) as zf:
            for o, name in originale:
                zf.write(o, name)
        hochladen(z, f"{ordner}/alle.zip")


def main() -> None:
    bilder = sorted(QUELLE.glob("*-800.webp"))
    if not bilder:
        sys.exit(f"Keine Fotos in {QUELLE}")
    tmp = Path(tempfile.mkdtemp())
    try:
        galerie("demo-lena-paul", bilder, True, tmp)
        galerie("demo-familie-huber", bilder[:6], False, tmp)
    finally:
        shutil.rmtree(tmp)


if __name__ == "__main__":
    main()
