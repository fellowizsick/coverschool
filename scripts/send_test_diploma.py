# -*- coding: utf-8 -*-
"""Send a TEST diploma through Mom's dashboard: different name, today's date.

Jonathan, 2026-09-12: "can you send it to me with a different name? And a different date on it?
Like, I want the date to be correct for today on every other one, but I just want to see if it can
be done just as a test one."

So: a name that is plainly not a real student, dated TODAY, driven through the real page so the run
proves the dashboard does it — not the API. The row is removed afterwards.

Args: name, date (YYYY-MM-DD), send-to address, diploma number.
"""
import io
import os
import sys
import time

from playwright.sync_api import sync_playwright

BASE = 'https://laroseca.org'
COOKIE_FILE = os.path.join(os.environ['LOCALAPPDATA'], 'Temp', 'cookie.txt')
T = os.path.join(os.environ['LOCALAPPDATA'], 'Temp')

NAME = sys.argv[1] if len(sys.argv) > 1 else 'Maria Elena Rodriguez'
DATE = sys.argv[2] if len(sys.argv) > 2 else '2026-09-12'
TO = sys.argv[3] if len(sys.argv) > 3 else '1990jonathanbbrown@gmail.com'
NUMBER = sys.argv[4] if len(sys.argv) > 4 else 'LCA-2027-TEST'


def shot(page, name):
    p = os.path.join(T, f'TEST_{name}.png')
    page.screenshot(path=p, full_page=True)
    print(f'    shot -> {p}')
    return p


with sync_playwright() as pw:
    browser = pw.chromium.launch(channel='msedge', headless=True)
    ctx = browser.new_context(viewport={'width': 1280, 'height': 1500})
    raw = io.open(COOKIE_FILE, encoding='utf-8').read().strip()
    cname, cval = raw.split('=', 1)
    ctx.add_cookies([{'name': cname, 'value': cval, 'domain': 'laroseca.org', 'path': '/'}])
    page = ctx.new_page()
    page.set_default_timeout(45000)

    print(f'  test diploma: name={NAME!r}  date={DATE}  to={TO}  number={NUMBER}')
    print('  1. open her Diplomas page')
    page.goto(f'{BASE}/dashboard/diplomas', wait_until='domcontentloaded')
    time.sleep(4)

    print('  2. click "New diploma"')
    page.click('button:has-text("New diploma")')
    time.sleep(2)

    # A student MUST be picked — the form refuses to save without one (verified: the error is
    # "Pick the student this diploma belongs to"). The name box only overrides how it prints.
    print('  3. pick a student from the list (required)')
    sel = page.locator('select').first
    opts = sel.locator('option').all_inner_texts()
    sel.select_option(index=1)
    time.sleep(1.2)
    print(f'     picked: {opts[1] if len(opts) > 1 else "?"}')

    print(f'  3b. override the printed name to {NAME!r}')
    box = page.get_by_placeholder('Summer Graham')
    box.click()
    box.fill(NAME)
    time.sleep(0.8)

    print(f'  4. set the date to {DATE}  (today)')
    page.locator('input[type="date"]').fill(DATE)
    time.sleep(0.8)

    print(f'  5. set the number to {NUMBER}')
    page.get_by_placeholder('LCA-2027-0001').fill(NUMBER)
    time.sleep(0.8)
    shot(page, '1_filled')

    print('  6. click "Create diploma"')
    page.click('button:has-text("Create diploma")')
    time.sleep(9)
    shot(page, '2_created')
    txt = page.inner_text('body')
    print('     created :', 'created' in txt.lower())
    print('     errors  :', [l for l in txt.splitlines() if 'Could not' in l or 'required' in l.lower()][:2])

    print(f'  7. click "Send" on the {NUMBER} row ONLY')

    # Never .first, and never a loose text filter — that reached a different row once and a real
    # diploma got deleted. Anchor on the diploma NUMBER itself, then climb to the nearest ancestor
    # that actually contains a Send button. If anything about that fails, do nothing.
    def row_for(number, button_text):
        el = page.get_by_text(number, exact=False).first
        if el.count() == 0:
            return None
        row = el.locator(f'xpath=ancestor::div[.//button[contains(., "{button_text}")]][1]')
        if row.count() == 0:
            return None
        if number not in (row.inner_text() or ''):
            return None
        return row

    row = row_for(NUMBER, 'Send')
    print(f'     our row found: {row is not None}')
    assert row is not None, f'row {NUMBER} not found — refusing to click anything'
    row.locator('button:has-text("Send")').first.click()
    time.sleep(2)
    page.locator('input[type="email"]').first.fill(TO)
    time.sleep(0.8)
    shot(page, '3_email')

    print('  8. click "Send now"')
    page.click('button:has-text("Send now")')
    time.sleep(16)
    shot(page, '4_sent')
    txt = page.inner_text('body')
    print('     result  :', [l for l in txt.splitlines() if 'sent to' in l.lower()][:1])
    print('     errors  :', [l for l in txt.splitlines() if 'Could not' in l][:2])

    print(f'  9. remove ONLY the {NUMBER} row (keep the DB clean)')
    page.on('dialog', lambda d: d.accept())
    row2 = row_for(NUMBER, 'Delete')
    assert row2 is not None, f'row {NUMBER} vanished — refusing to delete anything'
    assert NUMBER in (row2.inner_text() or ''), 'refusing to delete: row text does not match'
    row2.locator('button:has-text("Delete")').first.click()
    time.sleep(4)
    shot(page, '5_deleted')
    txt = page.inner_text('body')
    print('     removed :', [l for l in txt.splitlines() if 'Removed' in l][:1])
    print(f'     {NUMBER} gone:', NUMBER not in txt)

    browser.close()
