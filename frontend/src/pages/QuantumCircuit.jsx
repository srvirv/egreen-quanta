import Card from '../components/ui/Card'
import Chip from '../components/ui/Chip'

export default function QuantumCircuit() {
  const qubits = Array.from({ length: 4 }, (_, i) => `q[${i}]`)

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">

      {/* Header */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">

          <Chip variant="secondary" icon="tune">
            VQC Topology: Linear Entangled
          </Chip>

          <span className="text-xs text-on-surface-variant flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-primary" />
            PennyLane Simulator
          </span>

        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight mt-1">
          Hybrid Quantum Pipeline
        </h1>

        <p className="text-sm text-on-surface-variant">
          Experimental 4-qubit variational quantum circuit for comparing
          quantum-classical learning with classical ML baselines.
        </p>
      </section>

      {/* Quantum Configuration */}
      <Card
        elevation={2}
        title="4-Qubit Variational Quantum Circuit"
        subtitle="Experimental research configuration using PennyLane"
        icon="memory"
        action={
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
            Experimental
          </span>
        }
      >

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">

          <div className="p-3 rounded-xl bg-surface-container-low border border-primary/5">
            <span className="text-xs text-on-surface-variant">
              Qubits
            </span>
            <div className="text-xl font-bold text-on-surface tabular-nums mt-0.5">
              4
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-low border border-primary/5">
            <span className="text-xs text-on-surface-variant">
              Feature Reduction
            </span>
            <div className="text-xl font-bold text-secondary tabular-nums mt-0.5">
              PCA → 4
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-low border border-primary/5">
            <span className="text-xs text-on-surface-variant">
              Data Encoding
            </span>
            <div className="text-xl font-bold text-primary tabular-nums mt-0.5">
              RY
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-low border border-primary/5">
            <span className="text-xs text-on-surface-variant">
              Trainable Layers
            </span>
            <div className="text-xl font-bold text-on-surface tabular-nums mt-0.5">
              3
            </div>
          </div>

        </div>
      </Card>

      {/* Pipeline */}
      <Card
        title="Quantum-Classical Processing Pipeline"
        subtitle="How the experimental QML model processes the OASIS-2 features"
        icon="account_tree"
        elevation={1}
      >

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">

          <div className="p-4 rounded-xl bg-surface-container-low border border-primary/5">
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">
              Step 1
            </span>
            <h3 className="font-semibold text-on-surface mt-1">
              OASIS-2 Features
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Structured cognitive and MRI-derived measurements.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-primary/5">
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">
              Step 2
            </span>
            <h3 className="font-semibold text-on-surface mt-1">
              Scaling
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">
              StandardScaler normalizes the input features.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-primary/5">
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">
              Step 3
            </span>
            <h3 className="font-semibold text-on-surface mt-1">
              PCA
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Features are reduced to four components for the quantum circuit.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-primary/5">
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">
              Step 4
            </span>
            <h3 className="font-semibold text-on-surface mt-1">
              VQC
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">
              RY encoding, trainable Rot layers and neighboring CNOT gates.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-primary/5">
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">
              Step 5
            </span>
            <h3 className="font-semibold text-on-surface mt-1">
              Classical Output
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Quantum expectation values are passed to the classical output layer.
            </p>
          </div>

        </div>
      </Card>

      {/* Circuit Visualizer */}
      <Card
        title="Variational Quantum Circuit"
        subtitle="4 qubits • RY data encoding • 3 trainable Rot layers • CNOT entanglement"
        icon="developer_board"
        elevation={1}
      >

        <div className="flex flex-col gap-3 py-3 font-mono text-xs overflow-x-auto">

          {qubits.map((qubit, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 min-w-[650px]"
            >

              <span className="w-12 text-primary font-bold text-xs">
                {qubit}
              </span>

              <div className="flex-1 flex items-center h-10 bg-surface-container-low rounded-lg px-3 relative">

                {/* Qubit wire */}
                <div className="w-full h-0.5 bg-primary/20 absolute left-0 right-0" />

                <div className="relative z-10 flex items-center gap-3">

                  {/* Data encoding */}
                  <span className="px-2 py-1 rounded bg-secondary text-white text-[11px] shadow-xs">
                    RY(x{idx})
                  </span>

                  {/* Trainable layer 1 */}
                  <span className="px-2 py-1 rounded bg-primary text-white text-[11px] shadow-xs">
                    Rot(θ₁)
                  </span>

                  {/* Entanglement */}
                  <span className="px-2 py-1 rounded bg-surface-container-high border border-primary/20 text-on-surface text-[11px]">
                    CNOT
                  </span>

                  {/* Trainable layer 2 */}
                  <span className="px-2 py-1 rounded bg-primary text-white text-[11px] shadow-xs">
                    Rot(θ₂)
                  </span>

                  {/* Trainable layer 3 */}
                  <span className="px-2 py-1 rounded bg-primary-fixed text-primary font-semibold text-[11px]">
                    Rot(θ₃)
                  </span>

                  {/* Measurement */}
                  <span className="px-2 py-1 rounded bg-slate-800 text-tertiary-fixed text-[11px]">
                    ⟨Z⟩ + ⟨X⟩
                  </span>

                </div>
              </div>
            </div>
          ))}

        </div>

        <div className="mt-3 pt-3 border-t border-primary/10 text-xs text-on-surface-variant">
          <strong className="text-on-surface">
            Circuit structure:
          </strong>{' '}
          input features are encoded with RY rotations, followed by three
          trainable rotational layers with neighboring CNOT entanglement.
          The circuit returns quantum expectation values for the classical
          output layer.
        </div>

      </Card>

      {/* Important Research Note */}
      <div className="rounded-2xl bg-surface-container-low border border-primary/10 p-5">

        <div className="flex items-start gap-3">

          <span className="material-symbols-outlined text-primary">
            science
          </span>

          <div>

            <h3 className="text-sm font-semibold text-on-surface">
              Experimental QML Note
            </h3>

            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              This circuit is currently a research experiment and is evaluated
              separately from the live Random Forest prediction pipeline.
              The current results do not demonstrate quantum advantage.
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}