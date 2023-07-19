import { Scene } from "@babylonjs/core/scene"
import { Vector3 } from "@babylonjs/core/Maths";
import { State } from "../../../state/state"
import { KeyboardManager } from "../../../keyboard"
import { Player } from "../player"
import { PlayerStateController } from "../controller"

export class IdleState implements State {
  public constructor(
    // @ts-ignore
    private readonly scene: Scene,
    private readonly player: Player,
  ) {
  }

  public onEnter() {
    this.player.idle()
    this.player.physicsBody.setLinearVelocity(Vector3.Zero())
  }

  public onExit() {
  }

  public update(controller: PlayerStateController) {
    if (KeyboardManager.getKey("w")) {
      if (KeyboardManager.getKey("Shift")) {
        controller.change(controller.runState)
      } else {
        controller.change(controller.walkState)
      }
    } else if (KeyboardManager.getKey(" ")) {
      controller.change(controller.jumpState)
    }
  }
}
