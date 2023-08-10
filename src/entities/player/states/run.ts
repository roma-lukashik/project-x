import { State } from "../../../state/state"
import { InputController, KeyboardKey } from "../../../controllers/input"
import { Player } from "../player"
import { PlayerStateController } from "../controller"
import { Scene } from "@babylonjs/core/scene"
import { Nullable } from "@babylonjs/core/types"
import { Observer } from "@babylonjs/core/Misc"
import { Scalar } from "@babylonjs/core/Maths"

export class RunState implements State {
  private observer: Nullable<Observer<Scene>>

  public constructor(
    private readonly player: Player,
    private readonly scene: Scene,
  ) {
  }

  public onEnter() {
    const animation = this.player.run()
    const initialSpeed = this.player.speed
    this.player.speed = this.player.runningSpeed
    this.observer = this.scene.onBeforeRenderObservable.add(() => {
      this.player.speed = Scalar.Lerp(initialSpeed, this.player.runningSpeed, animation.getWeight())
      this.player.followCamera()
      this.player.updateMoveDirection()
    })
  }

  public onExit() {
    this.scene.onBeforeRenderObservable.remove(this.observer)
  }

  public update(controller: PlayerStateController) {
    if (!InputController.getKey(KeyboardKey.Shift)) {
      if (!InputController.getKey(KeyboardKey.W)) {
        controller.change(controller.idle)
      } else {
        controller.change(controller.walk)
      }
    } else {
      if (InputController.getKey(KeyboardKey.Space)) {
        controller.change(controller.jumpInRun)
      }
    }
  }
}
