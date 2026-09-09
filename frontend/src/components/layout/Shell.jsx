import Header from './Header'
import Navigation from './Navigation'

export default function Shell({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Header />
      <Navigation />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8 pb-24 md:pb-12">
        {children}
      </main>
      <footer className="w-full border-t border-primary/10 py-6 text-center text-xs text-on-surface-variant hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <span>© 2026 Egreen Quanta — Quantum Machine Learning for Early Disease Detection</span>
          <span className="inline-flex items-center gap-1 text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            QML Research Simulator • Experimental
          </span>
        </div>
      </footer>
    </div>
  )
}
