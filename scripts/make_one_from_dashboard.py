# -*- coding: utf-8 -*-
"""Make one diploma through Mom's dashboard with a different name AND a back-dated date.

Jonathan, 2026-09-12: "use her dashboard and give me another one with a different name and different
date." Also answers his question about back-dating: he wants to know Anne can set the date to
something other than today, which this proves by using a date over a year in the past.

Drives the real page (New diploma -> pick student -> type name -> set a PAST date -> Create -> Send),
then saves the exact PDF her Send attaches and renders it, so the result can be looked at.
"""
import datetime
import io
import json
import os
import sys
import urllib.request

from playwright.sync_api import sync_playwright
from PIL import Image
import pymupdf

T = os.path.join(os.environ['LOCALAPPDATA'], 'Temp')
COOKIE_FILE = os.path.join(T, 'cookie.txt')
BASE = 'https://laroseca.org'

NAME = sys.argv[1] if len(sys.argv) > 1 else 'Daniel Joseph Hargrove'
BACK_DATE = sys.argv[2] if len(sys.argv) > 2 else '2025-06-14'      # well in the past
TO = sys.argv[3] if len(sys.argv) > 3 else '1990jonathanbbrown@gmail.com'

K = 648.0 / 1056.0
today = datetime.date.today().isoformat()


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

print(f'  name        : {NAME}')
print(f'  date to use : {BACK_DATE}   (today is {today} — this is a BACK DATE)')
print()

number = None
with sync_playwright() as pw:
    browser = pw.chromium.launch(channel='msedge', headless=True)
    ctx = browser.new_context(viewport={'width': 1280, 'height': 1500})
    ctx.add_cookies([{'name': ck_name, 'value': ck_val, 'domain': 'laroseca.org', 'path': '/'}])
    page = ctx.new_page()
    page.set_default_timeout(45000)
    page.goto(f'{BASE}/dashboard/diplomas', wait_until='domcontentloaded')
    page.wait_for_timeout(4000)

    page.click('button:has-text("New diploma")')
    page.wait_for_timeout(2500)

    default_date = page.locator('input[type="date"]').input_value()
    number = page.get_by_placeholder('LCA-2027-0001').input_value().strip()
    print(f'  1. the form opened with today ({default_date}) and number {number}')

    sel = page.locator('select').first
    sel.select_option(index=1)                     # a student is required
    page.wait_for_timeout(1500)

    box = page.get_by_placeholder('Summer Graham')
    box.click(); box.fill(NAME)
    page.wait_for_timeout(600)

    print(f'  2. changing the date to the PAST: {BACK_DATE}')
    page.locator('input[type="date"]').fill(BACK_DATE)
    page.wait_for_timeout(600)

    page.click('button:has-text("Create diploma")')
    page.wait_for_timeout(9000)
    txt = page.inner_text('body')
    print('  3. Create:', 'created' in txt.lower())

    el = page.get_by_text(number, exact=False).first
    row = el.locator('xpath=ancestor::div[.//button[contains(., "Send")]][1]')
    row.locator('button:has-text("Send")').first.click()
    page.wait_for_timeout(2000)
    page.locator('input[type="email"]').first.fill(TO)
    page.wait_for_timeout(600)
    page.click('button:has-text("Send now")')
    page.wait_for_timeout(16000)
    txt = page.inner_text('body')
    print(f'  4. Send to {TO}:', f'sent to {TO}' in txt)

    # the exact PDF her send attached
    rows = supabase(f"select id, graduation_date from diplomas where diploma_number='{number}';")
    stored = rows[0]['graduation_date'] if rows else None
    print(f'  5. stored date in the database: {stored}  {"(BACK-DATED ✓)" if stored == BACK_DATE else ""}')
    if rows:
        req = urllib.request.Request(f'{BASE}/api/admin-diplomas/preview?id={rows[0]["id"]}',
                                     headers={'Cookie': COOKIE})
        data = urllib.request.urlopen(req, timeout=120).read()
        p = os.path.join(T, 'DASHBOARD_ONCE.pdf')
        open(p, 'wb').write(data)
        pg = pymupdf.open(stream=data, filetype='pdf')[0]
        flat = ' '.join(pg.get_text().split())
        print(f'  6. the PDF: {pg.rect.width/72:.2f} x {pg.rect.height/72:.2f} in, {len(data):,} bytes')
        print(f'     name on it  : {"Daniel Joseph Hargrove" in flat}')
        for m in ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                  'August', 'September', 'October', 'November', 'December']:
            if f' {m} ' in flat:
                i = flat.find(f' {m} ')
                print(f'     date on it  : {flat[i+1:i+20].strip()}')
                break
        pix = pg.get_pixmap(dpi=200)
        im = Image.open(io.BytesIO(pix.tobytes('png'))).convert('RGB')
        out = os.path.join(T, 'DASHBOARD_DIPLOMA.png')
        im.resize((1500, int(im.height * 1500 / im.width)), Image.LANCZOS).save(out)
        print('  7. rendered ->', out)

    # clean up only our row
    page.on('dialog', lambda d: d.accept())
    el2 = page.get_by_text(number, exact=False).first
    row2 = el2.locator('xpath=ancestor::div[.//button[contains(., "Delete")]][1]')
    if row2.count():
        row2.locator('button:has-text("Delete")').first.click()
        page.wait_for_timeout(4000)
    browser.close()

left = supabase(f"select diploma_number from diplomas where diploma_number='{number}';")
keep = supabase("select diploma_number from diplomas where diploma_number='LCA-2027-0001';")
print(f'  8. test row removed: {len(left) == 0}   real diploma intact: {len(keep) == 1}')
