import { Scene } from "@babylonjs/core/scene"
import { State } from "../../../state/state"
import { Player } from "../player"
import { PlayerStateController } from "../controller"

export class JumpInRunState implements State {
  public constructor(
    // @ts-ignore
    private readonly scene: Scene,
    private readonly player: Player,
  ) {
  }

  public onEnter(controller: PlayerStateController) {
    const jumpInRun = this.player.jumpInRun()
    jumpInRun.onAnimationEndObservable.addOnce(() => controller.change(controller.runState))
    // this.player.physicsBody.setLinearVelocity(this.player.mesh.up.scale(3))
  }

  public onExit() {
  }

  public update(_controller: PlayerStateController) {
  }
}
