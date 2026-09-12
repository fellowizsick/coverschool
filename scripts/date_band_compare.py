# -*- coding: utf-8 -*-
"""Zoom right in on the date + rule, in both renderers, at the same scale.

Jonathan, 2026-09-12: "The line looked like it was still above the date." Both renderers MEASURE as
rule-below-date, so this shows the actual pixels of that band side by side rather than an argument.
"""
import os
import sys
from PIL import Image, ImageDraw

T = os.path.join(os.environ['LOCALAPPDATA'], 'Temp')
WEB = sys.argv[1] if len(sys.argv) > 1 else os.path.join(T, 'SHEET_WEB.png')
PDF = sys.argv[2] if len(sys.argv) > 2 else os.path.join(T, 'SHEET_PDF.png')
OUT = sys.argv[3] if len(sys.argv) > 3 else os.path.join(T, 'DATE_BAND_COMPARE.png')
W = 1100
BAND = (0.58, 0.80)          # fraction of the sheet height: the In Testimony -> signatures band


def band(im):
    w, h = im.size
    return im.crop((0, int(h * BAND[0]), w, int(h * BAND[1]))).resize(
        (W, int((BAND[1] - BAND[0]) * h * W / w)), Image.LANCZOS)


web = band(Image.open(WEB).convert('RGB'))
pdf = band(Image.open(PDF).convert('RGB'))
bar, gap = 46, 18
canvas = Image.new('RGB', (W, bar + web.height + gap + bar + pdf.height), 'white')
d = ImageDraw.Draw(canvas)
d.rectangle([0, 0, W, bar], fill=(20, 90, 60))
d.text((12, 15), 'ON SCREEN', fill='white')
y = bar + web.height + gap
canvas.paste(web, (0, bar))
d.rectangle([0, y, W, y + bar], fill=(20, 60, 110))
d.text((12, y + 15), 'THE EMAILED PDF', fill='white')
canvas.paste(pdf, (0, y + bar))
canvas.save(OUT)
print('  saved', OUT);
