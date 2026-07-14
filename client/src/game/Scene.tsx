import React, { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky } from '@react-three/drei'
import { useGameStore } from '../store/gameStore'
import RemotePlayer from './RemotePlayer'

export default function Scene({ children }: { children?: React.ReactNode }){
  const players = useGameStore((s) => s.players)
  const [remoteStates, setRemoteStates] = useState<Record<string, any>>({})

  useEffect(() => {
    const onRemoteUpdate = (payload: any) => {
      const { id, state } = payload
      setRemoteStates((s) => ({ ...s, [id]: { ...state, time: performance.now() } }))
    }
    const sock: any = (window as any).__TS_SOCKET__
    if(sock){
      sock.on('player_state', onRemoteUpdate)
    }
    return () => {
      if(sock) sock.off('player_state', onRemoteUpdate)
    }
  }, [])

  return (
    <Canvas camera={{ position: [0, 5, 12], fov: 60 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5,10,7]} intensity={1} />
      <Sky sunPosition={[10, 10, 0]} />
      <mesh receiveShadow rotation={[-Math.PI/2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[200,200]} />
        <meshStandardMaterial color="#2d6a4f" />
      </mesh>
      <Suspense fallback={null}>{children}</Suspense>
      {Object.entries(remoteStates).map(([id, state]) => (
        <RemotePlayer key={id} state={state} />
      ))}
      <OrbitControls />
    </Canvas>
  )
}
