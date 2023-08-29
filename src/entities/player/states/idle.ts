import { State } from "../../../state/state"
import { InputController, KeyboardKey, MovementKeys } from "../../../controllers/input"
import { Player } from "../player"
import { PlayerStateController } from "../controller"

export class IdleState implements State {
  public constructor(
    private readonly player: Player,
  ) {
  }

  public onEnter() {
    this.player.idle()
    this.player.setSpeed(0)
    this.player.setFollowCamera(false)
    this.player.camera.setPosition(Player.idleCameraPosition)
  }

  public onExit() {
  }

  public update(controller: PlayerStateController) {
    if (MovementKeys.some(InputController.getKey)) {
      if (InputController.getKey(KeyboardKey.Shift)) {
        controller.change(controller.run)
      } else {
        controller.change(controller.walk)
      }
    } else if (InputController.getKey(KeyboardKey.Space)) {
      controller.change(controller.jump)
    } else if (InputController.getKey(KeyboardKey.Command)) {
      controller.change(controller.aim)
    }
  }
}
