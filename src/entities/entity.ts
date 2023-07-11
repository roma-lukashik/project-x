import { Mesh } from "@babylonjs/core/Meshes"
import { PhysicsBody } from "@babylonjs/core/Physics/v2"

export interface Entity extends Destroyable {
  mesh: Mesh
  physicsBody: PhysicsBody
}

export interface Destroyable {
  destroy(): void
}
