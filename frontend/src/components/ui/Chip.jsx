export default function Chip({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  pulse = false,
  active = false,
  onClick,
  className = '',
}) {
  const isInteractive = typeof onClick === 'function'

  const variantStyles = {
    healthy:
      'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    mci:
      'bg-amber-50 text-amber-800 border border-amber-300/60',
    risk:
      'bg-error-container text-on-error-container border border-error/20 font-semibold',
    primary:
      'bg-primary/10 text-primary border border-primary/20',
    secondary:
      'bg-secondary-fixed text-on-secondary-fixed-variant border border-secondary/15',
    neutral:
      'bg-surface-container-high text-on-surface-variant border border-outline-variant/30',
    filter: active
      ? 'bg-primary text-white border-primary shadow-xs'
      : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface border border-outline-variant/20',
  }

  const sizeStyles = {
    sm: 'text-[11px] h-6 px-2 gap-1',
    md: 'text-xs h-7 px-2.5 gap-1.5',
    lg: 'text-sm h-8 px-3.5 gap-2',
  }

  const dotColors = {
    healthy: 'bg-emerald-600',
    mci: 'bg-amber-500',
    risk: 'bg-error',
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    neutral: 'bg-outline',
  }

  return (
    <span
      onClick={onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      className={`inline-flex items-center rounded-full font-medium transition-all ${isInteractive ? 'cursor-pointer select-none active:scale-95' : ''} ${variantStyles[variant] || variantStyles.neutral} ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      {pulse && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || 'bg-primary'} animate-pulse`} />
      )}
      {!pulse && icon && (
        <span className="material-symbols-outlined text-[14px]">{icon}</span>
      )}
      <span>{children}</span>
    </span>
  )
}
