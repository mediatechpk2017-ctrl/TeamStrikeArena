import { useEffect, useRef } from 'react'

type InputState = {
  forward: number
  right: number
  jump: boolean
  sprint: boolean
  crouch: boolean
  sequenceNumber?: number
}

export default function useInput() {
  const state = useRef<InputState>({ forward: 0, right: 0, jump: false, sprint: false, crouch: false })

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'w') state.current.forward = 1
      if (e.key === 's') state.current.forward = -1
      if (e.key === 'd') state.current.right = 1
      if (e.key === 'a') state.current.right = -1
      if (e.key === 'Shift') state.current.sprint = true
      if (e.key === 'Control') state.current.crouch = true
      if (e.code === 'Space') state.current.jump = true
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w' && state.current.forward === 1) state.current.forward = 0
      if (e.key === 's' && state.current.forward === -1) state.current.forward = 0
      if (e.key === 'd' && state.current.right === 1) state.current.right = 0
      if (e.key === 'a' && state.current.right === -1) state.current.right = 0
      if (e.key === 'Shift') state.current.sprint = false
      if (e.key === 'Control') state.current.crouch = false
      if (e.code === 'Space') state.current.jump = false
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  useEffect(() => {
    let yaw = 0
    const onMouseMove = (e: MouseEvent) => {
      const sensitivity = 0.002
      yaw -= e.movementX * sensitivity
      state.current.sequenceNumber = state.current.sequenceNumber || 0
      // Expose yaw via a property on ref
      ;(state as any).currentYaw = yaw
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  return state
}
