import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky } from '@react-three/drei'
import Scene from './Scene'
import HUD from '../ui/HUD'
import create from 'zustand'

type Props = { roomId: string }

export default function Game({ roomId }: Props){
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 5, 12], fov: 60 }}>
        <Suspense fallback={null}>
          <Sky sunPosition={[10, 10, 0]} />
          <Scene />
        </Suspense>
        <OrbitControls />
      </Canvas>
      <HUD />
    </div>
  )
}
