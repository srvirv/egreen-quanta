export default function MetricTile({
  label,
  value,
  subtext,
  badge,
  icon,
  variant = 'primary',
  className = '',
}) {
  const textColors = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    error: 'text-error',
    onSurface: 'text-on-surface',
  }

  return (
    <div
      className={`bg-surface-container-lowest/90 backdrop-blur-md rounded-xl p-4 border border-primary/5 shadow-xs flex flex-col justify-between ${className}`}
    >
      <div className="flex items-center justify-between text-on-surface-variant">
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
        {icon && (
          <span className={`material-symbols-outlined text-[18px] ${textColors[variant] || 'text-primary'}`}>
            {icon}
          </span>
        )}
      </div>
      <div className="mt-2.5">
        <div className="flex items-baseline gap-1.5">
          <span className={`text-2xl md:text-3xl font-bold tracking-tight tabular-nums ${textColors[variant] || 'text-on-surface'}`}>
            {value}
          </span>
          {badge && (
            <span className={`text-xs font-semibold ${textColors[variant] || 'text-primary'}`}>
              {badge}
            </span>
          )}
        </div>
        {subtext && (
          <span className="block text-xs text-on-surface-variant mt-0.5">{subtext}</span>
        )}
      </div>
    </div>
  )
}
