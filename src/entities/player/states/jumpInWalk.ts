import { State } from "../../../state/state"
import { Player } from "../player"
import { PlayerStateController } from "../controller"

export class JumpInWalkState implements State {
  public constructor(
    private readonly player: Player,
  ) {
  }

  public onEnter(controller: PlayerStateController) {
    const jumpInRun = this.player.jumpInRun()
    jumpInRun.onAnimationEndObservable.addOnce(() => controller.change(controller.walk))
    this.player.setSpeed(Player.walkingSpeed)
    this.player.setMoving(true)
    this.player.setJumpSpeed(Player.jumpingSpeed)
    this.player.camera.setPosition(Player.walkCameraPosition)
  }

  public onExit() {
  }

  public update(_controller: PlayerStateController) {
  }
}
