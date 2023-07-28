import { Vector3 } from "@babylonjs/core/Maths"
import { State } from "../../../state/state"
import { KeyboardManager } from "../../../keyboard"
import { Player } from "../player"
import { PlayerStateController } from "../controller"

export class IdleState implements State {
  public constructor(
    private readonly player: Player,
  ) {
  }

  public onEnter() {
    this.player.idle()
    this.player.physics.body.setLinearVelocity(Vector3.Zero())
  }

  public onExit() {
  }

  public update(controller: PlayerStateController) {
    if (KeyboardManager.getKey("w")) {
      if (KeyboardManager.getKey("Shift")) {
        controller.change(controller.run)
      } else {
        controller.change(controller.walk)
      }
    } else if (KeyboardManager.getKey(" ")) {
      controller.change(controller.jump)
    }
  }
}
