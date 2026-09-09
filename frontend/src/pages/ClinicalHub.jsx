import Card from '../components/ui/Card'
import Chip from '../components/ui/Chip'
import Button from '../components/ui/Button'
import MetricTile from '../components/ui/MetricTile'
import SegmentedBar from '../components/ui/SegmentedBar'

export default function ClinicalHub() {
  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Executive Triage Header */}
      <section className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Chip variant="primary" icon="psychology">
            Decision Intelligence Suite
          </Chip>
          <span className="text-xs text-on-surface-variant font-medium">Updated 4m ago</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight mt-1">
          Early Detection Clinical Triage
        </h1>
        <p className="text-sm text-on-surface-variant">
          Multi-modal Cohort Screening: Normal Aging → Mild Cognitive Impairment (MCI) → Early AD
        </p>
      </section>

      {/* Cohort Metric Bento Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <MetricTile
          label="Monitored"
          value="1,420"
          subtext="Active cohort"
          icon="groups"
          variant="primary"
        />
        <MetricTile
          label="Flagged"
          value="38"
          badge="2.7%"
          subtext="High risk conv."
          icon="warning"
          variant="error"
        />
        <MetricTile
          label="Lead Time"
          value="-14.2m"
          subtext="Earlier diag."
          icon="speed"
          variant="secondary"
        />
      </section>

      {/* Quick Patient Risk Spotlight Card */}
      <Card
        elevation={2}
        className="flex flex-col gap-5 border border-primary/10"
      >
        {/* Header Patient Badge */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm">
              EQ
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-base text-on-surface">Patient #EQ-8832</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[11px] font-medium">
                  CDR 0.5
                </span>
              </div>
              <span className="text-xs text-on-surface-variant">
                Female, 68 yrs • Longitudinal Scan 04
              </span>
            </div>
          </div>
          <Chip variant="risk" pulse={true}>
            High Risk
          </Chip>
        </div>

        {/* Multi-modal Neuroimaging Slice Visual Placeholder */}
        <div className="relative rounded-xl overflow-hidden bg-slate-900 h-48 md:h-56 flex items-center justify-center border border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,163,166,0.25)_0,rgba(15,23,42,0.95)_70%)]" />
          
          <div className="relative z-10 flex flex-col items-center text-center p-4">
            <span className="material-symbols-outlined text-[48px] text-primary-fixed animate-pulse mb-2">
              neurology
            </span>
            <span className="text-sm font-semibold text-white">
              Axial 7T T1-weighted MPRAGE Brain MRI
            </span>
            <span className="text-xs text-slate-400 mt-1 max-w-md">
              Bilateral medial temporal lobe & hippocampus segmented via Quantum Kernel Feature Mapping
            </span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90 bg-black/50 px-3 py-1.5 rounded-lg backdrop-blur-md">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">biotech</span>
              Volumetric Tomography S-78
            </span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full font-mono text-[11px]">
              Q-Res 0.4mm
            </span>
          </div>
        </div>

        {/* Tri-Class Hybrid Prediction Gauge */}
        <SegmentedBar
          title="Tri-Class QML Projection"
          leadingTag="MCI Amnestic (71%)"
          segments={[
            { label: 'Normal', percentage: 12, color: 'bg-primary-fixed-dim', textColor: 'text-primary' },
            { label: 'MCI Amnestic', percentage: 71, color: 'bg-secondary', textColor: 'text-secondary', active: true },
            { label: 'Early AD', percentage: 17, color: 'bg-error', textColor: 'text-error' },
          ]}
        />

        {/* Biomarker Status Summary */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-surface-container-low border border-primary/5 flex flex-col">
            <span className="text-xs text-on-surface-variant font-medium">Q-Attribution Confidence</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-lg font-bold text-primary tabular-nums">91.8%</span>
              <span className="text-xs text-on-surface-variant">(Tomography validated)</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-surface-container-low border border-primary/5 flex flex-col">
            <span className="text-xs text-on-surface-variant font-medium">Molecular Biomarker Status</span>
            <span className="text-sm font-semibold text-secondary mt-1">Tau+ / FDG Hypomet.</span>
          </div>
        </div>
      </Card>

      {/* Quantum Batch Execution Card */}
      <section className="bg-gradient-to-r from-primary-container to-primary text-white rounded-2xl p-5 md:p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-tertiary-fixed">memory</span>
            <span className="font-semibold text-base">Quantum Processing Pipeline</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold">
              8 Ready
            </span>
          </div>
          <p className="text-xs md:text-sm text-on-primary-container leading-relaxed">
            Run Hybrid Quantum Kernel classification and variational circuit optimization on the pending MRI tensor batch.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="white" icon="play_arrow">
            Run Batch Inference
          </Button>
          <button
            type="button"
            aria-label="Configure pipeline parameters"
            className="w-10 h-10 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">settings_input_component</span>
          </button>
        </div>
      </section>
    </div>
  )
}
