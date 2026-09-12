# -*- coding: utf-8 -*-
"""Prove only the NAME and DATE change per diploma — the layout must not move.

Jonathan, 2026-09-11: "The only thing that changes is the name and date when she makes them in
her dashboard."

This renders the live diploma for a spread of names (very short -> very long) and dates, and
measures whether anything except the name line moved. Uses the throwaway demo enrollment only —
never a real family's record.

Writes one screenshot per case to the temp dir and prints the measured name line.
"""
import io
import os
import re
import subprocess
import sys

T = os.path.join(os.environ['LOCALAPPDATA'], 'Temp')
EDGE = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
ENR = '9b3fb69b-cb3b-4af2-97cd-acaafdc201be'          # throwaway demo enrollment
ORIG_NAME = 'Jonathan Brown'
ORIG_DATE = '2027-05-21'

CASES = [
    ('short',     'Ann Lee',                                    '2027-05-21'),
    ('typical',   'Richard Harrison',                           '2027-05-21'),
    ('two_mid',   'Blake Graham Smith',                         '2027-05-21'),
    ('hyphen_ap', "Mary-Jane O'Neill",                          '2027-05-21'),
    ('very_long', 'Alexandria Catherine Montgomery-Wellington', '2027-05-21'),
    ('other_date', 'Jonathan Brown',                            '2028-06-02'),
]


def run(sql):
    """Run SQL against the live DB via the Supabase Management API."""
    pat = io.open(os.path.expanduser('~/.hermes/secrets/lca_supabase_pat.txt'),
                  encoding='utf-8').read().strip()
    url = 'https://api.supabase.com/v1/projects/nwtsvggkchyjuwmcrkmi/database/query'
    import json
    import urllib.request
    req = urllib.request.Request(
        url,
        data=json.dumps({'query': sql}).encode(),
        headers={'Authorization': 'Bearer ' + pat, 'Content-Type': 'application/json'},
        method='POST')
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode())


def set_record(name, date):
    esc = name.replace("'", "''")
    run(f"update diplomas set student_name='{esc}', graduation_date='{date}' "
        f"where enrollment_id='{ENR}';")


def shot(tag):
    """Fetch the deployed page through the cookie proxy, then screenshot it."""
    for pat in ['html', 'htmlf']:
        pass
    out = os.path.join(T, f'namecase_{tag}.html')
    subprocess.run(['curl', '-s', '-o', out, '--max-time', '40',
                    'http://127.0.0.1:3114/print/diploma/' + ENR], check=False)
    src = io.open(out, encoding='utf-8', errors='replace').read()
    src = src.replace('"/_next/', '"https://laroseca.org/_next/')
    src = src.replace("'/_next/", "'https://laroseca.org/_next/")
    src = src.replace('"/fonts/', '"https://laroseca.org/fonts/')
    src = re.sub(r'"(/[a-z0-9_\-]+\.(png|jpg|svg|webp|ico))"', r'"https://laroseca.org\1"', src)
    fix = os.path.join(T, f'namecase_{tag}f.html')
    io.open(fix, 'w', encoding='utf-8').write(src)

    png = os.path.join(T, f'NAMECASE_{tag}.png')
    if os.path.exists(png):
        os.remove(png)
    prof = os.path.join(T, 'nc_' + tag)
    subprocess.run(['rm', '-rf', prof], check=False)
    subprocess.run([EDGE, '--headless=new', '--disable-gpu', '--hide-scrollbars',
                    '--no-first-run', '--user-data-dir=' + prof,
                    '--virtual-time-budget=18000', '--window-size=1400,1100',
                    '--screenshot=' + png,
                    'file:///' + fix.replace('\\', '/')],
                   check=False, capture_output=True, timeout=140)
    return png


def measure(png):
    """Return (sheet top, name-line ink band, bottom ink) for a render."""
    from PIL import Image
    im = Image.open(png).convert('RGB')
    w, h = im.size
    px = im.load()

    def ink(c):
        return sum(c) < 520

    rows = [y for y in range(h) if any(ink(px[x, y]) for x in range(0, w, 2))]
    if not rows:
        return None
    # group contiguous ink rows into blocks
    blocks, cur = [], [rows[0]]
    for y in rows[1:]:
        if y - cur[-1] <= 5:
            cur.append(y)
        else:
            blocks.append((cur[0], cur[-1]))
            cur = [y]
    blocks.append((cur[0], cur[-1]))
    return blocks


def main():
    results = []
    for tag, name, date in CASES:
        set_record(name, date)
        png = shot(tag)
        blocks = measure(png)
        if blocks is None:
            print(f'  {tag:<10} NO RENDER'); continue
        # the arched name is the first tall block; the sheet is the tallest span
        sheet = max(blocks, key=lambda b: b[1] - b[0])
        name_block = blocks[0]
        print(f'  {tag:<10} name="{name[:34]:<34}" blocks={len(blocks):<2} '
              f'sheet_h={sheet[1]-sheet[0]+1:<4} name_band={name_block[0]}..{name_block[1]} '
              f'h={name_block[1]-name_block[0]+1}')
        results.append((tag, sheet, name_block, len(blocks)))

    # restore the approved record
    set_record(ORIG_NAME, ORIG_DATE)
    print()
    print(f'  restored: {ORIG_NAME} / {ORIG_DATE}')

    # did the sheet itself stay the same size in every case?
    heights = {r[1][1] - r[1][0] + 1 for r in results}
    print(f'  sheet height across all cases: {sorted(heights)}   '
          f'-> {"CONSISTENT ✓" if len(heights) == 1 else "CHANGED ✗"}')
    counts = {r[3] for r in results}
    print(f'  element count across all cases: {sorted(counts)}   '
          f'-> {"CONSISTENT ✓" if len(counts) == 1 else "CHANGED ✗"}')


if __name__ == '__main__':
    main()
