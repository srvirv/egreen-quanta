import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Shell from './components/layout/Shell'
import ClinicalHub from './pages/ClinicalHub'
import Benchmarks from './pages/Benchmarks'
import QuantumCircuit from './pages/QuantumCircuit'
import Explainability from './pages/Explainability'

export default function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<Navigate to="/clinical" replace />} />
          <Route path="/clinical" element={<ClinicalHub />} />
          <Route path="/benchmarks" element={<Benchmarks />} />
          <Route path="/circuit" element={<QuantumCircuit />} />
          <Route path="/explainability" element={<Explainability />} />
          <Route path="*" element={<Navigate to="/clinical" replace />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  )
}