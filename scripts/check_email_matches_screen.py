# -*- coding: utf-8 -*-
"""FAIL if the emailed PDF puts any element anywhere other than where the page puts it.

Jonathan, 2026-09-12: *"Why does the emblem move? I like where the emblems at where the one has my
name on it."* The email had drifted element by element — the paragraph 54 design px too high,
"This Certifies That" 41, the date 33, the Mobile/emblem row 24 — because its positions were guessed
while the page's come from CSS flow.

This gate re-measures BOTH sides and compares centres. It exists because "the email must look like
the screen" is a testable claim, and because the PDF's positions are now a table copied from the
page: if the page's layout ever changes, this fails loudly instead of drifting quietly.

Run:  <hermes venv>/Scripts/python.exe scripts/check_email_matches_screen.py
Exit: 0 = every element within tolerance, 1 = something moved (details printed)
"""
import io
import os
import subprocess
import sys

import pymupdf

T = os.path.join(os.environ['LOCALAPPDATA'], 'Temp')
COOKIE = os.path.join(T, 'cookie.txt')
PDF = sys.argv[1] if len(sys.argv) > 1 else os.path.join(T, 'CHK_DEPLOYED.pdf')
TOL = 3.0            # design px
ENR = '9b3fb69b-cb3b-4af2-97cd-acaafdc201be'
LIVE = f'https://laroseca.org/print/diploma/{ENR}'
K = 648.0 / 1056.0

# What the page should place, and where. Labels are the element's own text; the emblem is special.
EXPECT = {
    'Mobile': 221.3,
    'Alabama': 221.3,
    'This Certifies That': 300.6,
    'High School Diploma': 498.8,
    'In Testimony Whereof we have affixed our signatures.': 554.4,
    'President': 743.4,
    'Headmaster': 743.4,
}

# The emblem is deliberately NOT on the words' centre line: Jonathan asked for it raised and enlarged
# (2026-09-12). This is its box centre on the page, and the email must match THIS.
EMBLEM_EXPECT = 216.3

JS = r"""
() => {
  const sheet = [...document.querySelectorAll('div')].filter(e => {
    const r = e.getBoundingClientRect();
    return r.width > 400 && Math.abs(r.width / r.height - 1056/816) < 0.06;
  }).sort((a,b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width)[0];
  if (!sheet) return {err: 'no sheet on the page'};
  const sr = sheet.getBoundingClientRect(); const K = 1056 / sr.width;
  const out = {};
  document.querySelectorAll('div, span').forEach(el => {
    if (el.children.length) return;
    const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (!t) return;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    out[t.slice(0, 60)] = +(((r.top + r.bottom) / 2 - sr.top) * K).toFixed(1);
  });
  const img = document.querySelector('img[alt*="seal"]');
  if (img) { const r = img.getBoundingClientRect();
    out['__EMBLEM__'] = +(((r.top + r.bottom) / 2 - sr.top) * K).toFixed(1); }
  return {out};
}
"""


def screen_centres():
    from playwright.sync_api import sync_playwright
    raw = io.open(COOKIE, encoding='utf-8').read().strip()
    n, v = raw.split('=', 1)
    with sync_playwright() as pw:
        b = pw.chromium.launch(channel='msedge', headless=True)
        ctx = b.new_context(viewport={'width': 1400, 'height': 1200}, device_scale_factor=1)
        ctx.add_cookies([{'name': n, 'value': v, 'domain': 'laroseca.org', 'path': '/'}])
        pg = ctx.new_page()
        pg.goto(LIVE, wait_until='domcontentloaded')
        pg.wait_for_timeout(6000)
        return pg.evaluate(JS)


def pdf_centres():
    page = pymupdf.open(PDF)[0]
    out = {}
    for blk in page.get_text('dict')['blocks']:
        for ln in blk.get('lines', []):
            t = ''.join(s['text'] for s in ln['spans']).strip()
            if not t:
                continue
            c = (min(s['bbox'][1] for s in ln['spans']) + max(s['bbox'][3] for s in ln['spans'])) / 2 / K
            out.setdefault(t, []).append(round(c, 1))
    for info in page.get_image_info():
        bb = info['bbox']
        out.setdefault('__EMBLEM__', []).append(round((bb[1] + bb[3]) / 2 / K, 1))
    return out


def main():
    if not os.path.exists(PDF):
        print(f'  no PDF at {PDF} — pass one as an argument'); return 1
    if not os.path.exists(COOKIE):
        print(f'  no admin cookie at {COOKIE} — mint one first'); return 1

    res = screen_centres()
    if res.get('err'):
        print('  could not measure the page:', res['err']); return 1
    web = res['out']
    pdf = pdf_centres()

    print(f'  tolerance {TOL} design px   (PDF: {os.path.basename(PDF)})')
    print('  %-52s %8s %10s %8s' % ('element', 'screen', 'email', 'delta'))
    print('  ' + '-' * 82)
    bad = 0
    for label, expect in EXPECT.items():
        have = web.get(label)
        if have is None:
            print(f'  {label[:52]:<52} {"??":>8} {"-":>10} {"not on page":>8}'); bad += 1; continue
        if abs(have - expect) > TOL:
            print(f'  {label[:52]:<52} {expect:8.1f} {have:10.1f} {have-expect:+8.1f}  PAGE MOVED'); bad += 1
    for label in ['__EMBLEM__']:
        have = web.get(label)
        if have is None:
            print(f'  {label[:52]:<52} {"??":>8} {"-":>10} {"not on page":>8}'); bad += 1
    for label, expect in EXPECT.items():
        vals = pdf.get(label)
        if not vals:
            print(f'  {label[:52]:<52} {expect:8.1f} {"missing":>10} {"-":>8}  EMAIL MISSING'); bad += 1
            continue
        # several rows can share a label (script + printed name); only complain if NONE match
        best = min(vals, key=lambda v: abs(v - expect))
        d = best - expect
        ok = abs(d) <= TOL
        if not ok:
            bad += 1
        print(f'  {label[:52]:<52} {expect:8.1f} {best:10.1f} {d:+8.1f}  {"ok" if ok else "EMAIL OFF"}')
    em = pdf.get('__EMBLEM__')
    if em:
        d = em[0] - EMBLEM_EXPECT
        ok = abs(d) <= TOL
        bad += 0 if ok else 1
        print(f'  {"__EMBLEM__ (raised by design)":<52} {EMBLEM_EXPECT:8.1f} {em[0]:10.1f} {d:+8.1f}  {"ok" if ok else "EMAIL OFF"}')
    scr = web.get('__EMBLEM__')
    if scr is not None and abs(scr - EMBLEM_EXPECT) > TOL:
        print(f'  {"__EMBLEM__ on the page":<52} {EMBLEM_EXPECT:8.1f} {scr:10.1f} {scr-EMBLEM_EXPECT:+8.1f}  PAGE MOVED')
        bad += 1
    print()
    if bad:
        print(f'  FAIL — {bad} problem(s)')
        return 1
    print('  PASS — the emailed certificate matches the on-screen one')
    return 0


if __name__ == '__main__':
    sys.exit(main())
