import React from 'react'
import Scene from '../game/Scene'
import HUD from '../ui/HUD'
import PhysicsProvider from '../physics/PhysicsProvider'
import ThirdPersonController from '../characters/ThirdPersonController'
import { connectToServer } from '../network/socket'

export default function Game({ roomId }: { roomId: string }){
  connectToServer()
  return (
    <div className="w-full h-full relative">
      <div style={{ width: '100%', height: '100%' }}>
        <PhysicsProvider>
          <Scene>
            <ThirdPersonController roomId={roomId} playerName={'Imran'} />
          </Scene>
        </PhysicsProvider>
      </div>
      <HUD />
    </div>
  )
}
