import React from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

export default function Scene(){
  // Simple ground + demo cube to verify R3F works
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5,10,7]} intensity={1} />
      <mesh receiveShadow rotation={[-Math.PI/2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[200,200]} />
        <meshStandardMaterial color="#2d6a4f" />
      </mesh>

      <PlayerDemo />
    </>
  )
}

function PlayerDemo(){
  const ref = React.useRef<Mesh>(null!)
  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 0.3
  })
  return (
    <mesh ref={ref} position={[0,1,0]}> 
      <boxGeometry args={[1,2,0.6]} />
      <meshStandardMaterial color="#d90429" />
    </mesh>
  )
}
