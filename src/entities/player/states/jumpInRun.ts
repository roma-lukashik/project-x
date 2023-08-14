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
    this.player.setSpeed(Player.runningSpeed)
    jumpInRun.onAnimationEndObservable.addOnce(() => controller.change(controller.run))
  }

  public onExit() {
  }

  public update(_controller: PlayerStateController) {
  }
}
