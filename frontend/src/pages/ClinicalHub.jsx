import { useState } from 'react'
import Card from '../components/ui/Card'
import Chip from '../components/ui/Chip'
import Button from '../components/ui/Button'
import MetricTile from '../components/ui/MetricTile'
import SegmentedBar from '../components/ui/SegmentedBar'

export default function ClinicalHub() {
  const [prediction, setPrediction] = useState(null)

  const [patientData, setPatientData] = useState({
    Age: 75,
    EDUC: 14,
    SES: 2,
    MMSE: 24,
    eTIV: 1500,
    nWBV: 0.70,
    ASF: 1.1,
    M_F: 'M',
  })

  const runPrediction = async () => {
    const response = await fetch('http://127.0.0.1:8000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...patientData,
      }),
    })

    const data = await response.json()
    setPrediction(data)
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Research Assessment Header */}
      <section className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Chip variant="primary" icon="psychology">
            Egreen Quanta • Research Prototype
          </Chip>

          <span className="text-xs text-on-surface-variant font-medium">
            OASIS-2 • ML Inference
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight mt-1">
          Early Disease Detection Research Assessment
        </h1>

        <p className="text-sm text-on-surface-variant">
          OASIS-2 feature-based machine-learning assessment across Normal, MCI-like, and AD classes
        </p>
      </section>

      {/* Cohort Metric Bento Cards */}
      {/* Dataset & Model Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <MetricTile
          label="Dataset"
          value="OASIS-2"
          subtext="Research dataset"
          icon="dataset"
          variant="primary"
        />

        <MetricTile
          label="Model"
          value="Random Forest"
          subtext="Classical ML baseline"
          icon="account_tree"
          variant="secondary"
        />

        <MetricTile
          label="Classes"
          value="3"
          subtext="Normal • MCI-like • AD"
          icon="category"
          variant="primary"
        />
      </section>

      {/* Patient Input */}
      <Card
        elevation={2}
        className="flex flex-col gap-4 border border-primary/10"
      >
        <div>
          <h2 className="font-semibold text-base text-on-surface">
            Patient Input
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Enter MRI-derived and cognitive features for ML inference.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["Age", "EDUC", "SES", "MMSE", "eTIV", "nWBV", "ASF"].map((field) => (
            <label key={field} className="flex flex-col gap-1">
              <span className="text-xs text-on-surface-variant font-medium">
                {field}
              </span>
              <input
                type="number"
                value={patientData[field]}
                onChange={(e) =>
                  setPatientData({
                    ...patientData,
                    [field]: Number(e.target.value),
                  })
                }
                className="px-3 py-2 rounded-lg border border-primary/10 bg-surface-container-low text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>
          ))}

          <label className="flex flex-col gap-1">
            <span className="text-xs text-on-surface-variant font-medium">
              Sex
            </span>
            <select
              value={patientData.M_F}
              onChange={(e) =>
                setPatientData({
                  ...patientData,
                  M_F: e.target.value,
                })
              }
              className="px-3 py-2 rounded-lg border border-primary/10 bg-surface-container-low text-sm outline-none"
            >
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </label>
        </div>
      </Card>

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
              </div>
              <span className="text-xs text-on-surface-variant">
                {patientData.M_F === 'M' ? 'Male' : 'Female'}, {patientData.Age} yrs • Current Assessment
              </span>
            </div>
          </div>
          <Chip variant="risk" pulse={!!prediction}>
            {prediction ? prediction.prediction : 'Awaiting Inference'}
          </Chip>
        </div>

        {/* Current Feature-Based Assessment */}
        <div className="relative rounded-xl overflow-hidden bg-slate-900 h-48 md:h-56 flex items-center justify-center border border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,163,166,0.25)_0,rgba(15,23,42,0.95)_70%)]" />

          <div className="relative z-10 flex flex-col items-center text-center p-4">
            <span className="material-symbols-outlined text-[48px] text-primary-fixed animate-pulse mb-2">
              neurology
            </span>

            <span className="text-sm font-semibold text-white">
              MRI-Derived & Cognitive Feature Assessment
            </span>

            <span className="text-xs text-slate-400 mt-1 max-w-md">
              OASIS-2 features processed through the Egreen Quanta machine-learning pipeline
            </span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90 bg-black/50 px-3 py-1.5 rounded-lg backdrop-blur-md">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">
                dataset
              </span>
              OASIS-2 Feature Pipeline
            </span>

            <span className="bg-white/20 px-2 py-0.5 rounded-full font-mono text-[11px]">
              Research Prototype
            </span>
          </div>
        </div>

        {/* Tri-Class Hybrid Prediction Gauge */}
        <SegmentedBar
          title="Tri-Class ML Prediction"
          leadingTag={
            prediction
              ? `${prediction.prediction} (${Math.round(
                prediction.probabilities[prediction.prediction] * 100
              )}%)`
              : "Run inference"
          }
          segments={[
            {
              label: "Normal",
              percentage: prediction
                ? Math.round(prediction.probabilities["Normal"] * 100)
                : 12,
              color: "bg-primary-fixed-dim",
              textColor: "text-primary",
            },
            {
              label: "MCI-like",
              percentage: prediction
                ? Math.round(prediction.probabilities["MCI-like"] * 100)
                : 71,
              color: "bg-secondary",
              textColor: "text-secondary",
              active: prediction?.prediction === "MCI-like",
            },
            {
              label: "AD",
              percentage: prediction
                ? Math.round(prediction.probabilities["AD"] * 100)
                : 17,
              color: "bg-error",
              textColor: "text-error",
              active: prediction?.prediction === "AD",
            },
          ]}
        />

        {/* Biomarker Status Summary */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="bg-surface-container-low/80 p-3 rounded-xl border border-primary/5">
            <span className="text-[11px] font-medium text-on-surface-variant">
              Top-Class Probability
            </span>

            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-lg font-bold text-primary">
                {prediction
                  ? `${Math.round(
                    prediction.probabilities[prediction.prediction] * 100
                  )}%`
                  : '—'}
              </span>

              <span className="text-[10px] text-on-surface-variant">
                {prediction ? prediction.prediction : 'Awaiting inference'}
              </span>
            </div>
          </div>

          <div className="bg-surface-container-low/80 p-3 rounded-xl border border-primary/5">
            <span className="text-[11px] font-medium text-on-surface-variant">
              Model
            </span>

            <span className="text-sm font-bold text-primary mt-1 block">
              Random Forest
            </span>

            <span className="text-[10px] text-on-surface-variant">
              OASIS-2 research prototype
            </span>
          </div>
        </div>
      </Card>

      {/* QML Research Experiment Card */}
      <section className="bg-gradient-to-r from-primary-container to-primary text-white rounded-2xl p-5 md:p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-tertiary-fixed">
              memory
            </span>

            <span className="font-semibold text-base">
              Quantum ML Research Experiment
            </span>

            <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold">
              Experimental
            </span>
          </div>

          <p className="text-xs md:text-sm text-on-primary-container leading-relaxed">
            Compare the classical Random Forest baseline with the experimental
            hybrid quantum machine-learning pipeline using the same OASIS-2
            feature set.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="white"
            icon="play_arrow"
            onClick={runPrediction}
          >
            Run ML Inference
          </Button>

          <button
            type="button"
            aria-label="Quantum ML experiment information"
            className="w-10 h-10 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">
              science
            </span>
          </button>
        </div>
      </section>
    </div>
  )
}
