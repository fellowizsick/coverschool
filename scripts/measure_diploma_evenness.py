# -*- coding: utf-8 -*-
"""Measure the diploma PDFs and prove the printed name is EVEN.

Reads real text spans (not guessed ink bands) so the measurement is exact:

  * the name's left and right margins must match (centred)
  * the name must fit inside the frame (nothing clipped)
  * every certificate must place the name at the SAME vertical position
"""
import glob
import os
import sys

import pymupdf

T = os.path.join(os.environ['LOCALAPPDATA'], 'Temp', 'evenness')
FRAME_PT = 12.3          # dx(20) — the outer frame inset, in points
W_PT = 648.0


def spans(page):
    out = []
    for block in page.get_text('dict')['blocks']:
        for line in block.get('lines', []):
            for s in line.get('spans', []):
                t = s['text'].strip()
                if t:
                    out.append((t, s['bbox'], s['size']))
    return out


def find_name(page, expect_contains):
    """The graduate name is the largest text whose content matches the student's name."""
    best = None
    for t, bbox, size in spans(page):
        flat = ' '.join(t.split())
        if not flat:
            continue
        # match on the longest word to survive per-character drawing of the arched line
        if expect_contains.lower() in flat.lower() or flat.lower() in expect_contains.lower():
            if best is None or size > best[2]:
                best = (flat, bbox, size)
    return best


def main():
    pdfs = sorted(glob.glob(os.path.join(T, '*.pdf')))
    if not pdfs:
        print('  no PDFs — run: npx tsx scripts/check_diploma_evenness.ts')
        sys.exit(1)

    print(f'  {"case":<19}{"size":>6}{"left":>8}{"right":>8}{"marginL":>9}{"marginR":>9}{"diff":>7}{"y":>8}  verdict')
    bad = 0
    ys = []
    sizes = []
    for p in pdfs:
        case = os.path.basename(p)[:-4]
        d = pymupdf.open(p)
        pg = d[0]
        all_spans = spans(pg)
        # the graduate name = the biggest non-blackletter text block in the upper-middle area
        # the graduate name's top sits ~170-190pt from the top of a 504pt sheet (its baseline is at
        # design y=330). The paragraph begins ~208pt down, so this band excludes it.
        # The arched school name (~29pt) and the Mobile/Alabama row (~129pt) fall outside too.
        cands = [(t, b, s) for t, b, s in all_spans if 160 < b[1] < 204]
        if not cands:
            print(f'  {case:<19} no text found ✗')
            bad += 1
            continue
        # group spans that share a baseline into one line, then take the widest line in the zone
        lines = {}
        for t, b, s in cands:
            key = round(b[3], 1)   # baseline (line bottom)
            lines.setdefault(key, []).append((t, b, s))
        best = None
        for key, group in lines.items():
            x0 = min(b[0] for _, b, _ in group)
            x1 = max(b[2] for _, b, _ in group)
            size = max(s for _, _, s in group)
            if best is None or (x1 - x0) > best[3]:
                best = (x0, x1, size, x1 - x0, key)
        if best is None:
            print(f'  {case:<19} could not locate the name line ✗')
            bad += 1
            continue
        x0, x1, size, span, ybase = best
        lm = x0 - FRAME_PT
        rm = (W_PT - FRAME_PT) - x1
        diff = abs(lm - rm)
        inside = lm > -1 and rm > -1
        centred = diff <= 6
        ys.append(round(ybase, 1))
        sizes.append(round(size, 1))
        verdict = 'OK ✓' if (inside and centred) else ('OFF-CENTRE ✗' if not centred else 'OUTSIDE FRAME ✗')
        if not (inside and centred):
            bad += 1
        print(f'  {case:<19}{size:>6.1f}{x0:>8.1f}{x1:>8.1f}{lm:>9.1f}{rm:>9.1f}{diff:>7.1f}{ybase:>8.1f}  {verdict}')

    print()
    print(f'  certificates measured   : {len(pdfs)}')
    print(f'  problems                : {bad}')
    spread = (max(ys) - min(ys)) if ys else 0
    print(f'  baseline spread         : {spread:.1f}pt  '
          f'{"(baseline fixed - layout does not shift) ✓" if spread <= 3 else "(BASELINE MOVES ✗)"}')
    print(f'  name sizes used         : {sorted(set(sizes))}')
    print(f'  RESULT                  : {"ALL EVEN ✓" if bad == 0 and spread <= 3 else "NEEDS FIXING ✗"}')


if __name__ == '__main__':
    main()
