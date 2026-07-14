import React, { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'

type Snapshot = {
  id: string
  position: [number, number, number]
  rotationY: number
  time: number
}

export default function RemotePlayer({ state } : { state: Snapshot }){
  const ref = useRef<any>(null)
  const buffer = useRef<Snapshot[]>([])

  useEffect(() => {
    buffer.current.push(state)
    while(buffer.current.length > 5) buffer.current.shift()
  }, [state])

  useFrame(() => {
    const b = buffer.current
    if(b.length < 2) return
    const now = performance.now()
    const renderTimestamp = now - 100
    let a = b[0]
    let c = b[1]
    for(let i = 0; i < b.length - 1; i++){
      if(b[i].time <= renderTimestamp && b[i+1].time >= renderTimestamp){
        a = b[i]
        c = b[i+1]
        break
      }
    }
    const span = c.time - a.time
    const t = span === 0 ? 0 : (renderTimestamp - a.time) / span
    const ax = a.position[0], ay = a.position[1], az = a.position[2]
    const bx = c.position[0], by = c.position[1], bz = c.position[2]
    const x = ax + (bx - ax) * t
    const y = ay + (by - ay) * t
    const z = az + (bz - az) * t
    if(ref.current){
      ref.current.position.lerp(new Vector3(x,y,z), 0.2)
    }
  })

  return (
    <mesh ref={ref} position={[state.position[0], state.position[1], state.position[2]]}>
      <boxGeometry args={[0.8,1.6,0.6]} />
      <meshStandardMaterial color="#6a4c93" />
    </mesh>
  )
}
