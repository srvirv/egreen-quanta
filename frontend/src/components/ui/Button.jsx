export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer'

  const variantStyles = {
    primary:
      'bg-primary text-white shadow-sm hover:bg-primary-container active:bg-primary',
    secondary:
      'bg-secondary text-white shadow-sm hover:opacity-90 active:opacity-100',
    tonal:
      'bg-secondary-fixed text-on-secondary-fixed-variant hover:bg-secondary-fixed/80',
    outlined:
      'border border-primary/30 text-primary hover:bg-primary/5 active:bg-primary/10',
    danger:
      'bg-error text-white hover:bg-error/90',
    ghost:
      'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low',
    white:
      'bg-white text-primary shadow-sm hover:bg-surface-container-lowest',
  }

  const sizeStyles = {
    sm: 'text-xs h-8 px-3 gap-1.5',
    md: 'text-sm h-10 px-4 gap-2',
    lg: 'text-base h-12 px-6 gap-2.5',
    icon: 'h-10 w-10 p-0',
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      )}
    </button>
  )
}
