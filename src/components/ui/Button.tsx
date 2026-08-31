import { cn } from '@/lib/utils'
import { forwardRef, type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'fun' | 'pink' | 'purple' | 'sky'
  size?: 'sm' | 'md' | 'lg'
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-emerald-700 text-white shadow-lg shadow-emerald-900/25 hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-900/35 hover:-translate-y-0.5 active:translate-y-0',
  secondary:
    'bg-gradient-to-r from-gray-800 to-gray-700 text-white shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30 hover:-translate-y-0.5',
  outline:
    'border-2 border-emerald-200 bg-white/80 text-emerald-800 shadow-sm backdrop-blur-sm hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-md hover:-translate-y-0.5',
  ghost:
    'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/50',
  gold:
    'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-amber-950 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0 hover:animate-wobble',
  fun:
    'bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-400 text-white shadow-lg shadow-emerald-900/20 hover:shadow-xl hover:shadow-emerald-900/30 hover:-translate-y-0.5 active:translate-y-0 animate-gradient',
  pink:
    'bg-gradient-to-r from-emerald-700 to-emerald-600 text-white shadow-lg shadow-emerald-900/25 hover:shadow-xl hover:shadow-emerald-900/35 hover:-translate-y-0.5 active:translate-y-0',
  purple:
    'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/25 hover:shadow-xl hover:shadow-emerald-900/35 hover:-translate-y-0.5 active:translate-y-0',
  sky:
    'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-emerald-900/25 hover:shadow-xl hover:shadow-emerald-900/35 hover:-translate-y-0.5 active:translate-y-0',
}

const sizeStyles = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-8 text-base',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'group relative inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        <span className="relative z-10 inline-flex items-center gap-1.5">
          {children}
        </span>
        {/* Shimmer effect for primary/gold/fun */}
        {(variant === 'primary' || variant === 'gold' || variant === 'fun') && (
          <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="absolute inset-0 rounded-xl animate-shimmer" />
          </span>
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, type ButtonProps }
