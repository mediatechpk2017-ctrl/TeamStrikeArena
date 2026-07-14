// Lightweight socket wrapper for client-side networking
import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export function connectToServer(url = window.location.origin){
  if(socket) return socket
  socket = io(url)
  return socket
}

export function getSocket(){
  if(!socket) throw new Error('Socket not connected')
  return socket
}
