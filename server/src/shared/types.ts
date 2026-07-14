// Basic players type definitions for server
export type ServerPlayer = {
  id: string
  name: string
  position: [number, number, number]
  rotationY: number
  health: number
  team?: string
}
