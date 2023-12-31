import type { State } from "../../../state/state"
import { Player } from "../player"
import type { PlayerStateController } from "../controller"

export class JumpState implements State {
  public constructor(
    private readonly player: Player,
  ) {
  }

  public onEnter(controller: PlayerStateController) {
    const jump = this.player.jump()
    jump.onAnimationEndObservable.addOnce(() => controller.change(controller.idle))
    this.player.camera.position.copyFrom(Player.idleCameraPosition)
    this.player.setFollowCamera(false)
    setTimeout(() => this.player.setJumpSpeed(Player.jumpingSpeed), 700)
  }

  public onExit() {
  }

  public update(_controller: PlayerStateController) {
  }
}
