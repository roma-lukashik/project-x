import type { Scene } from "@babylonjs/core/scene"
import type { TransformNode } from "@babylonjs/core/Meshes/transformNode"
import { IKController } from "../../controllers/ikController"

export class PlayerIKController extends IKController {
  public constructor(
    protected readonly scene: Scene,
    parent: TransformNode,
    boneName: string,
  ) {
    super(scene, parent, "Alpha_Joints", boneName, `${boneName}_IKTarget`, `${boneName}_IKPoleTarget`)
  }
}
