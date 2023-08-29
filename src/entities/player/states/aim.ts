import { State } from "../../../state/state"
import { Player } from "../player"
import { InputController, KeyboardKey } from "../../../controllers/input"
import { PlayerStateController } from "../controller"
import { Vector3 } from "@babylonjs/core/Maths"

export class AimState implements State {
  public constructor(
    private readonly player: Player,
  ) {
  }

  public onEnter() {
    this.player.rightHand.target.position = new Vector3(0.3, 0.4, -0.41)
    this.player.rightHand.poleTarget.position = new Vector3(0.4, -0.33, -0.67)
    this.player.leftHand.target.position = new Vector3(-0.7, 0, -0.3)
    this.player.leftHand.poleTarget.position = new Vector3(-2.5, 0, -1.7)
    this.player.aiming()
    this.player.setFollowCamera(true)
    this.player.camera.setPosition(Player.aimingCameraPosition)
  }

  public onExit() {
  }

  public update(controller: PlayerStateController) {
    if (!InputController.getKey(KeyboardKey.Command)) {
      controller.change(controller.idle)
    } else {
      this.player.rightHand.update()
      this.player.leftHand.update()
    }
  }
}
