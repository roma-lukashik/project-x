import { Entity } from "../entity"
import { Mesh, TransformNode } from "@babylonjs/core/Meshes"
import { Scene } from "@babylonjs/core/scene"
import { getMeshByName } from "../../utils/scene"
import type { Bone } from "@babylonjs/core/Bones"
import { Vector3 } from "@babylonjs/core/Maths";

export class Pistol implements Entity {
  public readonly mesh: Mesh

  public constructor(
    private readonly name: string,
    private readonly scene: Scene,
  ) {
    this.mesh = getMeshByName(this.name, this.scene)
    this.mesh.isPickable = false
    this.mesh.getChildMeshes().forEach((mesh) => mesh.isPickable = false)
    this.mesh.checkCollisions = false
  }

  public attach(bone: Bone, transformNode: TransformNode): void {
    this.mesh.scaling = new Vector3(100, 100, 100)
    this.mesh.rotation = new Vector3(-Math.PI / 2, Math.PI / 2, Math.PI)
    this.mesh.position = new Vector3(5, 10, 0)
    this.mesh.attachToBone(bone, transformNode)
  }

  public dispose(): void {
    this.mesh.dispose()
  }
}
