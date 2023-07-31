import { Vector3 } from "@babylonjs/core/Maths"
import { State } from "../../../state/state"
import { DeviceManager, KeyboardKey } from "../../../devices/device"
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
    if (DeviceManager.getKey(KeyboardKey.W)) {
      if (DeviceManager.getKey(KeyboardKey.Shift)) {
        controller.change(controller.run)
      } else {
        controller.change(controller.walk)
      }
    } else if (DeviceManager.getKey(KeyboardKey.Space)) {
      controller.change(controller.jump)
    }
  }
}
