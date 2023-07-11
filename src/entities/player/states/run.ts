import { Scene } from "@babylonjs/core/scene";
import { Animatable } from "@babylonjs/core";
import { State } from "../../../state/state";
import { KeyboardManager } from "../../../keyboard";
import { Player } from "../player";
import {
  smoothlyCancelAnimation,
  smoothlyStartAnimation
} from "../../../utils/animation";
import { PlayerStateController } from "../controller";

export class RunState implements State {
  private readonly runAnimation: Animatable
  private readonly keyboard: KeyboardManager

  public constructor(
    private readonly scene: Scene,
    private readonly player: Player,
  ) {
    this.runAnimation = this.player.run()
    this.keyboard = new KeyboardManager(this.scene)
  }

  public onEnter() {
    smoothlyStartAnimation(this.scene, this.runAnimation)
  }

  public onExit() {
    smoothlyCancelAnimation(this.scene, this.runAnimation)
  }

  public update(controller: PlayerStateController) {
    if (!this.keyboard.isPressed("Shift")) {
      if (!this.keyboard.isPressed("W")) {
        controller.change(controller.idleState)
      } else {
        controller.change(controller.walkState)
      }
    }
  }
}
