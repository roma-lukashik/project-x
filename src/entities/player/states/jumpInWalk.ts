import { State } from "../../../state/state"
import { Player } from "../player"
import { PlayerStateController } from "../controller"
import { Scene } from "@babylonjs/core/scene"
import { Nullable } from "@babylonjs/core/types"
import { Observer } from "@babylonjs/core/Misc"

export class JumpInWalkState implements State {
  private observer: Nullable<Observer<Scene>>

  public constructor(
    private readonly player: Player,
    private readonly scene: Scene,
  ) {
  }

  public onEnter(controller: PlayerStateController) {
    const jumpInRun = this.player.jumpInRun()
    jumpInRun.onAnimationEndObservable.addOnce(() => controller.change(controller.walk))
    this.observer = this.scene.onBeforeRenderObservable.add(() => {
      this.player.followCamera()
      this.player.physics.body.setLinearVelocity(
        this.player.cameraTarget.forward.multiplyByFloats(this.player.walkingSpeed, 0, this.player.walkingSpeed)
      )
    })
  }

  public onExit() {
    this.scene.onBeforeRenderObservable.remove(this.observer)
  }

  public update(_controller: PlayerStateController) {
  }
}
