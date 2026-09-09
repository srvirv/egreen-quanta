export default function SegmentedBar({
  segments = [
    { label: 'Normal', percentage: 12, color: 'bg-primary-fixed-dim', textColor: 'text-primary' },
    { label: 'MCI Amnestic', percentage: 71, color: 'bg-secondary', textColor: 'text-secondary', active: true },
    { label: 'Early AD', percentage: 17, color: 'bg-error', textColor: 'text-error' },
  ],
  title = 'Tri-Class QML Projection',
  leadingTag = 'MCI Amnestic (71%)',
  className = '',
}) {
  return (
    <div className={`flex flex-col gap-2 bg-surface-container-low/80 p-3.5 rounded-xl border border-primary/5 ${className}`}>
      {(title || leadingTag) && (
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-on-surface-variant">{title}</span>
          {leadingTag && <span className="text-primary font-semibold">{leadingTag}</span>}
        </div>
      )}

      {/* Segmented bar track */}
      <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden flex shadow-inner">
        {segments.map((segment, idx) => (
          <div
            key={idx}
            className={`h-full ${segment.color} transition-all duration-500`}
            style={{ width: `${segment.percentage}%` }}
            title={`${segment.label}: ${segment.percentage}%`}
          />
        ))}
      </div>

      {/* Legend list */}
      <div className="flex items-center justify-between text-on-surface-variant text-xs pt-1 flex-wrap gap-2">
        {segments.map((segment, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-1.5 ${segment.active ? `font-semibold ${segment.textColor || 'text-primary'}` : ''}`}
          >
            <span className={`w-2 h-2 rounded-full ${segment.color}`} />
            <span className="tabular-nums">
              {segment.label} {segment.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
