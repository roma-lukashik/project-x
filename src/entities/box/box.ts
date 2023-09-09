import type { Mesh } from "@babylonjs/core/Meshes/mesh"
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder"
import type { Scene } from "@babylonjs/core/scene"
import type { Entity } from "../entity"

export class Box implements Entity {
  public readonly mesh: Mesh

  public constructor(scene: Scene) {
    this.mesh = CreateBox("Box", { size: 2 }, scene)
    this.mesh.position.set(5, 1, 4)
    this.mesh.receiveShadows = true
    this.mesh.checkCollisions = true

    const m = CreateBox("Box2", { width: 2, depth: 2, height: 1 }, scene)
    m.position.set(3, 0.5, 4)
    m.receiveShadows = true
    m.checkCollisions = true
  }

  public dispose(): void {
    this.mesh.dispose()
  }
}
