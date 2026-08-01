'use client'

/** Friendly fallback if the admin dashboard ever throws. */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-12 text-center">
      <div className="text-4xl">😕</div>
      <h1 className="mt-4 text-xl font-bold text-gray-900">Something went wrong</h1>
      <p className="mt-2 max-w-md text-sm text-gray-600">
        The dashboard hit an unexpected error. Please try again — if it keeps
        happening, contact support.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700"
      >
        Try Again
      </button>
    </div>
  )
}
