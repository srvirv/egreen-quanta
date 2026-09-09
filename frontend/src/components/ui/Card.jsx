export default function Card({
  children,
  className = '',
  elevation = 1,
  header,
  title,
  subtitle,
  action,
  icon,
  ...props
}) {
  const elevationStyles = {
    0: 'bg-surface-container-lowest/60 border border-primary/5',
    1: 'morphic-card',
    2: 'morphic-plate',
    3: 'bg-surface-container-lowest shadow-lg border border-primary/15',
  }

  return (
    <div
      className={`rounded-2xl p-5 md:p-6 transition-all duration-200 ${elevationStyles[elevation] || elevationStyles[1]} ${className}`}
      {...props}
    >
      {(header || title || icon || action) && (
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">{icon}</span>
              </div>
            )}
            <div>
              {title && <h3 className="font-semibold text-on-surface text-base md:text-lg leading-tight">{title}</h3>}
              {subtitle && <p className="text-xs text-on-surface-variant mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
