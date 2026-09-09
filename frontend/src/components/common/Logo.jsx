export default function Logo({ className = "w-8 h-8", withText = false, textClassName = "" }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        fill="none"
        className={className}
        aria-label="Egreen Quanta Logo"
      >
        <defs>
          <linearGradient id="qGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#006A6B" />
            <stop offset="50%" stopColor="#00A3A6" />
            <stop offset="100%" stopColor="#4A54B2" />
          </linearGradient>
          <radialGradient id="qCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#80D4D6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#006A6B" stopOpacity="0.2" />
          </radialGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r="42"
          stroke="url(#qGrad)"
          strokeWidth="2.5"
          strokeDasharray="6 4"
          opacity="0.45"
        />
        <ellipse
          cx="50"
          cy="50"
          rx="38"
          ry="16"
          stroke="url(#qGrad)"
          strokeWidth="3"
          transform="rotate(-30 50 50)"
        />
        <ellipse
          cx="50"
          cy="50"
          rx="38"
          ry="16"
          stroke="url(#qGrad)"
          strokeWidth="3"
          transform="rotate(30 50 50)"
        />
        <ellipse
          cx="50"
          cy="50"
          rx="38"
          ry="16"
          stroke="#4A54B2"
          strokeWidth="2.5"
          transform="rotate(90 50 50)"
        />
        <circle cx="50" cy="50" r="14" fill="url(#qCore)" />
        <circle cx="50" cy="50" r="7" fill="#006A6B" />
        <circle cx="28" cy="38" r="3.5" fill="#00A3A6" />
        <circle cx="72" cy="62" r="3.5" fill="#4A54B2" />
        <circle cx="50" cy="22" r="3" fill="#80D4D6" />
      </svg>
      {withText && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`font-semibold tracking-tight text-primary text-base md:text-lg ${textClassName}`}>
              Egreen<span className="text-secondary font-bold"> Quanta</span>
            </span>
            <span className="text-outline text-xs hidden sm:inline-block">•</span>
            <span className="text-on-surface-variant text-xs hidden sm:inline-block">Clinical Hub</span>
          </div>
        </div>
      )}
    </div>
  )
}
