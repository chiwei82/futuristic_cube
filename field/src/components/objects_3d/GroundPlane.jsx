import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'

export default function GroundPlane(props) {
  const shaderRef = useRef()

  // Leva 控制參數
  const { uGrid, uCrossWidth, uCrossLength } = useControls('Ground Grid +', {
    uGrid: { value: 30, min: 1, max: 50, step: 1 },
    uCrossWidth: { value: 0.025, min: 0.001, max: 0.2 },
    uCrossLength: { value: 0.1, min: 0.01, max: 0.5 },
  })

  useFrame((state) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uGrid: { value: uGrid },
    uCrossWidth: { value: uCrossWidth },
    uCrossLength: { value: uCrossLength },
    uScale:{ value: props.scale }
  }), [])

  // 即時更新 uniforms（可選：也可以用 useEffect 依賴）
  if (shaderRef.current) {
    shaderRef.current.uniforms.uGrid.value = uGrid
    shaderRef.current.uniforms.uCrossWidth.value = uCrossWidth
    shaderRef.current.uniforms.uCrossLength.value = uCrossLength
  }

  return (
    <group {...props}>
      <mesh>
        <planeGeometry/>
        <shaderMaterial
          ref={shaderRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          side={THREE.DoubleSide}
          transparent={true}
        />
      </mesh>
    </group>
  )
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform float uGrid;
  uniform float uCrossWidth;
  uniform float uCrossLength;
  uniform float uScale;
  varying vec2 vUv;

  void main() {
    vec2 gridUV = vUv * uGrid * uScale / 10.0;
    vec2 cell = fract(gridUV); // 每格內部 UV
    vec2 center = abs(cell - 0.5);

    float horizontal = step(center.y, uCrossWidth) * step(center.x, uCrossLength);
    float vertical = step(center.x, uCrossWidth) * step(center.y, uCrossLength);
    float cross = max(horizontal, vertical);

    vec3 bg = vec3(0.05); // 背景色
    vec3 crossColor =  vec3(0.65, 0.15, 0.65); // cyan 十字

    vec3 finalColor = mix(bg, crossColor, cross);
    gl_FragColor = vec4(finalColor, finalColor);
  }
`
