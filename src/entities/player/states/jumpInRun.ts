import { State } from "../../../state/state"
import { Player } from "../player"
import { PlayerStateController } from "../controller"

export class JumpInRunState implements State {
  public constructor(
    private readonly player: Player,
  ) {
  }

  public onEnter(controller: PlayerStateController) {
    const jumpInRun = this.player.jumpInRun()
    jumpInRun.onAnimationEndObservable.addOnce(() => controller.change(controller.run))
    this.player.setSpeed(Player.runningSpeed)
    this.player.setMoving(true)
    this.player.setJumpSpeed(Player.jumpingSpeed)
    this.player.camera.setPosition(Player.runCameraPosition)
  }

  public onExit() {
  }

  public update(_controller: PlayerStateController) {
  }
}
