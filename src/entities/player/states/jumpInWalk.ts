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
    this.player.setSpeed(Player.walkingSpeed)
    this.player.camera.setPosition(Player.walkCameraPosition)
    jumpInRun.onAnimationEndObservable.addOnce(() => controller.change(controller.walk))
  }

  public onExit() {
  }

  public update(_controller: PlayerStateController) {
  }
}
