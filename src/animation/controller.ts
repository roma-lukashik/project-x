import type { Animatable } from "@babylonjs/core/Animations";
import type { Scene } from "@babylonjs/core/scene";
import { blendAnimations } from "../utils/animation";

export class AnimationController {
  private currentAnimation?: Animatable

  public constructor(private scene: Scene) {
  }

  public runBlend(animation: Animatable): void {
    if (this.currentAnimation) {
      blendAnimations(this.scene, this.currentAnimation, animation)
    } else {
      animation.weight = 1.0
    }
    this.currentAnimation = animation
  }

  public run(animation: Animatable): void {
    this.currentAnimation?.stop()
    this.currentAnimation = animation
    animation.weight = 1.0
    animation.onAnimationEndObservable.addOnce(() => this.currentAnimation = undefined)
  }
}
