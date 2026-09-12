# -*- coding: utf-8 -*-
"""Compare the on-screen certificate with the emailed PDF, both at the SAME sheet width.

Earlier comparisons stacked a whole-page screenshot above a PDF raster, so the two were at different
scales and size differences were invisible or misleading. This screenshots just the certificate
element (id="cert") and the PDF's single page, then scales both to one width and stacks them with
labels, so any difference in size, wording, line breaks or position is directly visible.

Usage: compare_sheet.py <pdf-path> <out-png> [enrollment-id]
"""
import io
import os
import sys

import pymupdf
from PIL import Image
from playwright.sync_api import sync_playwright

T = os.path.join(os.environ['LOCALAPPDATA'], 'Temp')
COOKIE_FILE = os.path.join(T, 'cookie.txt')
PDF = sys.argv[1] if len(sys.argv) > 1 else os.path.join(T, 'CHK_DEPLOYED.pdf')
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(T, 'SHEET_COMPARE.png')
ENR = sys.argv[3] if len(sys.argv) > 3 else '9b3fb69b-cb3b-4af2-97cd-acaafdc201be'

W = 1100

# ---- the screen render, cropped to the certificate itself
shot = os.path.join(T, 'SHEET_WEB.png')

with sync_playwright() as pw:
    b = pw.chromium.launch(channel='msedge', headless=True)
    ctx = b.new_context(viewport={'width': 1400, 'height': 1200}, device_scale_factor=2)
    raw = io.open(COOKIE_FILE, encoding='utf-8').read().strip()
    n, v = raw.split('=', 1)
    ctx.add_cookies([{'name': n, 'value': v, 'domain': 'laroseca.org', 'path': '/'}])
    page = ctx.new_page()
    page.goto(f'https://laroseca.org/print/diploma/{ENR}', wait_until='domcontentloaded')
    page.wait_for_timeout(6000)
    # Screenshot the whole page, then crop to the cream sheet by COLOUR. Looking for #cert by id was
    # brittle (it is not always in the DOM on a fresh load), and colour cannot fail silently.
    full = os.path.join(T, 'SHEET_WEB_FULL.png')
    page.screenshot(path=full, full_page=True)
    print('  screen full ->', full)
    b.close()

# crop to the cream paper (#f4efe2)
im = Image.open(full).convert('RGB')
px = im.load()
w, h = im.size
minx, miny, maxx, maxy = w, h, -1, -1
step = 2
for y in range(0, h, step):
    for x in range(0, w, step):
        r, g, b_ = px[x, y]
        if abs(r - 244) < 5 and abs(g - 239) < 5 and abs(b_ - 226) < 6:
            if x < minx: minx = x
            if y < miny: miny = y
            if x > maxx: maxx = x
            if y > maxy: maxy = y
if maxx < 0:
    raise SystemExit('  could not find the cream sheet in the screenshot')
# force the true 9:7 sheet aspect, centred on what we found, so both panels are the same shape
bw, bh = maxx - minx + 1, maxy - miny + 1
want = 9 / 7
if bw / bh > want:
    nw, nh = bw, int(round(bw / want))
else:
    nh, nw = bh, int(round(bh * want))
cx, cy = (minx + maxx) // 2, (miny + maxy) // 2
im.crop((cx - nw // 2, cy - nh // 2, cx + nw // 2, cy + nh // 2)).save(shot)
print(f'  screen sheet -> {shot}  (cropped {maxx-minx+1}x{maxy-miny+1})')

web = Image.open(shot).convert('RGB')
doc = pymupdf.open(PDF)
pix = doc[0].get_pixmap(dpi=150)
pdf = Image.open(io.BytesIO(pix.tobytes('png'))).convert('RGB')
print(f'  pdf sheet    -> {pdf.size[0]}x{pdf.size[1]}')


def fit(im):
    return im.resize((W, int(im.height * W / im.width)), Image.LANCZOS)


web, pdf = fit(web), fit(pdf)
bar, gap = 54, 22
canvas = Image.new('RGB', (W, bar + web.height + gap + bar + pdf.height), 'white')
from PIL import ImageDraw
d = ImageDraw.Draw(canvas)
d.rectangle([0, 0, W, bar], fill=(20, 90, 60))
d.text((14, 18), 'ON SCREEN (what Anne sees when she clicks Print Diploma)', fill='white')
y = bar + web.height + gap
canvas.paste(web, (0, bar))
d.rectangle([0, y, W, y + bar], fill=(20, 60, 110))
d.text((14, y + 18), 'THE EMAILED PDF (what the family receives)', fill='white')
canvas.paste(pdf, (0, y + bar))
canvas.save(OUT)
print(f'  saved {OUT}   ({canvas.size[0]}x{canvas.size[1]})')
print(f'  both sheets scaled to {W}px wide, so size differences are real')
