import type { State } from "../../../state/state"
import { InputController, KeyboardKey, MovementKeys } from "../../../controllers/input"
import { Player } from "../player"
import type { PlayerStateController } from "../controller"

export class WalkState implements State {
  public constructor(
    private readonly player: Player,
  ) {
  }

  public onEnter() {
    this.player.walk()
    this.player.setSpeed(Player.walkingSpeed)
    this.player.setFollowCamera(true)
    this.player.camera.position.copyFrom(Player.walkCameraPosition)
  }

  public onExit() {
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
