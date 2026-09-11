import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  {
    to: '/clinical',
    label: 'Clinical Hub',
    icon: 'neurology',
    badge: null,
  },
  {
    to: '/benchmarks',
    label: 'Benchmarks',
    icon: 'compare_arrows',
    badge: 'SIH PS',
  },
  {
    to: '/circuit',
    label: 'Circuit',
    icon: 'memory',
    badge: '4-Q',
  },
  {
    to: '/explainability',
    label: 'Explainability',
    icon: 'insights',
    badge: null,
  },
]

export default function Navigation() {
  return (
    <>
      {/* Desktop Sub-Header Navigation Bar */}
      <nav aria-label="Desktop Primary Navigation" className="hidden md:block w-full bg-surface border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center gap-1 h-12">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-tight transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60'
                }`
              }
            >
              <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-inherit font-medium">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Mobile Fixed Bottom Dock per Stitch design specs */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 w-full z-50 md:hidden bg-surface/90 backdrop-blur-2xl border-t border-primary/10 shadow-[0_-2px_12px_rgba(0,48,49,0.05)] pb-safe"
      >
        <div className="flex justify-around items-center h-16 px-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group flex flex-col items-center justify-center min-w-[64px] min-h-[44px] py-1 transition-all ${
                  isActive
                    ? 'text-primary font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`relative flex items-center justify-center px-4 py-0.5 rounded-full transition-all duration-200 mb-0.5 ${
                      isActive ? 'bg-primary-fixed-dim/40 scale-100' : 'opacity-0 scale-90'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[22px] ${isActive ? 'font-bold' : ''}`}>
                      {item.icon}
                    </span>
                  </div>
                  <span className="text-[11px] tracking-tight">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  )
}
