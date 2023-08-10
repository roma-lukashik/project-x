import { State } from "../../../state/state"
import { InputController, KeyboardKey } from "../../../controllers/input"
import { Player } from "../player"
import { PlayerStateController } from "../controller"

export class IdleState implements State {
  public constructor(
    private readonly player: Player,
  ) {
  }

  public onEnter() {
    this.player.idle()
    this.player.returnCamera()
    this.player.speed = 0
    this.player.updateMoveDirection()
  }

  public onExit() {
    this.player.previousRotation = this.player.mesh.rotation.clone()
  }

  public update(controller: PlayerStateController) {
    if (InputController.getKey(KeyboardKey.W)) {
      if (InputController.getKey(KeyboardKey.Shift)) {
        controller.change(controller.run)
      } else {
        controller.change(controller.walk)
      }
    } else if (InputController.getKey(KeyboardKey.Space)) {
      controller.change(controller.jump)
    }
  }
}
