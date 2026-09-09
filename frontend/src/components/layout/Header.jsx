import Logo from '../common/Logo'
import doctorPortrait from '../../assets/stitch/doctor_portrait.png'

export default function Header() {
  return (
    <header className="sticky top-0 w-full z-40 bg-surface/85 backdrop-blur-xl border-b border-primary/10 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto h-16 md:h-20 px-4 md:px-8 flex items-center justify-between gap-4">
        {/* Left: Brand & QPU Telemetry */}
        <div className="flex items-center gap-4 min-w-0">
          <Logo className="w-8 h-8 md:w-9 md:h-9 flex-shrink-0" withText={true} />

          {/* QPU Live Heartbeat Pill */}
          <div className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-primary/15 text-on-primary-fixed-variant text-xs">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-medium tracking-tight">QPU: 16-Qubit Rigetti Sim (Online)</span>
          </div>
        </div>

        {/* Right: Actions & Clinician Profile */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          {/* Mobile QPU pulse dot */}
          <div className="inline-flex md:hidden items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container-high text-xs text-on-surface-variant">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-medium">QPU Live</span>
          </div>

          {/* Notifications Button */}
          <button
            type="button"
            aria-label="Clinical Notifications"
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error ring-2 ring-surface" />
          </button>

          {/* Clinician Profile Avatar */}
          <div className="flex items-center gap-2 pl-1 border-l border-outline-variant/30">
            <div className="relative w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden ring-1 ring-primary/30 shadow-xs bg-surface-container">
              <img
                src={doctorPortrait}
                alt="Neurologist Dr. Sophia Vance"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.parentElement.innerHTML = '<span class="material-symbols-outlined text-primary text-[22px] flex items-center justify-center h-full">account_circle</span>'
                }}
              />
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-on-surface leading-tight">Dr. S. Vance</span>
              <span className="text-[10px] text-on-surface-variant leading-tight">Neurology / QML</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
