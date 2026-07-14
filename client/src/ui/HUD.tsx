import React from 'react'

export default function HUD(){
  return (
    <div className="absolute left-4 top-4 text-white">
      <div>Room: <span id="room-id">test-room</span></div>
      <div>Health: <span id="health">100</span></div>
      <div>Armor: <span id="armor">0</span></div>
    </div>
  )
}
