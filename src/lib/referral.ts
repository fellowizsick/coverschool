// Shared referral-code helpers (2026-08-18): codes are ONLY issued AFTER a
// family pays — never at enrollment submission (Jonathan directive).

// Generate a short, unique, human-friendly referral code like LCA-K7X2Q
export function generateReferralCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no 0/O/1/I
  let code = ''
  for (let i = 0; i < 5; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return `LCA-${code}`
}
