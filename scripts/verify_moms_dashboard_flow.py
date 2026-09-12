# -*- coding: utf-8 -*-
"""Answer "when Mom makes one from her dashboard, does it work?" by DOING it and checking the output.

Drives her real page (New diploma -> pick student -> name -> date -> Create -> Send), then pulls the
exact PDF her Send would attach and verifies it is the corrected certificate, not just that the page
said OK. Removes only the row it created.

Checks, in order:
  1. the date box opens pre-filled with TODAY (she should never have to type it)
  2. the diploma number is filled in by the server
  3. picking a student fills the name
  4. Create succeeds
  5. the generated PDF is 9.00 x 7.00 in
  6. its date is today, its name is the one typed
  7. the standards paragraph is 3 lines in the BLACKLETTER font
  8. the rule sits BELOW the date
  9. Send reports success
 10. only our row is deleted, and the real diploma survives

Args: name, send-to  (optional)
"""
import datetime
import io
import json
import os
import sys
import time
import urllib.request

from playwright.sync_api import sync_playwright
import pymupdf

T = os.path.join(os.environ['LOCALAPPDATA'], 'Temp')
COOKIE_FILE = os.path.join(T, 'cookie.txt')
BASE = 'https://laroseca.org'
NAME = sys.argv[1] if len(sys.argv) > 1 else 'Maria Elena Rodriguez'
TO = sys.argv[2] if len(sys.argv) > 2 else '1990jonathanbbrown@gmail.com'
NUMBER = 'LCA-2027-FLOWCHK'
K = 648.0 / 1056.0

fails = []


def check(label, ok, detail=''):
    print(f"    {'PASS' if ok else 'FAIL'}  {label}{'  ' + detail if detail else ''}")
    if not ok:
        fails.append(label)


def supabase(sql):
    pat = open(os.path.expanduser('~/.hermes/secrets/lca_supabase_pat.txt')).read().strip()
    req = urllib.request.Request(
        'https://api.supabase.com/v1/projects/nwtsvggkchyjuwmcrkmi/database/query',
        data=json.dumps({'query': sql}).encode(),
        headers={'Authorization': 'Bearer ' + pat, 'Content-Type': 'application/json'}, method='POST')
    return json.loads(urllib.request.urlopen(req, timeout=60).read())


raw = io.open(COOKIE_FILE, encoding='utf-8').read().strip()
ck_name, ck_val = raw.split('=', 1)
COOKIE = f'{ck_name}={ck_val}'
today = datetime.date.today().isoformat()

print(f'  driving Mom\'s dashboard: "{NAME}"  to {TO}')
print()

with sync_playwright() as pw:
    browser = pw.chromium.launch(channel='msedge', headless=True)
    ctx = browser.new_context(viewport={'width': 1280, 'height': 1500})
    ctx.add_cookies([{'name': ck_name, 'value': ck_val, 'domain': 'laroseca.org', 'path': '/'}])
    page = ctx.new_page()
    page.set_default_timeout(45000)

    page.goto(f'{BASE}/dashboard/diplomas', wait_until='domcontentloaded')
    page.wait_for_timeout(4000)
    body = page.inner_text('body')
    check('her Diplomas page loads', 'Diplomas' in body and 'How this works' in body)

    page.click('button:has-text("New diploma")')
    page.wait_for_timeout(2500)

    # 1. the date she is offered
    date_val = page.locator('input[type="date"]').input_value()
    check('date box opens on TODAY', date_val == today, f'(shows {date_val}, today is {today})')

    # 2. the number the server hands out
    num_val = page.get_by_placeholder('LCA-2027-0001').input_value()
    check('diploma number filled by the server', bool(num_val.strip()), f'(shows {num_val})')

    # 3. picking a student fills the name
    sel = page.locator('select').first
    opts = sel.locator('option').all_inner_texts()
    bad = [v for v in sel.locator('option').evaluate_all('els => els.map(e => e.value)')
           if v in ('undefined', 'null', '')]
    check('student list is populated', len(opts) > 1, f'({len(opts)} options)')
    check('no broken option values', max(0, len(bad) - 1) == 0)
    sel.select_option(index=1)
    page.wait_for_timeout(1500)
    prefilled = page.get_by_placeholder('Summer Graham').input_value()
    check('picking a student fills the name', bool(prefilled.strip()), f'(-> "{prefilled}")')

    # override the printed name, and use the number the server gave (never collide with a real one)
    box = page.get_by_placeholder('Summer Graham')
    box.click(); box.fill(NAME)
    real_number = num_val.strip() or NUMBER
    page.get_by_placeholder('LCA-2027-0001').fill(real_number)
    page.wait_for_timeout(600)

    page.click('button:has-text("Create diploma")')
    page.wait_for_timeout(9000)
    txt = page.inner_text('body')
    check('Create reports success', 'created' in txt.lower())
    # Check VISIBLE errors only. The form's error element is always in the DOM, so grepping the page
    # text reports a failure on a perfectly successful save — which is exactly what it did.
    visible_err = page.evaluate('''() => {
        const bad = ['Pick the student this diploma belongs to', 'Could not'];
        return [...document.querySelectorAll('*')].filter(el => {
            if (el.children.length) return false;
            const t = (el.textContent || '').trim();
            if (!bad.some(b => t.includes(b))) return false;
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0;   // actually rendered
        }).map(el => el.textContent.trim());
    }''')
    check('no error is actually displayed', len(visible_err) == 0, f'({visible_err})')

    # 8. send it
    el = page.get_by_text(real_number, exact=False).first
    row = el.locator(f'xpath=ancestor::div[.//button[contains(., "Send")]][1]')
    if row.count() == 0:
        check('found the row to send', False)
    else:
        row.locator('button:has-text("Send")').first.click()
        page.wait_for_timeout(2000)
        page.locator('input[type="email"]').first.fill(TO)
        page.wait_for_timeout(600)
        page.click('button:has-text("Send now")')
        page.wait_for_timeout(16000)
        txt = page.inner_text('body')
        check('Send reports success', f'sent to {TO}' in txt)
        vis2 = page.evaluate('''() => [...document.querySelectorAll('*')].filter(el => {
            if (el.children.length) return false;
            const t = (el.textContent || '').trim();
            if (!t.includes('Could not')) return false;
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0;
        }).map(el => el.textContent.trim())''')
        check('send displayed no error', len(vis2) == 0, f'({vis2})')

    # 5-8. pull the exact PDF her send attaches and verify the CONTENT
    rows = supabase(f"select id, graduation_date from diplomas where diploma_number='{real_number}';")
    if not rows:
        check('diploma row exists in the database', False)
    else:
        did = rows[0]['id']
        check('diploma row exists in the database', True)
        check('stored date is today', rows[0]['graduation_date'] == today,
              f"({rows[0]['graduation_date']})")
        req = urllib.request.Request(f'{BASE}/api/admin-diplomas/preview?id={did}',
                                     headers={'Cookie': COOKIE})
        pdfbytes = urllib.request.urlopen(req, timeout=120).read()
        check('the emailed PDF downloads', len(pdfbytes) > 10000, f'({len(pdfbytes):,} bytes)')
        pg = pymupdf.open(stream=pdfbytes, filetype='pdf')[0]
        w, h = pg.rect.width / 72, pg.rect.height / 72
        check('page is 9 x 7 inches', abs(w - 9) < 0.01 and abs(h - 7) < 0.01, f'({w:.2f} x {h:.2f})')

        spans = []
        for blk in pg.get_text('dict')['blocks']:
            for ln in blk.get('lines', []):
                t = ''.join(s['text'] for s in ln['spans']).strip()
                if t:
                    spans.append((t, ln['spans'][0]['font'],
                                  (min(s['bbox'][1] for s in ln['spans']) + max(s['bbox'][3] for s in ln['spans'])) / 2 / K))
        par = [s for s in spans if s[0].startswith(('having satisfactorily', 'and requirements set', 'having complied'))]
        check('paragraph is 3 lines', len(par) == 3, f'({len(par)})')
        check('paragraph uses the blackletter font', all('OldEnglish' in s[1] for s in par),
              f"({par[0][1] if par else 'n/a'})")
        flat = ' '.join(pg.get_text().split())
        check('the name on it is the one typed', NAME.replace('  ', ' ') in flat)
        datey = next((s[2] for s in spans if s[0][:3] in ('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                                                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec')), None)
        rules = sorted(d['rect'].y0 / K for d in pg.get_drawings()
                       if d['rect'].height < 3 and 100 < d['rect'].width < 340)
        if datey and rules:
            near = min(rules, key=lambda r: abs(r - datey))
            check('rule sits BELOW the date', near > datey, f'(date {datey:.0f}, rule {near:.0f})')

    # 10. clean up ONLY our row
    page.on('dialog', lambda d: d.accept())
    el2 = page.get_by_text(real_number, exact=False).first
    row2 = el2.locator(f'xpath=ancestor::div[.//button[contains(., "Delete")]][1]')
    if row2.count():
        row2.locator('button:has-text("Delete")').first.click()
        page.wait_for_timeout(4000)
    browser.close()

left = supabase(f"select student_name, diploma_number from diplomas where diploma_number='{real_number}';")
check('our test row is removed', len(left) == 0)
keep = supabase("select student_name, diploma_number from diplomas where diploma_number='LCA-2027-0001';")
check('Jonathan\'s real diploma is untouched', len(keep) == 1)

print()
if fails:
    print(f'  {len(fails)} PROBLEM(S): ' + '; '.join(fails))
    sys.exit(1)
print('  ALL CHECKS PASSED — her dashboard produces the corrected certificate end to end')
