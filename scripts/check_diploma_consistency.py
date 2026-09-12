# -*- coding: utf-8 -*-
"""PROVE that only the name and the date change from one diploma to the next.

Jonathan, 2026-09-12: "they don't need to be changing up all the time because our diplomas have to
look consistent ... only the name and the date changes ... consistency is key with this."

Renders every case from render_diploma_cases.ts, blanks the name band and the date band, and
compares each case against the first. Anything different outside those two bands is a failure.

Exit 0 = every diploma is identical apart from the name and the date.
"""
import glob
import os
import sys

import pymupdf
from PIL import Image, ImageChops

T = os.path.join(os.environ['LOCALAPPDATA'], 'Temp')
CASES = os.path.join(T, 'consistency')
OUT = os.path.join(T, 'consistency_diff.png')

# design px bands to ignore — measured from the certificate, generous enough to cover the largest
# name and the longest date, and deliberately NOT reaching the paragraph below (first line centre
# 408.6) or the rule above the date.
NAME_BAND = (300, 396)      # covers the name at every size the stepper allows
DATE_BAND = (578, 626)      # covers the date only

H = 1050                    # render height; everything is normalised to the same size


def render(pdf):
    pix = pymupdf.open(pdf)[0].get_pixmap(dpi=150)
    return Image.open(__import__('io').BytesIO(pix.tobytes('png'))).convert('L')


def masked(im):
    im = im.copy()
    w, h = im.size
    for lo, hi in (NAME_BAND, DATE_BAND):
        im.paste(255, (0, int(h * lo / 816), w, int(h * hi / 816)))
    return im


def main():
    files = sorted(glob.glob(os.path.join(CASES, '*.pdf')))
    if len(files) < 2:
        print(f'  need at least 2 cases in {CASES} — run scripts/render_diploma_cases.ts first')
        return 1

    base = masked(render(files[0]))
    print(f'  baseline: {os.path.basename(files[0])}   ({base.size[0]}x{base.size[1]})')
    print('  comparing every other case with the name band and the date band blanked out')
    print()
    print('  %-22s %12s %12s  %s' % ('case', 'size match', 'diff pixels', 'verdict'))
    print('  ' + '-' * 68)

    bad = 0
    worst = None
    for f in files[1:]:
        im = masked(render(f))
        if im.size != base.size:
            print(f'  {os.path.basename(f):<22} {"NO":>12} {"-":>12}  SHAPE DIFFERS')
            bad += 1
            continue
        diff = ImageChops.difference(base, im)
        bbox = diff.getbbox()
        npx = sum(1 for p in diff.getdata() if p > 32)
        verdict = 'IDENTICAL' if npx == 0 else f'DIFFERS  bbox={bbox}'
        if npx:
            bad += 1
            if worst is None:
                worst = (f, diff)
        print(f'  {os.path.basename(f):<22} {"yes":>12} {npx:>12}  {verdict}')

    if worst:
        f, diff = worst
        # normalise so the difference is visible, and stack it under the baseline
        canvas = Image.new('L', (base.size[0], base.size[1] * 2 + 20), 255)
        canvas.paste(base, (0, 0))
        canvas.paste(diff.point(lambda v: 255 - min(255, v * 8)), (0, base.size[1] + 20))
        canvas.save(OUT)
        print()
        print(f'  difference map (white = both the same, dark = changed): {OUT}')

    print()
    if bad:
        print(f'  FAIL — {bad} diploma(s) differ outside the name and date bands')
        return 1
    print('  PASS — every diploma is identical except the name and the date')
    return 0


if __name__ == '__main__':
    sys.exit(main())
