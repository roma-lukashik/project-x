import { State } from "../../../state/state"
import { InputController, KeyboardKey, MovementKeys } from "../../../controllers/input"
import { Player } from "../player"
import { PlayerStateController } from "../controller"

export class RunState implements State {
  public constructor(
    private readonly player: Player,
  ) {
  }

  public onEnter() {
    this.player.run()
    this.player.setSpeed(Player.runningSpeed)
    this.player.camera.setPosition(Player.runCameraPosition)
  }

  public onExit() {
  }

  public update(controller: PlayerStateController) {
    if (!MovementKeys.some(InputController.getKey)) {
      controller.change(controller.idle)
      return
    }
    if (!InputController.getKey(KeyboardKey.Shift)) {
      controller.change(controller.walk)
      return
    }
    if (InputController.getKey(KeyboardKey.Space)) {
      controller.change(controller.jumpInRun)
    }
  }
}
