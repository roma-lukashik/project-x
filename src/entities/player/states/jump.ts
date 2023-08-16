import { State } from "../../../state/state"
import { Player } from "../player"
import { PlayerStateController } from "../controller"

export class JumpState implements State {
  public constructor(
    private readonly player: Player,
  ) {
  }

  public onEnter(controller: PlayerStateController) {
    const jump = this.player.jump()
    jump.onAnimationEndObservable.addOnce(() => controller.change(controller.idle))
    this.player.camera.setPosition(Player.idleCameraPosition)
    this.player.setMoving(false)
  }

  public onExit() {
  }

  public update(_controller: PlayerStateController) {
  }
}
