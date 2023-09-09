import type { AnimationGroup } from "@babylonjs/core/Animations/animationGroup"

export class WeightedAnimationGroup {
  private weight = 0

  public constructor(public target: AnimationGroup) {
  }

  public getWeight(): number {
    return this.weight
  }

  public setWeight(weight: number): void {
    this.weight = weight
    this.target.setWeightForAllAnimatables(weight)
  }
}
