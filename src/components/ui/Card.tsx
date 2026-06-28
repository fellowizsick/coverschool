import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'group relative rounded-2xl border border-gray-100 bg-white shadow-sm shadow-emerald-900/5 transition-all duration-500 hover:shadow-xl hover:shadow-emerald-900/10 hover:-translate-y-1',
        className
      )}
      {...props}
    />
  )
}

function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
}

function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'text-xl font-semibold leading-none tracking-tight font-heading',
        className
      )}
      {...props}
    />
  )
}

function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-gray-500 leading-relaxed', className)} {...props} />
  )
}

function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pt-0', className)} {...props} />
}

function CardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
