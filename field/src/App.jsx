import {  useFrame } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { useControls } from 'leva'
import { useRef } from 'react'
import CubeObject from './components/objects_3d/CubeObject'
import GroundPlane from './components/objects_3d/GroundPlane.jsx'

import './App.css'


function App() {

  const Cuberef = useRef()

  const { scaleXZ, scaleY, rotX, rotY, rotZ,  posX, posY, posZ  } = useControls('Box Multi', {
    scaleXZ: { value: 1.5, min: 0, max: 10 },
    scaleY: { value: 0.5, min: 0, max: 10 },
    rotX: { value: 0, min: -Math.PI, max: Math.PI },
    rotY: { value: -0.6, min: -Math.PI, max: Math.PI },
    rotZ: { value: 0, min: -Math.PI, max: Math.PI },
    posX: { value: 0, min: -10, max: 10 },
    posY: { value: 0.51, min: -10, max: 10 },
    posZ: { value: 0, min: -10, max: 10 },
  })

  // useFrame((_, delta) => {
  //   Cuberef.current.rotation.x += delta * 0.5
  // })

  return (
    <>
      <OrbitControls/>
      <ambientLight intensity={1} />
      <CubeObject
        ref={Cuberef}
        position={[posX, posY, posZ]}
        scale={[scaleXZ, scaleY, scaleXZ]} 
        rotation={[rotX, rotY, rotZ]} 
      />
      {/* <GlowingSphere 
        position={[posX, posY, posZ]}
        scale={0.5}
      /> */}
      <GroundPlane scale={60} rotation={[-Math.PI / 2, 0, 0]}/>
      {/* Room */}
      {/* <GroundPlane scale={25} rotation={[0, -Math.PI / 2, 0]} position={[-12.5, 12.5, 0]}/>
      <GroundPlane scale={25} rotation={[0, -Math.PI / 2, 0]} position={[12.5, 12.5, 0]}/>
      <GroundPlane scale={25} rotation={[0, 0, -Math.PI / 2]} position={[0, 12.5, -12.5]}/>
      <GroundPlane scale={25} rotation={[0, 0, -Math.PI / 2]} position={[0, 12.5, 12.5]}/> */}
    </>
  )
}

export default App
