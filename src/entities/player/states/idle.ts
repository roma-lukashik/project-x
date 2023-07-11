import { Scene } from "@babylonjs/core/scene"
import { Animatable } from "@babylonjs/core"
import { State } from "../../../state/state"
import { KeyboardManager } from "../../../keyboard"
import { Player } from "../player"
import { smoothlyCancelAnimation, smoothlyStartAnimation } from "../../../utils/animation"
import { PlayerStateController } from "../controller"

export class IdleState implements State {
  private readonly idleAnimation: Animatable
  private readonly keyboard: KeyboardManager

  public constructor(
    private readonly scene: Scene,
    private readonly player: Player,
  ) {
    this.idleAnimation = this.player.idle()
    this.keyboard = new KeyboardManager(this.scene)
  }

  public onEnter() {
    smoothlyStartAnimation(this.scene, this.idleAnimation)
  }

  public onExit() {
    smoothlyCancelAnimation(this.scene, this.idleAnimation)
  }

  public update(controller: PlayerStateController) {
    if (this.keyboard.isPressed("W")) {
      if (this.keyboard.isPressed("Shift")) {
        controller.change(controller.runState)
      } else {
        controller.change(controller.walkState)
      }
    }
  }
}
