import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-sky-900 to-slate-800 text-white">
      <div className="p-8 bg-black/40 rounded-lg shadow-lg max-w-xl w-full">
        <h1 className="text-4xl font-bold mb-4">TeamStrike Arena</h1>
        <p className="mb-6">A browser-based multiplayer third-person shooter — prototype scaffolding.</p>
        <div className="flex gap-3">
          <Link to="/game/test-room" className="px-4 py-2 bg-blue-600 rounded">Join Test Room</Link>
        </div>
      </div>
    </div>
  )
}
