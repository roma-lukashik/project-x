import { Scene } from "@babylonjs/core/scene";
import { Animatable } from "@babylonjs/core";
import { State } from "../../../state/state";
import { KeyboardManager } from "../../../keyboard";
import { Player } from "../player";
import { smoothlyCancelAnimation, smoothlyStartAnimation } from "../../../utils/animation";
import { PlayerStateController } from "../controller";

export class WalkState implements State {
  private readonly walkAnimation: Animatable
  private readonly keyboard: KeyboardManager

  public constructor(
    private readonly scene: Scene,
    private readonly player: Player,
  ) {
    this.walkAnimation = this.player.walk()
    this.keyboard = new KeyboardManager(this.scene)
  }

  public onEnter() {
    smoothlyStartAnimation(this.scene, this.walkAnimation)
  }

  public onExit() {
    smoothlyCancelAnimation(this.scene, this.walkAnimation)
  }

  public update(controller: PlayerStateController) {
    if (this.keyboard.isPressed("Shift")) {
      controller.change(controller.runState)
    } else if (!this.keyboard.isPressed("W")) {
      controller.change(controller.idleState)
    }
  }
}
