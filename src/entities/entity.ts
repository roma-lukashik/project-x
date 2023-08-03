import { Mesh } from "@babylonjs/core/Meshes"

export interface Entity extends Destroyable {
  mesh: Mesh
}

export interface Destroyable {
  destroy(): void
}
