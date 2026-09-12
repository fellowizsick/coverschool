'use client'

/**
 * The diploma's print button, as a Client Component.
 *
 * WHY THIS IS ITS OWN FILE (2026-09-11)
 * The diploma page is a React Server Component. It had `<button onClick={() => window.print()}>`
 * inline — and a server component cannot pass an event handler to a client component prop.
 * The server threw:
 *
 *     Error: Event handlers cannot be passed to Client Component props.
 *
 * ...which surfaced as HTTP 500 on the live site. It hid for the life of the project because
 * zero diplomas had ever been issued, so the page had never rendered past its guard clauses.
 * Found by rendering a throwaway diploma and reading the server log.
 */
export default function PrintButton({ fontFamily, label, inline }: { fontFamily?: string; label?: string; inline?: boolean }) {
  return (
    <button
      onClick={() => window.print()}
      className="no-print"
      style={{
        ...(inline ? {} : { position: 'fixed', bottom: '24px', right: '24px' }),
        background: '#059669',
        color: '#fff',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '10px',
        fontSize: '15px',
        cursor: 'pointer',
        fontFamily: fontFamily || 'inherit',
        boxShadow: '0 8px 24px rgba(0,0,0,.3)',
      }}
    >
      {label || '🖨️ Print Diploma'}
    </button>
  )
}
