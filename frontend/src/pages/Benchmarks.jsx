import Card from '../components/ui/Card'
import Chip from '../components/ui/Chip'
import MetricTile from '../components/ui/MetricTile'

const models = [
  {
    name: 'Random Forest',
    paradigm: 'Classical ML',
    accuracy: '74.67%',
    macroF1: '70.77%',
    status: 'Current live model',
    highlight: true,
  },
  {
    name: 'SVM',
    paradigm: 'Classical ML',
    accuracy: '66.67%',
    macroF1: '60.95%',
    status: 'Baseline',
  },
  {
    name: 'Logistic Regression',
    paradigm: 'Classical ML',
    accuracy: '66.67%',
    macroF1: '58.97%',
    status: 'Baseline',
  },
  {
    name: 'Hybrid QML',
    paradigm: 'Quantum-Classical',
    accuracy: '50.67%',
    macroF1: '~34%',
    status: 'Experimental',
  },
]

export default function Benchmarks() {
  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">

      {/* Header */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Chip variant="primary" icon="verified">
            SIH PS 26139 Benchmark
          </Chip>

          <span className="text-xs text-on-surface-variant font-medium">
            OASIS-2 Research Prototype
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
          Model Benchmark: Classical ML vs. Experimental Hybrid QML
        </h1>

        <p className="text-sm text-on-surface-variant">
          Comparison of models trained on the same OASIS-2 feature pipeline using a
          subject-level train/test split.
        </p>
      </section>

      {/* Research Note */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container-low border border-primary/15 p-5 md:p-6 shadow-xs">
        <div className="flex items-start gap-3.5 relative z-10">

          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[22px]">
              science
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Research Comparison
            </span>

            <p className="text-sm font-semibold text-on-surface mt-1 leading-snug">
              Classical baseline models currently outperform the experimental
              hybrid quantum-classical model on this OASIS-2 test split.
            </p>

            <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
              No quantum advantage is claimed. The QML result is presented as an
              experimental research benchmark and is not used for the live
              prediction API.
            </p>
          </div>
        </div>
      </div>

      {/* Benchmark Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">

        <MetricTile
          label="Best Accuracy"
          value="74.67%"
          subtext="Random Forest"
          icon="trending_up"
          variant="primary"
        />

        <MetricTile
          label="Best Macro F1"
          value="70.77%"
          subtext="Random Forest"
          icon="analytics"
          variant="secondary"
        />

        <MetricTile
          label="Experimental QML"
          value="50.67%"
          subtext="Hybrid quantum-classical"
          icon="bolt"
          variant="primary"
        />

      </div>

      {/* Model Comparison */}
      <Card
        title="Model Performance Matrix"
        subtitle="OASIS-2 held-out subject-level test split"
        icon="compare"
        elevation={2}
      >
        <div className="overflow-x-auto">

          <table className="w-full text-left text-xs">

            <thead>
              <tr className="border-b border-primary/10 text-on-surface-variant font-semibold">
                <th className="pb-3 pr-4">Model</th>
                <th className="pb-3 px-4">Paradigm</th>
                <th className="pb-3 px-4">Accuracy</th>
                <th className="pb-3 px-4">Macro F1</th>
                <th className="pb-3 pl-4 text-right">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-primary/5">

              {models.map((model) => (
                <tr
                  key={model.name}
                  className={
                    model.highlight
                      ? 'bg-primary/5 font-semibold text-on-surface'
                      : 'text-on-surface-variant'
                  }
                >

                  <td
                    className={
                      model.highlight
                        ? 'py-3 pr-4 flex items-center gap-2 text-primary'
                        : 'py-3 pr-4'
                    }
                  >
                    {model.highlight && (
                      <span className="w-2 h-2 rounded-full bg-primary" />
                    )}

                    {model.name}
                  </td>

                  <td className="py-3 px-4">
                    {model.paradigm}
                  </td>

                  <td className="py-3 px-4 tabular-nums">
                    {model.accuracy}
                  </td>

                  <td className="py-3 px-4 tabular-nums">
                    {model.macroF1}
                  </td>

                  <td className="py-3 pl-4 text-right">
                    {model.highlight ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                        Current
                      </span>
                    ) : model.status === 'Experimental' ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-semibold">
                        Experimental
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium">
                        Baseline
                      </span>
                    )}
                  </td>

                </tr>
              ))}

            </tbody>
          </table>

        </div>
      </Card>

      {/* Evaluation Details */}
      <Card
        title="Evaluation Notes"
        subtitle="How to interpret these results"
        icon="info"
        elevation={1}
      >
        <div className="flex flex-col gap-3 text-sm text-on-surface-variant">

          <p>
            <strong className="text-on-surface">Dataset:</strong>{' '}
            OASIS-2 longitudinal research dataset.
          </p>

          <p>
            <strong className="text-on-surface">Split:</strong>{' '}
            Subjects were separated before model evaluation to reduce
            patient-level data leakage across visits.
          </p>

          <p>
            <strong className="text-on-surface">Best classical model:</strong>{' '}
            Random Forest, selected using macro F1 among the tested classical
            baselines.
          </p>

          <p>
            <strong className="text-on-surface">QML:</strong>{' '}
            The hybrid quantum-classical experiment uses PCA-reduced features
            with a 4-qubit variational quantum circuit. It is currently a
            research experiment rather than the live prediction model.
          </p>

          <p className="text-xs border-t border-primary/10 pt-3">
            These results are from a research prototype and should not be
            interpreted as clinical diagnostic performance.
          </p>

        </div>
      </Card>

    </div>
  )
}