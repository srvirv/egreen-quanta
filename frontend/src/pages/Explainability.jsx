import { useEffect, useState } from 'react'
import Card from '../components/ui/Card'
import Chip from '../components/ui/Chip'

const defaultPatient = {
  Age: 75,
  EDUC: 14,
  SES: 2,
  MMSE: 24,
  eTIV: 1500,
  nWBV: 0.70,
  ASF: 1.1,
  M_F: 'M',
}

const featureLabels = [
  { key: 'Age', label: 'Age', unit: 'years' },
  { key: 'EDUC', label: 'Education', unit: 'years' },
  { key: 'SES', label: 'Socioeconomic Status', unit: 'score' },
  { key: 'MMSE', label: 'MMSE', unit: 'score' },
  { key: 'eTIV', label: 'Estimated Total Intracranial Volume', unit: 'mm³' },
  { key: 'nWBV', label: 'Normalized Whole Brain Volume', unit: 'ratio' },
  { key: 'ASF', label: 'Atlas Scaling Factor', unit: 'factor' },
  { key: 'M_F', label: 'Sex', unit: 'categorical' },
]

export default function Explainability() {
  const [prediction, setPrediction] = useState(null)
  const [probabilities, setProbabilities] = useState({})
  const [contributions, setContributions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadPrediction() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('http://127.0.0.1:8000/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(defaultPatient),
        })

        if (!response.ok) {
          throw new Error('Prediction API request failed')
        }

        const data = await response.json()

        setPrediction(data.prediction)
        setProbabilities(data.probabilities || {})
        setContributions(data.feature_contributions || [])
      } catch (err) {
        console.error(err)
        setError(
          'Unable to load the live model result. Make sure the FastAPI backend is running.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadPrediction()
  }, [])

  const maxContribution = Math.max(
    ...contributions.map((item) => Math.abs(item.percentage_points || 0)),
    1
  )

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">

      {/* Header */}
      <section className="flex flex-col gap-2">

        <div className="flex items-center gap-2">
          <Chip variant="secondary" icon="insights">
            Model Explainability
          </Chip>

          <Chip variant="neutral">
            OASIS-2 Research Prototype
          </Chip>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
          Prediction Explainability
        </h1>

        <p className="text-sm text-on-surface-variant">
          Understanding the current Random Forest prediction using the
          structured OASIS-2 features supplied to the model.
        </p>

      </section>

      {/* Live Prediction */}
      <Card
        elevation={2}
        title="Live Model Result"
        subtitle="Result returned by the current Random Forest inference API"
        icon="model_training"
        action={
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            LIVE MODEL
          </span>
        }
      >

        {loading ? (
          <div className="py-8 text-center text-sm text-on-surface-variant">
            Loading prediction...
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="p-5 rounded-xl bg-surface-container-low border border-primary/5">
              <span className="text-xs text-on-surface-variant">
                Predicted Class
              </span>

              <div className="text-3xl font-bold text-primary mt-1">
                {prediction}
              </div>

              <p className="text-xs text-on-surface-variant mt-2">
                Current live prediction from the Random Forest model.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-surface-container-low border border-primary/5">
              <span className="text-xs text-on-surface-variant">
                Predicted-Class Probability
              </span>

              <div className="text-3xl font-bold text-secondary mt-1">
                {prediction && probabilities[prediction] !== undefined
                  ? `${(probabilities[prediction] * 100).toFixed(1)}%`
                  : '—'}
              </div>

              <p className="text-xs text-on-surface-variant mt-2">
                Model probability associated with the predicted class.
              </p>
            </div>

          </div>
        )}

      </Card>

      {/* Probability Breakdown */}
      {!loading && !error && (
        <Card
          title="Prediction Probability Breakdown"
          subtitle="Class probabilities returned by the model"
          icon="bar_chart"
          elevation={1}
        >

          <div className="flex flex-col gap-4">

            {['Normal', 'MCI-like', 'AD'].map((className) => {
              const probability = probabilities[className] ?? 0
              const percentage = probability * 100

              return (
                <div key={className}>

                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-on-surface">
                      {className}
                    </span>

                    <span className="font-bold text-primary tabular-nums">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-surface-container-low overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                </div>
              )
            })}

          </div>

        </Card>
      )}

      {/* Feature Contributions */}
      {!loading && !error && (
        <Card
          title="Local Feature Contribution"
          subtitle="Change in predicted-class probability when each feature is replaced by its baseline value"
          icon="analytics"
          elevation={1}
        >

          {contributions.length === 0 ? (
            <div className="py-6 text-sm text-on-surface-variant">
              Feature contribution data is not available.
            </div>
          ) : (
            <div className="flex flex-col gap-5">

              {contributions.map((item) => {
                const value = Number(item.percentage_points || 0)
                const absoluteValue = Math.abs(value)

                const barWidth =
                  (absoluteValue / maxContribution) * 100

                const supports = item.direction === 'supports'
                const opposes = item.direction === 'opposes'

                return (
                  <div key={item.feature}>

                    <div className="flex items-center justify-between gap-4 mb-1.5">

                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            supports
                              ? 'bg-primary'
                              : opposes
                                ? 'bg-red-500'
                                : 'bg-slate-400'
                          }`}
                        />

                        <span className="text-sm font-semibold text-on-surface">
                          {item.feature}
                        </span>
                      </div>

                      <span
                        className={`text-xs font-bold tabular-nums ${
                          supports
                            ? 'text-primary'
                            : opposes
                              ? 'text-red-600'
                              : 'text-on-surface-variant'
                        }`}
                      >
                        {value > 0 ? '+' : ''}
                        {value.toFixed(1)} pp
                      </span>

                    </div>

                    <div className="h-2 rounded-full bg-surface-container-low overflow-hidden">

                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          supports
                            ? 'bg-primary'
                            : opposes
                              ? 'bg-red-500'
                              : 'bg-slate-400'
                        }`}
                        style={{ width: `${barWidth}%` }}
                      />

                    </div>

                    <p className="text-[11px] text-on-surface-variant mt-1">
                      {supports
                        ? 'Supports the predicted class'
                        : opposes
                          ? 'Opposes the predicted class'
                          : 'Neutral effect'}
                    </p>

                  </div>
                )
              })}

            </div>
          )}

          <div className="mt-5 pt-4 border-t border-primary/10">
            <p className="text-xs text-on-surface-variant leading-relaxed">
              <strong className="text-on-surface">
                How to read this:
              </strong>{' '}
              the value shows the change in predicted-class probability,
              measured in percentage points, when that feature is replaced
              with its baseline value. Positive values indicate that the
              original feature supported the prediction; negative values
              indicate that it opposed it.
            </p>
          </div>

        </Card>
      )}

      {/* Input Features */}
      <Card
        title="Features Used by the Model"
        subtitle="Input values supplied to the Random Forest prediction"
        icon="dataset"
        elevation={1}
      >

        <div className="overflow-x-auto">

          <table className="w-full text-left text-xs">

            <thead>
              <tr className="border-b border-primary/10 text-on-surface-variant font-semibold">
                <th className="pb-3 pr-4">Feature</th>
                <th className="pb-3 px-4">Value</th>
                <th className="pb-3 pl-4">Unit / Meaning</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-primary/5">

              {featureLabels.map((feature) => (
                <tr key={feature.key} className="text-on-surface-variant">

                  <td className="py-3 pr-4 font-semibold text-on-surface">
                    {feature.label}
                  </td>

                  <td className="py-3 px-4 font-mono text-primary">
                    {defaultPatient[feature.key]}
                  </td>

                  <td className="py-3 pl-4">
                    {feature.unit}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </Card>

      {/* Research Note */}
      <div className="rounded-2xl bg-surface-container-low border border-primary/10 p-5">

        <div className="flex items-start gap-3">

          <span className="material-symbols-outlined text-primary">
            science
          </span>

          <div>

            <h3 className="text-sm font-semibold text-on-surface">
              Explainability Method
            </h3>

            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              Feature contributions are estimated using a local
              baseline-replacement method on the current Random Forest
              pipeline. Each feature is replaced individually with its
              preprocessing baseline and the change in predicted-class
              probability is measured.
            </p>

            <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
              This is model-level research explainability, not a clinical
              interpretation of causality. The prototype does not perform
              raw MRI image classification or anatomical saliency analysis.
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}