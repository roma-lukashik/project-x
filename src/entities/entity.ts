import { Mesh } from "@babylonjs/core/Meshes"
import { PhysicsAggregate } from "@babylonjs/core/Physics/v2"

export interface Entity extends Destroyable {
  mesh: Mesh
  physics: PhysicsAggregate
}

export interface Destroyable {
  destroy(): void
}
