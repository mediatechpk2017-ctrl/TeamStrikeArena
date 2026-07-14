import React, { useEffect, useRef } from 'react'
import RAPIER from '@dimforge/rapier3d-compat'

type PhysicsContextValue = {
  world: RAPIER.World | null
}

const PhysicsContext = React.createContext<PhysicsContextValue>({ world: null })

export function usePhysics(){
  return React.useContext(PhysicsContext)
}

export default function PhysicsProvider({ children }: { children: React.ReactNode }){
  const worldRef = useRef<RAPIER.World | null>(null)
  const last = useRef<number | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      await RAPIER.init()
      if(!mounted) return
      const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 })
      worldRef.current = world
    })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    let raf = 0
    const step = (t: number) => {
      if(!worldRef.current){ raf = requestAnimationFrame(step); return }
      if(last.current == null) last.current = t
      const dt = Math.min((t - last.current) / 1000, 0.03)
      last.current = t
      worldRef.current.step()
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <PhysicsContext.Provider value={{ world: worldRef.current }}>
      {children}
    </PhysicsContext.Provider>
  )
}
