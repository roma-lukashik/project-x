import type { Entity } from "../entity"
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder"
import type { Mesh } from "@babylonjs/core/Meshes/mesh"
import type { Scene } from "@babylonjs/core/scene"
import { Vector3 } from "@babylonjs/core/Maths/math.vector"
import { Color3 } from "@babylonjs/core/Maths/math.color"
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial"

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
