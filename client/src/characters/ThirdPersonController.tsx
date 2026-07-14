import React, { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import RAPIER from 'rapier3d-compat'
import { usePhysics } from '../physics/PhysicsProvider'
import useInput from '../hooks/useInput'
import { getSocket } from '../network/socket'
import { v4 as uuidv4 } from 'uuid'

export type PlayerState = {
  id: string
  position: [number, number, number]
  rotationY: number
  velocity: [number, number, number]
  health: number
  lastProcessedInput?: number
}

const WALK_SPEED = 4
const SPRINT_SPEED = 7
const CROUCH_SPEED = 2.2
const JUMP_SPEED = 6
const GRAVITY = -9.81

export default function ThirdPersonController({ roomId, playerName }: { roomId: string, playerName: string }){
  const { camera } = useThree()
  const physics = usePhysics()
  const input = useInput()
  const bodyRef = useRef<any | null>(null)
  const idRef = useRef<string>(uuidv4())
  const position = useRef(new Vector3(0, 1.1, 0))
  const velocity = useRef(new Vector3(0, 0, 0))
  const yaw = useRef<number>(0)
  const unconfirmedInputs = useRef<Array<any>>([])
  const socket = getSocket()

  useEffect(() => {
    socket.emit('join_room', { roomId, name: playerName })
    return () => {
      socket.emit('leave_room', { roomId })
    }
  }, [roomId, playerName, socket])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      if(!physics || !physics.world) return
      const world = physics.world
      const rb = world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0,1.1,0))
      const collider = world.createCollider(RAPIER.ColliderDesc.capsule(0.6, 0.4), rb)
      bodyRef.current = rb
    })()
    return () => { mounted = false }
  }, [physics])

  useEffect(() => {
    socket.on('server_snapshot', (snap: { players: Record<string, PlayerState>, lastProcessedInput: Record<string, number> }) => {
      const serverPlayer = snap.players[idRef.current]
      if(!serverPlayer) return
      if(!bodyRef.current) return
      const authoritativePos = new Vector3(serverPlayer.position[0], serverPlayer.position[1], serverPlayer.position[2])
      const serverSeq = serverPlayer.lastProcessedInput || 0
      // reconcile
      const localPos = position.current.clone()
      const dist = localPos.distanceTo(authoritativePos)
      position.current.copy(authoritativePos)
      bodyRef.current.setNextKinematicTranslation({ x: authoritativePos.x, y: authoritativePos.y, z: authoritativePos.z })
      // remove acknowledged inputs
      while(unconfirmedInputs.current.length && unconfirmedInputs.current[0].seq <= serverSeq) unconfirmedInputs.current.shift()
      // reapply remaining inputs locally
      unconfirmedInputs.current.forEach((inputItem) => {
        applyInputLocally(inputItem.input, inputItem.dt)
      })
    })
    return () => {
      socket.off('server_snapshot')
    }
  }, [socket])

  function applyInputLocally(inputState: any, dt: number){
    const forward = inputState.forward
    const right = inputState.right
    const isSprinting = inputState.sprint
    const isCrouch = inputState.crouch
    const speed = isCrouch ? CROUCH_SPEED : (isSprinting ? SPRINT_SPEED : WALK_SPEED)
    const dir = new Vector3()
    dir.x = -Math.sin(yaw.current) * forward + Math.cos(yaw.current) * right
    dir.z = -Math.cos(yaw.current) * forward - Math.sin(yaw.current) * right
    dir.normalize()
    if(!isNaN(dir.x) && !isNaN(dir.z)){
      velocity.current.x = dir.x * speed
      velocity.current.z = dir.z * speed
    }
    if(inputState.jump && Math.abs(position.current.y - 1.1) < 0.05){
      velocity.current.y = JUMP_SPEED
    }
    velocity.current.y += GRAVITY * dt
    position.current.x += velocity.current.x * dt
    position.current.y += velocity.current.y * dt
    position.current.z += velocity.current.z * dt
    if(position.current.y < 1.1){
      position.current.y = 1.1
      velocity.current.y = 0
    }
    if(bodyRef.current){
      bodyRef.current.setNextKinematicTranslation({ x: position.current.x, y: position.current.y, z: position.current.z })
    }
  }

  useFrame((_, delta) => {
    const inp = (input.current as any)
    yaw.current = (inp as any).currentYaw ?? yaw.current
    const seq = (inp.sequenceNumber || 0) + 1
    inp.sequenceNumber = seq
    const command = { forward: inp.forward, right: inp.right, jump: inp.jump, sprint: inp.sprint, crouch: inp.crouch }
    unconfirmedInputs.current.push({ seq, input: command, dt: delta })
    applyInputLocally(command, delta)
    socket.emit('input_command', { roomId, id: idRef.current, input: command, seq })
    // camera follow
    const camOffset = new Vector3(0, 2.2, 5)
    const camTarget = position.current.clone()
    const cameraPos = position.current.clone().add(camOffset.applyAxisAngle(new Vector3(0,1,0), yaw.current))
    camera.position.lerp(cameraPos, 0.08)
    camera.lookAt(camTarget)
  })

  return (
    <group>
      <mesh position={[0,1,0]}> 
        <boxGeometry args={[0.8,1.6,0.6]} />
        <meshStandardMaterial color="#ffd166" />
      </mesh>
    </group>
  )
}
