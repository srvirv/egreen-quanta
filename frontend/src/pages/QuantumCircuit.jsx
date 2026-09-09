import Card from '../components/ui/Card'
import Chip from '../components/ui/Chip'

export default function QuantumCircuit() {
  const qubits = Array.from({ length: 8 }, (_, i) => `q[${i}]`)

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Pipeline Header */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Chip variant="secondary" icon="tune">
            VQC Topology: Linear Entangled
          </Chip>
          <span className="text-xs text-on-surface-variant flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Active QPU Session
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight mt-1">
          Hybrid Quantum Pipeline
        </h1>
        <p className="text-sm text-on-surface-variant">
          Biomedical Feature Encoding & Variational Quantum Circuit (VQC) for early neurodegenerative biomarker isolation.
        </p>
      </section>

      {/* Telemetry Live Card */}
      <Card
        elevation={2}
        title="16-Qubit Register (q[0]..q[15])"
        subtitle="Rigetti Aspen-M3 Virtual Node"
        icon="memory"
        action={
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary text-white">
            96.8% Fidelity
          </span>
        }
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
          <div className="p-3 rounded-xl bg-surface-container-low border border-primary/5">
            <span className="text-xs text-on-surface-variant">Circuit Depth</span>
            <div className="text-xl font-bold text-on-surface tabular-nums mt-0.5">24 Depth</div>
          </div>
          <div className="p-3 rounded-xl bg-surface-container-low border border-primary/5">
            <span className="text-xs text-on-surface-variant">Quantum Gates</span>
            <div className="text-xl font-bold text-secondary tabular-nums mt-0.5">144 Total</div>
          </div>
          <div className="p-3 rounded-xl bg-surface-container-low border border-primary/5">
            <span className="text-xs text-on-surface-variant">Coherence Time (T1)</span>
            <div className="text-xl font-bold text-primary tabular-nums mt-0.5">42.8 µs</div>
          </div>
          <div className="p-3 rounded-xl bg-surface-container-low border border-primary/5">
            <span className="text-xs text-on-surface-variant">Entanglement Entropy</span>
            <div className="text-xl font-bold text-on-surface tabular-nums mt-0.5">0.86 bits</div>
          </div>
        </div>
      </Card>

      {/* Circuit Register Visualizer Canvas Placeholder */}
      <Card
        title="Variational Quantum Circuit Canvas"
        subtitle="Parameterized Rotation Gates Rz(θ), Ry(φ) & CNOT Entangler Mesh"
        icon="developer_board"
        elevation={1}
      >
        <div className="flex flex-col gap-3 py-3 font-mono text-xs overflow-x-auto">
          {qubits.map((qubit, idx) => (
            <div key={idx} className="flex items-center gap-2 min-w-[500px]">
              <span className="w-12 text-primary font-bold text-xs">{qubit}</span>
              <div className="flex-1 flex items-center h-8 bg-surface-container-low rounded-lg px-3 relative">
                <div className="w-full h-0.5 bg-primary/20 absolute left-0 right-0" />
                <div className="relative z-10 flex items-center gap-4">
                  <span className="px-2 py-0.5 rounded bg-primary text-white text-[11px] shadow-xs">
                    H
                  </span>
                  <span className="px-2 py-0.5 rounded bg-secondary text-white text-[11px] shadow-xs">
                    Ry(θ_{idx})
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-container-high border border-primary/20 text-on-surface text-[11px]">
                    CNOT
                  </span>
                  <span className="px-2 py-0.5 rounded bg-primary-fixed text-primary font-semibold text-[11px]">
                    Rz(φ_{idx})
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-tertiary-fixed text-[11px]">
                    ⟨Z⟩
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
