import type { State } from "../../../state/state"
import type { Player } from "../player"
import { Vector3 } from "@babylonjs/core/Maths/math.vector"
import type { Scene } from "@babylonjs/core/scene"
import type { PlayerStateController } from "../controller"
import { animate } from "../../../utils/animate"
import type { DeepImmutable } from "@babylonjs/core/types"

export class ShootState implements State {
  private static readonly shootDuration = 200
  private static readonly kickbackVector: DeepImmutable<Vector3> = new Vector3(0, -0.08, 0)
  private static readonly kickbackCameraShake: DeepImmutable<Vector3> = new Vector3(0, 0.1, 0)

  private readonly rightHandStartPosition = Vector3.Zero()
  private readonly rightHandEndPosition = Vector3.Zero()
  private readonly leftHandStartPosition = Vector3.Zero()
  private readonly leftHandEndPosition = Vector3.Zero()
  private readonly cameraStartPosition = Vector3.Zero()
  private readonly cameraEndPosition = Vector3.Zero()

  private get rightHandPosition(): Vector3 {
    return this.player.rightHand.target.position
  }

  private get leftHandPosition(): Vector3 {
    return this.player.leftHand.target.position
  }

  public constructor(
    private readonly player: Player,
    private readonly scene: Scene,
  ) {
  }

  public onEnter(controller: PlayerStateController) {
    this.rightHandStartPosition.copyFrom(this.rightHandPosition)
    this.rightHandStartPosition.addToRef(ShootState.kickbackVector, this.rightHandEndPosition)
    this.leftHandStartPosition.copyFrom(this.leftHandPosition)
    this.leftHandStartPosition.addToRef(ShootState.kickbackVector, this.leftHandEndPosition)
    this.cameraStartPosition.copyFrom(this.player.camera.position)
    this.cameraStartPosition.addToRef(ShootState.kickbackCameraShake, this.cameraEndPosition)
    animate(
      this.scene,
      ShootState.shootDuration,
      (elapsed) => this.onShootInProgress(elapsed),
      () => this.onShootEnd(controller),
    )
  }

  public onExit() {
  }

  public update() {
    this.player.rightHand.update()
    this.player.leftHand.update()
  }

  private onShootInProgress(elapsed: number) {
    const amount = elapsed * 2
    if (amount < 1) {
      Vector3.LerpToRef(this.rightHandStartPosition, this.rightHandEndPosition, amount, this.rightHandPosition)
      Vector3.LerpToRef(this.leftHandStartPosition, this.leftHandEndPosition, amount, this.leftHandPosition)
      Vector3.LerpToRef(this.cameraStartPosition, this.cameraEndPosition, amount, this.player.camera.position)
    } else {
      Vector3.LerpToRef(this.rightHandEndPosition, this.rightHandStartPosition, amount - 1, this.rightHandPosition)
      Vector3.LerpToRef(this.leftHandEndPosition, this.leftHandStartPosition, amount - 1, this.leftHandPosition)
      Vector3.LerpToRef(this.cameraEndPosition, this.cameraStartPosition, amount - 1, this.player.camera.position)
    }
  }

  private onShootEnd(controller: PlayerStateController) {
    controller.change(controller.aim)
  }
}
