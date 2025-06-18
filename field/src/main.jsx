import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import './index.css'
import App from './App.jsx'
import { Leva } from 'leva'
import { Perf } from 'r3f-perf'
import NoiseOverlay from './components/NoiseOverlay'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NoiseOverlay />
    <Canvas
      camera={{ fov: 60, position: [0, 4, 5] }}
    >
      <App />
      {/* <Perf  position="top-left"/> */}
    </Canvas>
    <Leva hidden/>
  </StrictMode>,
)
