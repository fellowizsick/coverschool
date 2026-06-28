import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function EnrollSuccessPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
        <CheckCircle className="h-10 w-10 text-emerald-600" />
      </div>
      <h1 className="mt-6 text-3xl font-bold text-gray-900">
        Welcome to Larose Christian Academy!
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Your payment was successful and your enrollment has been approved.
        You&apos;ll receive a confirmation email shortly with next steps.
      </p>
      <div className="mt-8">
        <Link href="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    </div>
  )
}
