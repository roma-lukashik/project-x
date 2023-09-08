import playerModel from "./assets/player.gltf"
import gunModel from "./assets/gun.gltf"
import idle from "./assets/idle.gltf"
import jumpInPlace from "./assets/jumpInPlace.gltf"
import jumpInRun from "./assets/jumpInRun.gltf"
import pistolIdle from "./assets/pistolIdle.gltf"
import run from "./assets/run.gltf"
import walk from "./assets/walk.gltf"
import type { AssetsBundle } from "./loaders/assetsLoader"

export const gameBundle: AssetsBundle = {
  models: {
    Player: playerModel,
    Pistol: gunModel,
  },
  animations: {
    Idle: idle,
    JumpInPlace: jumpInPlace,
    JumpInRun: jumpInRun,
    PistolIdle: pistolIdle,
    Run: run,
    Walk: walk,
  },
}
