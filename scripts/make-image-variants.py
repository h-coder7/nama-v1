"""Build .w640/.w1080/.w1920 WebP variants for the static review export (run on out/).
Variants are cached in .variant-cache/ (keyed by path + source mtime) so rebuilds are fast."""
import os, re, shutil, sys
from PIL import Image
root = sys.argv[1]
cache = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".variant-cache")
made = copied = 0
base = os.path.join(root, "assets/namma/images")
for d, _, fs in os.walk(base):
    for f in fs:
        if not f.endswith(".webp") or re.search(r"\.w\d+\.webp$", f):
            continue
        src = os.path.join(d, f)
        rel = os.path.relpath(src, base)
        stamp = int(os.path.getmtime(os.path.join("public/assets/namma/images", rel)) if os.path.exists(os.path.join("public/assets/namma/images", rel)) else os.path.getmtime(src))
        im = None
        for b in (1080,):
            name = rel[:-5] + f".w{b}.webp"
            cached = os.path.join(cache, f"{stamp}", name)
            if not os.path.exists(cached):
                if im is None:
                    im = Image.open(src); im.load()
                os.makedirs(os.path.dirname(cached), exist_ok=True)
                out = im if im.width <= b else im.resize((b, round(im.height * b / im.width)), Image.LANCZOS)
                out.save(cached, "WEBP", quality=82, method=6); made += 1
            shutil.copyfile(cached, os.path.join(base, name)); copied += 1
print("variants made:", made, "copied:", copied)
