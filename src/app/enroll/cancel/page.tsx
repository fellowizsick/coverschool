import { XCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function EnrollCancelPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <XCircle className="h-10 w-10 text-red-600" />
      </div>
      <h1 className="mt-6 text-3xl font-bold text-gray-900">
        Payment Cancelled
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Your payment was cancelled. Your enrollment has been saved as pending.
        You can come back anytime to complete the payment.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/enroll">
          <Button>Try Again</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">Return Home</Button>
        </Link>
      </div>
    </div>
  )
}
