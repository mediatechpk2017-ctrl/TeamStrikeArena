# TeamStrike Arena

TeamStrike Arena is a browser-based multiplayer third-person shooter built with React, React Three Fiber, Three.js, Rapier Physics, Socket.IO, and TypeScript.

This repository contains two main folders:

- /client — The frontend game built with Vite + React + R3F
- /server — The backend authoritative server using Node.js, Express, and Socket.IO

This initial commit creates a production-ready scaffold with modular architecture, networking skeletons, and Docker deployment.

Goals for the full project (iterative):
- Full character system (Imran, Bilal, Taha, Hussain, Abass, Wasim, Umer) with animations and controllers
- Weapon systems (Rifle, Sniper, Shotgun, SMG, Pistol, Grenade) with recoil, spread, attachments
- Large map with LOD, instancing, day-night, weather
- AI bots (patrol, search, attack, take cover, flank)
- Multiplayer features: rooms, teams, prediction/interpolation, lag compensation
- UI, minimap, inventory, loot, safe zone
- Audio 3D, footsteps, gunfire
- Performance: object pooling, culling, LODs

How to run (development):

- Start server
  cd server
  pnpm install
  pnpm dev

- Start client
  cd client
  pnpm install
  pnpm dev

Docker deployment instructions are provided in the /docker folder.

License: MIT
