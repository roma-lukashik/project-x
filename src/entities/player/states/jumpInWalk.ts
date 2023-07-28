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
    this.player.physics.body.setLinearVelocity(this.player.mesh.forward.scale(this.player.walkingSpeed))
  }

  public onExit() {
  }

  public update(_controller: PlayerStateController) {
  }
}
