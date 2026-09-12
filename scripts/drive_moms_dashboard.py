# -*- coding: utf-8 -*-
"""Drive Mom's Diplomas dashboard like a person would, and capture every state.

This is the honest test of "can she make one from her site": it clicks the real buttons on the real
page — New diploma, the student picker, Create, Send, Delete — instead of calling the API directly.

Writes numbered screenshots so each step can be looked at.

Run with the hermes venv python (it has playwright + websocket):
  <hermes venv>/Scripts/python.exe scripts/drive_moms_dashboard.py
"""
import io
import os
import sys
import time

from playwright.sync_api import sync_playwright

# Drive the LIVE site with the admin session cookie set directly. The local proxy re-fetches
# every asset from production one at a time, so a full page load never finishes in time.
BASE = 'https://laroseca.org'
COOKIE_FILE = os.path.join(os.environ['LOCALAPPDATA'], 'Temp', 'cookie.txt')
T = os.path.join(os.environ['LOCALAPPDATA'], 'Temp')
SHOTS = []


def shot(page, name):
    p = os.path.join(T, f'UI_{name}.png')
    page.screenshot(path=p, full_page=True)
    SHOTS.append(p)
    print(f'    shot -> {name}.png')


def main():
    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel='msedge', headless=True)
        ctx = browser.new_context(viewport={'width': 1280, 'height': 1400})
        raw = io.open(COOKIE_FILE, encoding='utf-8').read().strip()
        cname, cval = raw.split('=', 1)
        ctx.add_cookies([{'name': cname, 'value': cval, 'domain': 'laroseca.org', 'path': '/'}])
        print(f'    session cookie set: {cname[:40]}…')
        page = ctx.new_page()
        page.set_default_timeout(45000)

        print('  1. open her Diplomas page')
        # networkidle never fires here — the dashboard keeps a live connection (beach scene /
        # polling), so wait for the DOM and then give React time to hydrate.
        page.goto(f'{BASE}/dashboard/diplomas', wait_until='domcontentloaded')
        time.sleep(2.5)
        shot(page, '1_opened')
        body = page.inner_text('body')
        print('     heading present :', 'Diplomas' in body)
        print('     how-it-works    :', 'How this works' in body)
        print('     new diploma btn :', page.locator('button:has-text("New diploma")').count() > 0)

        print('  2. click "New diploma"')
        page.click('button:has-text("New diploma")')
        time.sleep(1.5)
        shot(page, '2_form_open')

        # the student dropdown — this is what was broken
        sel = page.locator('select').first
        opts = sel.locator('option').all_inner_texts()
        print(f'     dropdown options ({len(opts)}):')
        for o in opts[:8]:
            print(f'       {o}')
        values = sel.locator('option').evaluate_all('els => els.map(e => e.value)')
        bogus = [v for v in values if v in ('undefined', 'null', '')]
        print(f'     bad option values (should be 0, ignoring the placeholder): {max(0, len(bogus) - 1)}')

        # pick a real student (skip the "Choose a student…" placeholder)
        target_idx = 1
        sel.select_option(index=target_idx)
        time.sleep(1.5)
        picked_label = opts[target_idx] if len(opts) > target_idx else '(none)'
        print(f'     picked: {picked_label}')
        # the name box should now be filled from the picker
        name_box = page.get_by_placeholder('Summer Graham')
        name_val = name_box.input_value()
        print(f'     name prefilled with: {name_val!r}')

        # date + number
        page.locator('input[type="date"]').fill('2027-05-21')
        number_box = page.get_by_placeholder('LCA-2027-0001')
        number_box.fill('LCA-2027-UITEST')
        time.sleep(0.5)
        shot(page, '3_form_filled')

        print('  3. click "Create diploma"')
        page.click('button:has-text("Create diploma")')
        time.sleep(3.5)
        shot(page, '4_created')
        after = page.inner_text('body')
        created = 'created' in after.lower()
        print('     created message :', created)
        print('     error shown     :', 'Could not' in after or 'required' in after.lower())

        # find the row we just made
        print('  4. click "Send" on the new row')
        rows = page.locator('div').filter(has_text='LCA-2027-UITEST')
        send_btns = page.locator('button:has-text("Send")')
        print(f'     Send buttons on the page: {send_btns.count()}')
        if send_btns.count():
            send_btns.first.click()
            time.sleep(1.5)
            shot(page, '5_send_box')
            email_box = page.locator('input[type="email"]').first
            email_box.fill('1990jonathanbbrown@gmail.com')
            time.sleep(0.5)
            shot(page, '6_email_typed')
            print('  5. click "Send now"')
            page.click('button:has-text("Send now")')
            time.sleep(12)
            shot(page, '7_sent')
            txt = page.inner_text('body')
            print('     success text    :', [l for l in txt.splitlines() if 'sent to' in l.lower() or 'sent' in l.lower()][:2])
            print('     error text      :', [l for l in txt.splitlines() if 'Could not' in l][:2])
        else:
            print('     NO Send button found ✗')

        print('  6. click "Delete" to clean up the test row')
        page.on('dialog', lambda d: d.accept())
        dels = page.locator('button:has-text("Delete")')
        print(f'     Delete buttons: {dels.count()}')
        if dels.count():
            dels.first.click()
            time.sleep(3)
            shot(page, '8_deleted')
            txt = page.inner_text('body')
            print('     removed text    :', [l for l in txt.splitlines() if 'Removed' in l][:1])
            print('     UITEST gone     :', 'LCA-2027-UITEST' not in txt)

        browser.close()
        print()
        print('  screenshots:')
        for s in SHOTS:
            print('   ', s)


if __name__ == '__main__':
    main()
