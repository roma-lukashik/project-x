import { Entity } from "../entity"
import { CreateGround, Mesh } from "@babylonjs/core/Meshes"
import { PhysicsAggregate } from "@babylonjs/core/Physics/v2"
import { Scene } from "@babylonjs/core/scene"
import { Color3, Vector3 } from "@babylonjs/core/Maths"
import { PhysicsShapeType, StandardMaterial } from "@babylonjs/core"

export class Terrain implements Entity {
  public readonly mesh: Mesh
  public readonly physics: PhysicsAggregate

  public constructor(scene: Scene, size: number) {
    this.mesh = CreateGround("Terrain", { width: size, height: size, subdivisions: 2 }, scene)
    this.mesh.position = Vector3.Zero()
    this.mesh.receiveShadows = true
    this.mesh.checkCollisions = true
    this.mesh.material = this.createMaterial(scene)
    this.physics = new PhysicsAggregate(
      this.mesh,
      PhysicsShapeType.BOX,
      { mass: 0, friction: 0.2, restitution: 0.3 },
      scene,
    )
  }

  public destroy(): void {
    this.mesh.dispose()
    this.physics.dispose()
  }

  private createMaterial(scene: Scene) {
    const material = new StandardMaterial("Terrain", scene)
    material.diffuseColor = Color3.Gray().scale(1.2)
    material.specularColor = Color3.Black()
    material.roughness = 0.5

    return material
  }
}
