import { State } from "../../../state/state"
import { KeyboardManager } from "../../../keyboard"
import { Player } from "../player"
import { PlayerStateController } from "../controller"

export class RunState implements State {
  public constructor(
    private readonly player: Player,
  ) {
  }

  public onEnter() {
    this.player.run()
    this.player.physicsBody.setLinearVelocity(this.player.mesh.forward.scale(this.player.runningSpeed))
  }

  public onExit() {
  }

  public update(controller: PlayerStateController) {
    if (!KeyboardManager.getKey("Shift")) {
      if (!KeyboardManager.getKey("w")) {
        controller.change(controller.idleState)
      } else {
        controller.change(controller.walkState)
      }
    } else {
      if (KeyboardManager.getKey(" ")) {
        controller.change(controller.jumpInRunState)
      }
    }
  }
}
