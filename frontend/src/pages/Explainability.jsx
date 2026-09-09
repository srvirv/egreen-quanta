import { useState } from 'react'
import Card from '../components/ui/Card'
import Chip from '../components/ui/Chip'

export default function Explainability() {
  const [activeSlice, setActiveSlice] = useState('coronal')

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Header & Subtitle */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Chip variant="secondary" icon="psychology_alt">
            SIH Gap 5 Verified
          </Chip>
          <Chip variant="neutral">
            Patient #EQ-8841-B
          </Chip>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
          Clinical Explainability & Neuro-Attribution
        </h1>
        <p className="text-sm text-on-surface-variant">
          Translating Quantum Expectation Values into Anatomical Risk Factors & Salience Tomography.
        </p>
      </section>

      {/* Anatomical Attention Heatmap Card */}
      <Card
        elevation={2}
        title="Anatomical Salience Tomography"
        subtitle="Hybrid Q-Kernel Cross-Attention Weights"
        icon="neurology"
        action={
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-container-low text-primary">
            Coherence: 99.4%
          </span>
        }
      >
        {/* Slice Toggle Controls */}
        <div className="grid grid-cols-2 p-1 bg-surface-container-low rounded-full max-w-xs mb-4">
          <button
            type="button"
            onClick={() => setActiveSlice('coronal')}
            className={`py-1.5 text-center text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSlice === 'coronal'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">view_agenda</span>
            <span>Coronal T1w</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSlice('sagittal')}
            className={`py-1.5 text-center text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSlice === 'sagittal'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">view_column</span>
            <span>Sagittal T1w</span>
          </button>
        </div>

        {/* Brain Visual Slice Heatmap Placeholder */}
        <div className="relative rounded-xl overflow-hidden bg-slate-950 h-56 flex items-center justify-center border border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(75,85,179,0.3)_0,rgba(15,23,42,0.95)_70%)]" />
          
          <div className="relative z-10 flex flex-col items-center text-center p-4">
            <span className="material-symbols-outlined text-[48px] text-tertiary-fixed mb-2">
              insights
            </span>
            <span className="text-sm font-semibold text-white">
              {activeSlice === 'coronal' ? 'Coronal View — Bilateral Hippocampal Focus' : 'Sagittal View — Posterior Cingulate & Precuneus'}
            </span>
            <span className="text-xs text-slate-400 mt-1 max-w-md">
              Higher salience concentrations (orange-crimson contour) indicate quantum features identifying early structural atrophy.
            </span>
          </div>

          <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/60 px-3 py-1 rounded-full text-xs text-white backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
            <span>Peak Q-Attention: Hippocampus (Left) 0.842</span>
          </div>
        </div>
      </Card>

      {/* Salience Attribution Breakdown Table */}
      <Card
        title="Regional Neuro-Attribution Ranking"
        subtitle="Ranked by Integrated Gradients on Quantum Kernel Embedding"
        icon="format_list_numbered"
        elevation={1}
      >
        <div className="divide-y divide-primary/5 text-xs">
          <div className="flex items-center justify-between py-2.5 font-semibold text-on-surface">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-error" />
              Left Hippocampus (Cornu Ammonis)
            </span>
            <span className="text-error font-bold tabular-nums">+34.8% Attribution</span>
          </div>
          <div className="flex items-center justify-between py-2.5 font-medium text-on-surface">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Entorhinal Cortex (Brodmann Area 28)
            </span>
            <span className="text-amber-700 font-bold tabular-nums">+26.4% Attribution</span>
          </div>
          <div className="flex items-center justify-between py-2.5 font-medium text-on-surface-variant">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              Posterior Cingulate Cortex
            </span>
            <span className="text-secondary font-bold tabular-nums">+18.1% Attribution</span>
          </div>
          <div className="flex items-center justify-between py-2.5 font-medium text-on-surface-variant">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Precuneus Volume
            </span>
            <span className="text-primary font-bold tabular-nums">+11.5% Attribution</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
