import type { Scene } from "@babylonjs/core/scene"
import { type Bone, BoneIKController } from "@babylonjs/core/Bones"
import { type AbstractMesh, TransformNode } from "@babylonjs/core/Meshes"
import type { Disposable } from "../entities/entity"
import { getBoneByName, getMeshByName } from "../utils/scene"

export class IKController implements Disposable {
  public readonly target: TransformNode
  public readonly poleTarget: TransformNode
  public readonly bone: Bone

  protected readonly controller: BoneIKController
  protected readonly mesh: AbstractMesh

  public constructor(
    protected readonly scene: Scene,
    parent: TransformNode,
    meshName: string,
    boneName: string,
    targetName: string,
    poleTargetName: string,
  ) {
    this.mesh = getMeshByName(meshName, scene)
    this.bone = getBoneByName(boneName, scene)
    this.target = new TransformNode(targetName, scene)
    this.target.parent = parent
    this.poleTarget = new TransformNode(poleTargetName, scene)
    this.poleTarget.parent = parent
    this.controller = new BoneIKController(
      this.mesh,
      this.bone,
      {
        targetMesh: this.target,
        poleTargetMesh: this.poleTarget,
      },
    )
  }

  public dispose(): void {
    this.target.dispose()
    this.poleTarget.dispose()
  }

  public update(): void {
    this.controller.update()
  }
}
