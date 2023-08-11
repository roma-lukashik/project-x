import { State } from "../../../state/state"
import { InputController, KeyboardKey, MovementKeys } from "../../../controllers/input"
import { Player } from "../player"
import { PlayerStateController } from "../controller"
import { Scene } from "@babylonjs/core/scene"
import { Nullable } from "@babylonjs/core/types"
import { Observer } from "@babylonjs/core/Misc"
import { Scalar } from "@babylonjs/core/Maths"

export class WalkState implements State {
  private observer: Nullable<Observer<Scene>>

  public constructor(
    private readonly player: Player,
    private readonly scene: Scene,
  ) {
  }

  public onEnter() {
    const animation = this.player.walk()
    const initialSpeed = this.player.speed
    this.observer = this.scene.onBeforeRenderObservable.add(() => {
      this.player.speed = Scalar.Lerp(initialSpeed, this.player.walkingSpeed, animation.getWeight())
      this.player.followCamera()
      this.player.updateMoveDirection()
    })
  }

  public onExit() {
    this.scene.onBeforeRenderObservable.remove(this.observer)
  }

  public update(controller: PlayerStateController) {
    if (!MovementKeys.some(InputController.getKey)) {
      controller.change(controller.idle)
      return
    }
    if (InputController.getKey(KeyboardKey.Shift)) {
      controller.change(controller.run)
      return
    }
    if (InputController.getKey(KeyboardKey.Space)) {
      controller.change(controller.jumpInWalk)
    }
  }
}
