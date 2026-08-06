# Delete the 2 Problem Center TEST emails from the school inbox.
# Match purely on the reporter address in the body (subject is Q-encoded).
import imaplib, email, socket

raw = open('.env.local', 'rb').read().decode('utf-8', 'ignore')
app_pw = ''
for line in raw.split('\n'):
    if line.startswith('SMTP_PASS='):
        app_pw = line.split('=', 1)[1].strip()

socket.setdefaulttimeout(40)
m = imaplib.IMAP4_SSL('imap.gmail.com', 993)
m.login('larosechristianacademy@gmail.com', app_pw)
m.select('INBOX')
typ, data = m.search(None, 'ALL')
ids = data[0].split()
DELETED_FLAG = '\\Deleted'

deleted = 0
for mid in ids:
    typ, msg_data = m.fetch(mid, '(RFC822)')
    msg = email.message_from_bytes(msg_data[0][1])
    body = ''
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == 'text/plain':
                body = part.get_payload(decode=True).decode('utf-8', 'ignore')
                break
    else:
        body = msg.get_payload(decode=True).decode('utf-8', 'ignore')
    if 'problem-center-test@example.com' in body:
        m.store(mid, '+FLAGS', DELETED_FLAG)
        deleted += 1
        print('flagged:', mid.decode(), '|', (msg.get('Subject', '') or '')[:60])

if deleted:
    m.expunge()
    print('EXPUNGED', deleted, 'test emails')
else:
    print('no test emails found')

m.logout()

m2 = imaplib.IMAP4_SSL('imap.gmail.com', 993)
m2.login('larosechristianacademy@gmail.com', app_pw)
m2.select('INBOX')
typ, data = m2.search(None, 'ALL')
print('inbox now:', len(data[0].split()), 'messages')
m2.logout()
print('DONE')
