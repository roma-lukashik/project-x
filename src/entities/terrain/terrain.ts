import type { Entity } from "../entity"
import { CreateGround, type Mesh } from "@babylonjs/core/Meshes"
import type { Scene } from "@babylonjs/core/scene"
import { Color3, Vector3 } from "@babylonjs/core/Maths"
import { StandardMaterial } from "@babylonjs/core/Materials"

export class Terrain implements Entity {
  public readonly mesh: Mesh

  public constructor(scene: Scene, size: number) {
    this.mesh = CreateGround("Terrain", { width: size, height: size, subdivisions: 2 }, scene)
    this.mesh.position = Vector3.Zero()
    this.mesh.receiveShadows = true
    this.mesh.checkCollisions = true
    this.mesh.material = this.createMaterial(scene)
  }

  public dispose(): void {
    this.mesh.dispose()
  }

  private createMaterial(scene: Scene) {
    const material = new StandardMaterial("Terrain", scene)
    material.diffuseColor = Color3.Gray().scale(1.2)
    material.specularColor = Color3.Black()
    material.roughness = 0.5

    return material
  }
}
