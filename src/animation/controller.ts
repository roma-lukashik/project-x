import type { Scene } from "@babylonjs/core/scene"
import type { AnimationGroup } from "@babylonjs/core/Animations/animationGroup"
import type { Nullable } from "@babylonjs/core/types"
import type { Observer } from "@babylonjs/core/Misc/observable"
import { WeightedAnimationGroup } from "./weightedAnimationGroup"

export class AnimationController {
  private readonly animationsPool: Map<string, WeightedAnimationGroup> = new Map()
  private readonly observer: Nullable<Observer<Scene>>
  private current: WeightedAnimationGroup

  public constructor(
    private readonly scene: Scene,
    private readonly step = 0.025,
  ) {
    this.observer = this.scene.onBeforeRenderObservable.add(this.changeAnimationsWeights)
  }

  public run(animation: AnimationGroup): WeightedAnimationGroup {
    this.current = this.animationsPool.get(animation.name) ?? new WeightedAnimationGroup(animation)

    if (!this.animationsPool.has(animation.name)) {
      this.animationsPool.set(animation.name, this.current)
      this.current.setWeight(0)
      this.current.target.play(true)
    }

    if (this.animationsPool.size === 1) {
      this.current.setWeight(1)
    }

    return this.current
  }

  public stop(): void {
    this.animationsPool.forEach(({ target }) => target.stop())
    this.animationsPool.clear()
  }

  public dispose(): void {
    this.stop()
    this.scene.onBeforeRenderObservable.remove(this.observer)
  }

  private changeAnimationsWeights = () => {
    this.animationsPool.forEach((animation) => {
      const weight = this.calculateWeight(animation)
      animation.setWeight(weight)
      if (weight === 0) {
        animation.target.stop()
        this.animationsPool.delete(animation.target.name)
      }
    })
  }

  private calculateWeight(animation: WeightedAnimationGroup) {
    const weight = animation.getWeight()
    const size = this.animationsPool.size - 1
    return animation === this.current ? Math.min(weight + this.step, 1) : Math.max(weight - this.step / size, 0)
  }
}
