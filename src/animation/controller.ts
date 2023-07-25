import type { Scene } from "@babylonjs/core/scene"
import type { AnimationGroup } from "@babylonjs/core/Animations"
import { AnimationBlender } from "./blender"

export class AnimationController {
  private readonly blender: AnimationBlender
  private currentAnimation?: AnimationGroup

  public constructor(scene: Scene) {
    this.blender = new AnimationBlender(scene)
  }

  public blend(animation: AnimationGroup): void {
    if (this.currentAnimation) {
      this.blender.run(this.currentAnimation, animation)
    } else {
      animation.setWeightForAllAnimatables(1)
      animation.play(true)
    }
    this.currentAnimation = animation
  }

  public run(animation: AnimationGroup): void {
    this.blender.stop()
    this.currentAnimation = animation
    animation.setWeightForAllAnimatables(1)
    animation.play(false)
    animation.onAnimationEndObservable.addOnce(() => this.currentAnimation = undefined)
  }
}
