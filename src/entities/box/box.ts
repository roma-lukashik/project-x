import { CreateBox, type Mesh } from "@babylonjs/core/Meshes"
import {
  PhysicsAggregate,
  PhysicsShapeType,
} from "@babylonjs/core/Physics/v2"
import { Scene } from "@babylonjs/core/scene"
import type { Entity } from "../entity"

export class Box implements Entity {
  public readonly mesh: Mesh
  public readonly physics: PhysicsAggregate

  public constructor(scene: Scene) {
    this.mesh = CreateBox("Box", { size: 2 })
    this.mesh.position.set(5, 1, 4)
    this.mesh.receiveShadows = true
    this.mesh.checkCollisions = true
    this.physics = new PhysicsAggregate(
      this.mesh,
      PhysicsShapeType.BOX,
      { mass: 0, friction: 0.5, restitution: 0.6 },
      scene,
    )
  }

  public dispose(): void {
    this.mesh.dispose()
    this.physics.dispose()
  }
}
