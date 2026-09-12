# -*- coding: utf-8 -*-
"""Email the sample diplomas from the SCHOOL address so they can be compared side by side.

Sends exactly what the dashboard's Send does: the school address (SMTP_USER), the school display
name, and the PDFs the real builder produced. Attaches all of them to ONE message so they are easy
to open and flip between — this is for review, not a simulation of what a family receives.

Reads the SMTP details from the site's .env.local. Never prints the password.
"""
import json
import os
import smtplib
import ssl
import sys
from email.message import EmailMessage
from email.utils import formatdate, make_msgid

ROOT = r"C:\Users\1990j\lca-site"
SAMPLES = os.path.join(os.environ['LOCALAPPDATA'], 'Temp', 'diploma_samples')
TO = sys.argv[1] if len(sys.argv) > 1 else '1990jonathanbbrown@gmail.com'


def load_env():
    env = {}
    with open(os.path.join(ROOT, '.env.local'), encoding='utf-8', errors='replace') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#') or '=' not in line:
                continue
            k, v = line.split('=', 1)
            env[k.strip()] = v.strip().strip('"')
    return env


def main():
    env = load_env()
    host = env.get('SMTP_HOST', 'smtp.gmail.com')
    port = int(env.get('SMTP_PORT', '587'))
    user = env['SMTP_USER']
    pw = env['SMTP_PASS']
    from_display = env.get('SMTP_FROM', '').split('<')[0].strip().strip('"') or 'Larose Christian Academy'

    manifest = json.load(open(os.path.join(SAMPLES, 'manifest.json'), encoding='utf-8'))
    print(f'  from: "{from_display}" <{user}>')
    print(f'  to  : {TO}')
    print(f'  {len(manifest)} certificate(s):')
    for m in manifest:
        print(f"    {os.path.basename(m['file'])}   {m['name']}  {m['date']}")

    msg = EmailMessage()
    msg['From'] = f'{from_display} <{user}>'
    msg['To'] = TO
    msg['Subject'] = 'Diploma samples — 5 names to compare'
    msg['Date'] = formatdate(localtime=True)
    msg['Message-ID'] = make_msgid(domain='laroseca.org')

    lines = [
        'Five diplomas, same certificate, different names and dates.',
        '',
        'Every one is 9 x 7 inches and is built by the same code the dashboard uses, with the same',
        'arguments — nothing is special-cased for these. The only things that should differ are the',
        'name and the date.',
        '',
        'Included on purpose: your own name (to compare against the one you already have), a long',
        'name that has to step down in size, a hyphen, an apostrophe, and a middle name.',
        '',
        'The numbers say SAMPLE so they can never be mistaken for real records.',
        '',
    ]
    for i, m in enumerate(manifest, 1):
        lines.append(f"  {i}. {m['name']}  —  {m['date']}")
    lines += [
        '',
        'Open them and flip between them: everything except the name and date should be identical',
        'in position, size and font.',
        '',
        '— The Larose Christian Academy office',
    ]
    msg.set_content('\n'.join(lines))

    for m in manifest:
        with open(m['file'], 'rb') as f:
            msg.add_attachment(f.read(), maintype='application', subtype='pdf',
                               filename=os.path.basename(m['file']))
    print('  attached all.')

    ctx = ssl.create_default_context()
    with smtplib.SMTP(host, port, timeout=90) as s:
        s.starttls(context=ctx)
        s.login(user, pw)
        s.send_message(msg)
    print(f'  SENT via {host}:{port}')


if __name__ == '__main__':
    main()
