'use client'

/** TEMP DEBUG — capture the dashboard crash error. */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="p-8">
      <h1 className="text-xl font-bold text-red-600">DASHBOARD ERROR</h1>
      <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-gray-100 p-4 text-sm">
        {error.message}
        {'\n\n'}
        {error.stack}
        {'\n\ndigest: '}
        {error.digest}
      </pre>
      <button onClick={reset} className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-white">
        Try again
      </button>
    </div>
  )
}
