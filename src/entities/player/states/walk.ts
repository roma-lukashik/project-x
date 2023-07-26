import { State } from "../../../state/state"
import { KeyboardManager } from "../../../keyboard"
import { Player } from "../player"
import { PlayerStateController } from "../controller"

export class WalkState implements State {
  public constructor(
    private readonly player: Player,
  ) {
  }

  public onEnter() {
    this.player.walk()
    this.player.physicsBody.setLinearVelocity(this.player.mesh.forward.scale(this.player.walkingSpeed))
  }

  public onExit() {
  }

  public update(controller: PlayerStateController) {
    if (KeyboardManager.getKey("Shift")) {
      controller.change(controller.runState)
    } else if (!KeyboardManager.getKey("w")) {
      controller.change(controller.idleState)
    }
  }
}
