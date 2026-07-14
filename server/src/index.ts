import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const httpServer = http.createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' } })

// In-memory rooms map for prototype: { roomId: { players: Map }}
const rooms = new Map()

io.on('connection', (socket) => {
  console.log('client connected', socket.id)

  socket.on('join_room', ({ roomId, name }) => {
    if(!rooms.has(roomId)) rooms.set(roomId, { players: new Map() })
    const room = rooms.get(roomId)
    room.players.set(socket.id, { id: socket.id, name, position: [0,0,0], rotationY: 0, health: 100 })
    socket.join(roomId)

    // Notify others
    socket.to(roomId).emit('player_joined', room.players.get(socket.id))

    // Send existing players to new player
    const others = Array.from(room.players.values()).filter((p: any) => p.id !== socket.id)
    socket.emit('room_state', { players: others })
  })

  socket.on('player_update', ({ roomId, state }) => {
    const room = rooms.get(roomId)
    if(!room) return
    const player = room.players.get(socket.id)
    if(!player) return
    player.position = state.position
    player.rotationY = state.rotationY
    player.health = state.health
    // Broadcast to other players
    socket.to(roomId).emit('player_update', { id: socket.id, state: player })
  })

  socket.on('leave_room', ({ roomId }) => {
    const room = rooms.get(roomId)
    if(room) {
      room.players.delete(socket.id)
      socket.to(roomId).emit('player_left', { id: socket.id })
    }
    socket.leave(roomId)
  })

  socket.on('disconnect', () => {
    // Remove from all rooms
    rooms.forEach((room, roomId) => {
      if(room.players.has(socket.id)){
        room.players.delete(socket.id)
        socket.to(roomId).emit('player_left', { id: socket.id })
      }
    })
    console.log('client disconnected', socket.id)
  })
})

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

const PORT = process.env.PORT || 3000
httpServer.listen(PORT, () => console.log('Server listening on', PORT))
