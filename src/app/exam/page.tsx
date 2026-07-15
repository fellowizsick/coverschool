import { GraduationCap } from 'lucide-react'

// NOTE: The full diploma exam (page.diploma.tsx) is disabled pending
// Larose Christian Academy's accreditation. Re-enable by renaming
// page.diploma.tsx -> page.tsx and adjusting the copy below once
// accreditation is obtained. For now this is a flashy "Coming Soon" teaser.

export const dynamic = 'force-static'

export default function AdultDiplomaComingSoon() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950">
      <style>{`
        @keyframes flashText {
          0%   { color: #34d399; text-shadow: 0 0 24px #34d399, 0 0 48px #10b981; }
          25%  { color: #fbbf24; text-shadow: 0 0 24px #fbbf24, 0 0 48px #f59e0b; }
          50%  { color: #38bdf8; text-shadow: 0 0 24px #38bdf8, 0 0 48px #0ea5e9; }
          75%  { color: #f472b6; text-shadow: 0 0 24px #f472b6, 0 0 48px #ec4899; }
          100% { color: #34d399; text-shadow: 0 0 24px #34d399, 0 0 48px #10b981; }
        }
        @keyframes flashBorder {
          0%   { border-color: #34d399; box-shadow: 0 0 30px #10b98188, inset 0 0 30px #10b98144; }
          25%  { border-color: #fbbf24; box-shadow: 0 0 30px #f59e0b88, inset 0 0 30px #f59e0b44; }
          50%  { border-color: #38bdf8; box-shadow: 0 0 30px #0ea5e988, inset 0 0 30px #0ea5e944; }
          75%  { border-color: #f472b6; box-shadow: 0 0 30px #ec489988, inset 0 0 30px #ec489944; }
          100% { border-color: #34d399; box-shadow: 0 0 30px #10b98188, inset 0 0 30px #10b98144; }
        }
        @keyframes flashBg {
          0%, 100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        .flash-text  { animation: flashText 2.4s infinite ease-in-out; }
        .flash-card  { animation: flashBorder 2.4s infinite ease-in-out; }
        .flash-bg    { background: linear-gradient(120deg,#064e3b,#1e1b4b,#0c4a6e,#3b0764,#064e3b);
                       background-size: 400% 400%; animation: flashBg 8s infinite ease-in-out; }
        @media (prefers-reduced-motion: reduce) {
          .flash-text, .flash-card, .flash-bg { animation-duration: 6s; }
        }
      `}</style>

      <div className="flash-bg absolute inset-0" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="flash-card rounded-3xl border-4 bg-slate-900/70 px-8 py-12 backdrop-blur-sm sm:px-16">
          <div className="mb-6 flex items-center justify-center gap-3">
            <GraduationCap className="h-10 w-10 text-emerald-400" />
            <span className="text-lg font-bold uppercase tracking-widest text-emerald-300">
              Larose Christian Academy
            </span>
          </div>

          <h1 className="font-heading text-3xl font-black text-white sm:text-5xl">
            Adult Diploma Program
          </h1>

          <p className="mt-4 text-base text-slate-300 sm:text-lg">
            Earn your high school diploma — built for adults who need a second chance.
          </p>

          <div className="mt-10">
            <span className="flash-text text-6xl font-black tracking-tight sm:text-8xl">
              COMING SOON
            </span>
          </div>

          <p className="mt-10 max-w-md text-sm text-slate-400">
            We&apos;re finalizing the program alongside our official accreditation.
            Check back soon — and contact the academy to be notified the moment it opens.
          </p>

          <a
            href="/contact"
            className="mt-8 inline-block rounded-full bg-emerald-500 px-8 py-3 text-base font-bold text-white transition hover:bg-emerald-400"
          >
            Get Notified
          </a>
        </div>

        <p className="mt-8 text-xs text-slate-500">
          📋 Program launches pending accreditation.
        </p>
      </div>
    </main>
  )
}
