import { cn } from '@/lib/utils'
import { forwardRef, type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'group relative inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-gradient-to-r from-emerald-700 to-emerald-600 text-white shadow-lg shadow-emerald-900/20 hover:shadow-xl hover:shadow-emerald-900/30 hover:-translate-y-0.5 active:translate-y-0':
              variant === 'primary',
            'bg-gradient-to-r from-gray-800 to-gray-700 text-white shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30 hover:-translate-y-0.5':
              variant === 'secondary',
            'border-2 border-emerald-200 bg-white/80 text-emerald-800 shadow-sm backdrop-blur-sm hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-md hover:-translate-y-0.5':
              variant === 'outline',
            'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/50':
              variant === 'ghost',
            'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-amber-950 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0':
              variant === 'gold',
          },
          {
            'h-9 px-4 text-sm': size === 'sm',
            'h-11 px-5 text-sm': size === 'md',
            'h-13 px-8 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, type ButtonProps }
