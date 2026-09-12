# -*- coding: utf-8 -*-
"""Put the on-screen diploma next to the emailed PDF, at the same width, for comparison.

The user's complaint: "the words underneath the name changed - their text changed and they changed
their position." The text is identical in both renderers, so the suspect is the LINE BREAKS: the
web page lets the standards paragraph wrap naturally (3 lines), while the PDF draws it as fixed
lines (2 lines). That difference changes how the block under the name looks and where it sits.

Renders the live print page with the admin cookie and stacks it above a raster of the PDF.
"""
import io
import os
import sys

import pymupdf
from PIL import Image
from playwright.sync_api import sync_playwright

T = os.path.join(os.environ['LOCALAPPDATA'], 'Temp')
COOKIE_FILE = os.path.join(T, 'cookie.txt')
ENROLLMENT = '9b3fb69b-cb3b-4af2-97cd-acaafdc201be'
PDF = sys.argv[1] if len(sys.argv) > 1 else os.path.join(T, 'UI_EMAILED.pdf')
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(T, 'WEB_vs_EMAIL_TEXT.png')

with sync_playwright() as pw:
    b = pw.chromium.launch(channel='msedge', headless=True)
    ctx = b.new_context(viewport={'width': 1400, 'height': 1200})
    raw = io.open(COOKIE_FILE, encoding='utf-8').read().strip()
    n, v = raw.split('=', 1)
    ctx.add_cookies([{'name': n, 'value': v, 'domain': 'laroseca.org', 'path': '/'}])
    page = ctx.new_page()
    page.goto(f'https://laroseca.org/print/diploma/{ENROLLMENT}', wait_until='domcontentloaded')
    page.wait_for_timeout(6000)
    # screenshot just the certificate sheet
    el = page.locator('.diploma-sheet, [data-diploma], body > div').first
    shot = os.path.join(T, 'WEB_RENDER.png')
    page.screenshot(path=shot, full_page=True)
    b.close()

web = Image.open(shot).convert('RGB')
doc = pymupdf.open(PDF)
pix = doc[0].get_pixmap(dpi=200)
pdf = Image.open(io.BytesIO(pix.tobytes('png'))).convert('RGB')

W = 1500
def fit(im):
    return im.resize((W, int(im.height * W / im.width)), Image.LANCZOS)

web, pdf = fit(web), fit(pdf)
gap = 30
canvas = Image.new('RGB', (W, web.height + gap + pdf.height + gap), 'white')
canvas.paste(web, (0, 0))
canvas.paste(pdf, (0, web.height + gap))
canvas.save(OUT)
print(f'  saved {OUT}')
print(f'  top = the WEB page he approved on screen ({web.size[0]}x{web.size[1]})')
print(f'  bottom = the EMAILED PDF ({pdf.size[0]}x{pdf.size[1]})')
