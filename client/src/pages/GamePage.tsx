import React from 'react'
import Game from '../game/Game'
import { useParams } from 'react-router-dom'

export default function GamePage(){
  const { room } = useParams()
  return (
    <div className="w-full h-screen">
      <Game roomId={room || 'test-room'} />
    </div>
  )
}
