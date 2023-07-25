import type { Scene } from "@babylonjs/core/scene"
import { blendAnimations } from "../utils/animation"
import type { AnimationGroup } from "@babylonjs/core/Animations"
import type { Nullable } from "@babylonjs/core/types"
import type { Observer } from "@babylonjs/core/Misc"

export class AnimationController {
  private currentAnimation?: AnimationGroup
  private blendingObserver: Nullable<Observer<Scene>>

  public constructor(private scene: Scene) {
  }

  public blend(animation: AnimationGroup): void {
    if (this.currentAnimation) {
      this.blendingObserver?.remove()
      this.blendingObserver = blendAnimations(this.scene, this.currentAnimation, animation)
    } else {
      animation.setWeightForAllAnimatables(1)
      animation.play(true)
    }
    this.currentAnimation = animation
  }

  public run(animation: AnimationGroup): void {
    this.currentAnimation?.stop()
    this.currentAnimation = animation
    animation.setWeightForAllAnimatables(1)
    animation.play(false)
    animation.onAnimationEndObservable.addOnce(() => this.currentAnimation = undefined)
  }
}
