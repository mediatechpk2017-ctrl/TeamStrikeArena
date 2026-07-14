# TeamStrike Arena - Development notes

This scaffold provides the initial architecture for the TeamStrike Arena project. Next steps (I will implement iteratively):

1. Character system: character controller with movement states, animations, spine/rig integration.
2. Weapons: modular weapon base class, recoil, spread, reloading, ADS.
3. Physics: Rapier integration for character collisions, projectiles, ragdoll-ish responses.
4. Map: modular large-world streaming, instancing, terrain, vegetation.
5. AI: bot behaviors with state machines and cover-finding.
6. Networking: authoritative server, reconciliation, client-side prediction and interpolation, lag compensation for hits.
7. UI: lobby, room code flow, team selection, inventory, minimap, scoreboard.
8. Audio: 3D sound, footsteps, occlusion, ambient.

I will continue by adding the character controller, network prediction, weapon components, and a basic bot in the following commits.
