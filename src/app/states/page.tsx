import { Card, CardContent } from '@/components/ui/Card'
import { ALL_STATES, COVERED_STATES, SCHOOL_CONFIG } from '@/lib/constants'
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'

const statusIcons = {
  available: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  limited: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
  unavailable: { icon: XCircle, color: 'text-gray-300', bg: 'bg-gray-50' },
} as const

export default function StatesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        States We Serve
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        {SCHOOL_CONFIG.name} currently serves families in the following states. We are
        actively expanding our coverage.
      </p>

      {/* Available States */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">
          Available ({COVERED_STATES.length})
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {COVERED_STATES.map((state) => (
            <div
              key={state.code}
              className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50/50 p-4"
            >
              <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
              <div>
                <span className="font-semibold text-gray-900">
                  {state.code} — {state.name}
                </span>
                {state.notes && (
                  <p className="mt-1 text-sm text-gray-600">{state.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Note */}
      <Card className="mt-12 border-amber-200 bg-amber-50">
        <CardContent className="flex items-start gap-3 p-6">
          <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold">Important Legal Note</p>
            <p className="mt-1">
              While {SCHOOL_CONFIG.name} (an Alabama church school) can enroll families
              from any state, whether your specific state recognizes this arrangement
              depends on that state&apos;s homeschool laws. We recommend checking with
              HSLDA or a local attorney if you have questions about your state&apos;s
              requirements. States marked as &quot;Unavailable&quot; either require in-state
              school oversight or have additional requirements we cannot currently meet.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* All States */}
      <div className="mt-12">
        <h2 className="text-lg font-semibold text-gray-900">Full State Map</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {ALL_STATES.map((state) => {
            const { icon: Icon, color, bg } = statusIcons[state.status]
            return (
              <div
                key={state.code}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${bg}`}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 ${color}`} />
                <span className="font-medium text-gray-900">{state.code}</span>
                <span className="text-gray-600">{state.name}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
