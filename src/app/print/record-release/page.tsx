export const metadata = {
  title: 'Student Record Release Form — Larose Christian Academy',
}

/**
 * PRINTABLE Student Record Release Form — blank, for email / mail / hand-delivery.
 *
 * 🎨 LETTERHEAD MATCHES the school's existing official documents (transcript, enrollment
 * letter, completion certificate) so this looks like it came from the same school:
 *   • crest        /lca-logo.png
 *   • wordmark     .school-name  — Larose Christian Academy
 *   • descriptor   .school-sub   — ✦ An Alabama Church School ✦
 *   • contact line .school-address — Mobile, Alabama | email | phone
 *   • serif type   'Times New Roman', Georgia, serif · letter page · 0.5in margins
 *   • print button hidden in @media print
 *
 * ⚠️ TWO TRAPS THIS PAGE ALREADY FELL INTO — don't repeat them:
 *   1. DO NOT return <html>/<head>/<body>. The root layout (src/app/layout.tsx) already
 *      renders them, so a second <html> nests inside <body>; the browser drops the inner
 *      tree and the page renders BLANK while the server still returns HTTP 200.
 *   2. DO NOT give the fill-in inputs a large `min-width`. Three of them side by side in a
 *      grid overflow past the sheet edge and the lines run off the paper. Every fill line
 *      is `flex: 1 1 auto; min-width: 0` inside a `.field` flex row instead.
 *
 * The digital version of this same request lives at /records-request — it saves straight
 * into the school's admin dashboard and links each request to the right child.
 */
export default function RecordReleasePrintPage() {
  return (
    <div className="lca-print-page">
      <style>{`
        /* Cover the site chrome so this reads as a single printed document. */
        .lca-print-page {
          position: fixed; inset: 0; overflow: auto; z-index: 50;
          background: #f5f5f5; padding: 24px 16px 60px;
        }
        body > header, body > footer { display: none !important; }

        .lca-print-page .sheet {
          font-family: 'Times New Roman', Georgia, serif;
          font-size: 11.5pt; color: #000; line-height: 1.45;
          background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,.12);
          max-width: 7.5in; margin: 0 auto; padding: 0.5in;
          overflow-wrap: break-word;
        }

        /* ── letterhead ── */
        .lca-print-page .crest { text-align: center; margin-bottom: 6px; }
        /* Tailwind's base layer makes <img> display:block, which ignores the parent's
           text-align:center — so centre the crest with auto margins explicitly. */
        .lca-print-page .crest img { display: block; margin: 0 auto; width: 88px; height: 88px; object-fit: contain; }
        .lca-print-page .school-name { text-align: center; font-size: 20pt; font-weight: bold; letter-spacing: 1px; }
        .lca-print-page .school-sub { text-align: center; font-size: 10pt; color: #555; margin-top: 2px; }
        .lca-print-page .school-address { text-align: center; font-size: 10pt; color: #555; margin-bottom: 6px; }
        .lca-print-page .rule { border-bottom: 2px solid #7a1220; margin: 10px 0 4px; }
        .lca-print-page .rule-thin { border-bottom: 1px solid #c9a227; margin-bottom: 16px; }

        .lca-print-page h1 { font-size: 14pt; text-align: center; letter-spacing: 2px; margin: 12px 0 4px; font-weight: bold; }
        .lca-print-page .subtitle { text-align: center; font-size: 10pt; color: #555; margin-bottom: 18px; }

        .lca-print-page .section { margin-bottom: 16px; break-inside: avoid; }
        .lca-print-page .section-title {
          font-size: 11pt; font-weight: bold; text-transform: uppercase;
          letter-spacing: 0.5px; border-bottom: 1px solid #999;
          padding-bottom: 3px; margin-bottom: 10px;
        }

        /* every fill-in line: label + input that shares the remaining width, never overflows */
        .lca-print-page .field { display: flex; align-items: flex-end; gap: 7px; margin-bottom: 11px; min-width: 0; }
        .lca-print-page .field > span { flex: 0 0 auto; white-space: nowrap; }
        .lca-print-page .field > input {
          flex: 1 1 auto; min-width: 0; width: 100%;
          border: none; border-bottom: 1px solid #555; background: transparent;
          font-family: inherit; font-size: 11.5pt; padding: 1px 3px;
        }
        .lca-print-page .field.right { justify-content: flex-end; }
        .lca-print-page .field.right > input { flex: 0 1 240px; }

        .lca-print-page .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0 22px; }
        .lca-print-page .grid3 { display: grid; grid-template-columns: 1.5fr 1fr 0.8fr; gap: 0 18px; }
        .lca-print-page .grid3 > .field, .lca-print-page .grid2 > .field { min-width: 0; }

        .lca-print-page .box {
          display: inline-block; width: 13px; height: 13px;
          border: 1px solid #333; margin-right: 8px; vertical-align: -2px;
        }
        .lca-print-page .checks div { margin-bottom: 7px; }

        .lca-print-page .body-text { margin: 12px 0; font-size: 10.5pt; text-align: justify; }

        .lca-print-page .signature { margin-top: 22px; break-inside: avoid; }
        .lca-print-page .sig-row { display: grid; grid-template-columns: 2fr 1fr; gap: 26px; margin-bottom: 20px; }
        .lca-print-page .sig-line { border-bottom: 1px solid #000; height: 24px; }
        .lca-print-page .sig-cap { font-size: 9.5pt; color: #444; padding-top: 3px; }

        .lca-print-page .school-use { margin-top: 22px; border: 1px solid #999; padding: 12px 14px; background: #fafafa; break-inside: avoid; }
        .lca-print-page .school-use .section-title { border-bottom: 1px solid #bbb; }

        .lca-print-page .footer {
          margin-top: 26px; font-size: 9pt; text-align: center; color: #666;
          border-top: 1px solid #ccc; padding-top: 8px;
        }

        .lca-print-page .actions { text-align: center; margin: 0 auto 18px; max-width: 7.5in; }
        .lca-print-page .actions button,
        .lca-print-page .actions a {
          display: inline-block; margin: 0 6px 8px; padding: 10px 26px; font-size: 14px;
          background: #059669; color: #fff; border: none; border-radius: 8px;
          cursor: pointer; text-decoration: none; font-family: inherit;
        }
        .lca-print-page .actions a.secondary { background: #4b5563; }

        @media print {
          body > header, body > footer { display: none !important; }
          .lca-print-page { position: static; inset: auto; padding: 0; overflow: visible; background: #fff; }
          .lca-print-page .actions { display: none; }
          .lca-print-page .sheet { box-shadow: none; max-width: none; margin: 0; padding: 0; }
          @page { margin: 0.5in; size: letter; }
        }
      `}</style>

      <div className="actions">
        <button onclick="window.print()">🖨️ Print this form</button>
        <a href="/records-request" className="secondary">Fill it out online instead</a>
      </div>

      <div className="sheet">
        {/* ── LETTERHEAD — same design as the school's other official documents ── */}
        <div className="crest">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/lca-logo.png" alt="Larose Christian Academy crest" />
        </div>
        <div className="school-name">Larose Christian Academy</div>
        <div className="school-sub">✦ An Alabama Church School ✦</div>
        <div className="school-address">
          Mobile, Alabama | larosechristianacademy@gmail.com | (251) 201-9991
        </div>
        <div className="rule" />
        <div className="rule-thin" />

        <h1>STUDENT RECORD RELEASE FORM</h1>
        <div className="subtitle">Authorization to Release Student Records</div>

        {/* No fax line — Jonathan, 2026-09-10: "There should not be a fax number,
            only mom's school number." The school's contact is its phone. */}
        <div className="field right">
          <span>Return to:</span>
          <strong style={{ marginLeft: 6 }}>Larose Christian Academy · (251) 201-9991</strong>
        </div>

        {/* ── REQUESTING PARTY ── */}
        <div className="section">
          <div className="section-title">Requesting Party</div>
          <div className="grid2">
            <div className="field"><span>Name:</span><input aria-label="Requesting party name" /></div>
            <div className="field"><span>Date:</span><input aria-label="Date" /></div>
          </div>
          <div className="grid2">
            <div className="field"><span>School / District:</span><input aria-label="School or district" /></div>
            <div className="field"><span>Phone:</span><input aria-label="Phone" /></div>
          </div>
          <div className="field"><span>Email:</span><input aria-label="Email" /></div>
          <div className="grid3">
            <div className="field"><span>Street:</span><input aria-label="Street" /></div>
            <div className="field"><span>City:</span><input aria-label="City" /></div>
            <div className="field"><span>State / ZIP:</span><input aria-label="State and ZIP" /></div>
          </div>
        </div>

        {/* ── STUDENTS ── */}
        <div className="section">
          <div className="section-title">Student Information</div>
          {[0, 1, 2, 3].map((n) => (
            <div className="grid3" key={n}>
              <div className="field">
                <span>{n === 0 ? 'Student name:' : ' '}</span>
                <input aria-label={`Student ${n + 1} name`} />
              </div>
              <div className="field"><span>Date of birth:</span><input aria-label={`Student ${n + 1} date of birth`} /></div>
              <div className="field"><span>Grade:</span><input aria-label={`Student ${n + 1} grade`} /></div>
            </div>
          ))}
          <p style={{ fontSize: '9.5pt', color: '#444', marginTop: '2px', fontStyle: 'italic' }}>
            More than 4 students? Attach a second sheet with the same name, date of birth and grade
            for each additional child — or submit this request online and add as many as you need.
          </p>
        </div>

        {/* ── RECORDS REQUESTED ── */}
        <div className="section">
          <div className="section-title">Records Requested</div>
          <div className="checks">
            <div><span className="box" /> Official academic transcript</div>
            <div><span className="box" /> Report cards</div>
            <div><span className="box" /> Immunization records</div>
            <div><span className="box" /> Attendance records</div>
            <div><span className="box" /> Diploma / graduation verification</div>
            <div><span className="box" /> Enrollment verification letter</div>
            <div><span className="box" /> Other:</div>
          </div>
        </div>

        {/* ── AUTHORIZATION ── */}
        <div className="section">
          <div className="section-title">Authorization</div>
          <p className="body-text">
            I hereby authorize Larose Christian Academy to release the records indicated above for
            the student(s) named on this form. I understand these records are confidential and are
            being released at my request, and I release Larose Christian Academy and its staff from
            any liability arising from this release of information. This authorization is valid for
            one year from the date signed below unless otherwise stated.
          </p>
          <div className="signature">
            <div className="sig-row">
              <div>
                <div className="sig-line" />
                <div className="sig-cap">Signature of Parent / Guardian (or authorized requester)</div>
              </div>
              <div>
                <div className="sig-line" />
                <div className="sig-cap">Date</div>
              </div>
            </div>
            <div className="sig-row">
              <div>
                <div className="sig-line" />
                <div className="sig-cap">Printed Name</div>
              </div>
              <div>
                <div className="sig-line" />
                <div className="sig-cap">Relationship to Student</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SCHOOL USE ONLY ── */}
        <div className="school-use">
          <div className="section-title">School Use Only</div>
          <div className="grid2">
            <div className="field"><span>Date received:</span><input aria-label="Date received" /></div>
            <div className="field"><span>Records sent:</span><input aria-label="Records sent" /></div>
          </div>
          <div className="field">
            <span>Method:</span>
            <span style={{ whiteSpace: 'nowrap' }}>
              <span className="box" /> Email&nbsp;&nbsp;
              <span className="box" /> Mail&nbsp;&nbsp;
              <span className="box" /> Picked up
            </span>
          </div>
          <div className="sig-row" style={{ marginTop: 14 }}>
            <div>
              <div className="sig-line" />
              <div className="sig-cap">School Administrator Signature</div>
            </div>
            <div>
              <div className="sig-line" />
              <div className="sig-cap">Date</div>
            </div>
          </div>
        </div>

        <div className="footer">
          Larose Christian Academy • Mobile, AL • larosechristianacademy@gmail.com • (251) 201-9991<br />
          An Alabama church school — covering homeschool families since 2024
        </div>
      </div>
    </div>
  )
}
