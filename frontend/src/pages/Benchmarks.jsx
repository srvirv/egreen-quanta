import Card from '../components/ui/Card'
import Chip from '../components/ui/Chip'
import MetricTile from '../components/ui/MetricTile'

export default function Benchmarks() {
  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Header & Diagnostic Context */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Chip variant="primary" icon="verified">
            SIH PS 26139 Benchmark
          </Chip>
          <span className="text-xs text-on-surface-variant font-medium">ADNI Phase III Cohort</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
          Empirical Benchmark: Classical vs. Hybrid QML
        </h1>
        <p className="text-sm text-on-surface-variant">
          Standardized ADNI & independent multi-site validation (identical splits & preprocessing pipelines).
        </p>
      </section>

      {/* Hypothesis Verification Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container-low border border-primary/15 p-5 md:p-6 shadow-xs">
        <div className="flex items-start gap-3.5 relative z-10">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[22px]">psychology_alt</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Hypothesis Verification
            </span>
            <p className="text-sm font-semibold text-on-surface mt-1 leading-snug">
              Quantum Kernel Encoding demonstrates statistically significant advantage over classical baselines in high-dimensional low-sample regimes.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 text-on-tertiary-container bg-tertiary-container/30 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                Statistically Significant (p &lt; 0.001)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Benchmark Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <MetricTile
          label="Hybrid QML AUC"
          value="0.942"
          badge="+6.8%"
          subtext="vs Classical SVM (0.874)"
          icon="trending_up"
          variant="primary"
        />
        <MetricTile
          label="Sample Efficiency"
          value="3.4x"
          subtext="Faster convergence on small cohorts"
          icon="bolt"
          variant="secondary"
        />
        <MetricTile
          label="F1 Score (MCI)"
          value="0.918"
          badge="+8.2%"
          subtext="Early transition sensitivity"
          icon="analytics"
          variant="primary"
        />
      </div>

      {/* Comparison Placeholder Card */}
      <Card
        title="Model Performance Matrix (Cross-Validation)"
        subtitle="Evaluated across 5-Fold Stratified Split on OASIS & ADNI-3"
        icon="compare"
        elevation={2}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-primary/10 text-on-surface-variant font-semibold">
                <th className="pb-3 pr-4">Architecture</th>
                <th className="pb-3 px-4">Paradigm</th>
                <th className="pb-3 px-4">Accuracy</th>
                <th className="pb-3 px-4">ROC-AUC</th>
                <th className="pb-3 pl-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              <tr className="bg-primary/5 font-semibold text-on-surface">
                <td className="py-3 pr-4 flex items-center gap-2 text-primary">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Hybrid QSVM (Equivariant Kernel)
                </td>
                <td className="py-3 px-4 text-secondary">Quantum-Classical</td>
                <td className="py-3 px-4 tabular-nums">93.4%</td>
                <td className="py-3 px-4 tabular-nums">0.942</td>
                <td className="py-3 pl-4 text-right">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                    Optimal
                  </span>
                </td>
              </tr>
              <tr className="text-on-surface-variant">
                <td className="py-3 pr-4">Classical 3D ResNet-50</td>
                <td className="py-3 px-4">Deep Learning</td>
                <td className="py-3 px-4 tabular-nums">87.1%</td>
                <td className="py-3 px-4 tabular-nums">0.881</td>
                <td className="py-3 pl-4 text-right">Baseline</td>
              </tr>
              <tr className="text-on-surface-variant">
                <td className="py-3 pr-4">Random Forest + FreeSurfer</td>
                <td className="py-3 px-4">Ensemble Classical</td>
                <td className="py-3 px-4 tabular-nums">84.6%</td>
                <td className="py-3 px-4 tabular-nums">0.852</td>
                <td className="py-3 pl-4 text-right">Baseline</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
