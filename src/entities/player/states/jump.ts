import { Scene } from "@babylonjs/core/scene"
import { State } from "../../../state/state"
import { Player } from "../player"
import { PlayerStateController } from "../controller"

export class JumpState implements State {
  public constructor(
    // @ts-ignore
    private readonly scene: Scene,
    private readonly player: Player,
  ) {
  }

  public onEnter(controller: PlayerStateController) {
    const jump = this.player.jump()
    jump.onAnimationEndObservable.addOnce(() => controller.change(controller.idleState))
    // this.player.physicsBody.setLinearVelocity(this.player.mesh.up.scale(3))
  }

  public onExit() {
  }

  public update(_controller: PlayerStateController) {
  }
}
