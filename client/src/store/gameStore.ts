// Small central store for client-side state (players, local player, etc.)
import create from 'zustand'

type Player = {
  id: string
  name: string
  position: [number, number, number]
  rotationY: number
  health: number
}

type State = {
  players: Record<string, Player>
  addOrUpdatePlayer: (p: Player) => void
  removePlayer: (id: string) => void
}

export const useGameStore = create<State>((set) => ({
  players: {},
  addOrUpdatePlayer(player) {
    set((s) => ({ players: { ...s.players, [player.id]: player } }))
  },
  removePlayer(id) {
    set((s) => {
      const copy = { ...s.players }
      delete copy[id]
      return { players: copy }
    })
  }
}))
