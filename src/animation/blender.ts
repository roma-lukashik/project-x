import type { Scene } from "@babylonjs/core/scene"
import type { AnimationGroup } from "@babylonjs/core/Animations"
import type { Nullable } from "@babylonjs/core/types"
import type { Observer } from "@babylonjs/core/Misc"

export class AnimationBlender {
  private from: AnimationGroup
  private to: AnimationGroup
  private observer: Nullable<Observer<Scene>>

  public constructor(private readonly scene: Scene) {
  }

  public run(from: AnimationGroup, to: AnimationGroup, step = 0.01): void {
    if (this.from !== from) {
      this.from?.stop()
      this.from = from
    }
    if (this.to !== to) {
      this.to?.stop()
      this.to = to
    }
    if (this.observer) {
      this.scene.onBeforeRenderObservable.remove(this.observer)
    }
    let fromWeight = 1
    let toWeight = 0
    this.observer = this.scene.onBeforeRenderObservable.add(() => {
      if (fromWeight > 0) {
        fromWeight -= step
        toWeight += step
        from.setWeightForAllAnimatables(fromWeight)
        to.setWeightForAllAnimatables(toWeight)
      } else {
        from.setWeightForAllAnimatables(0)
        from.stop()
        to.setWeightForAllAnimatables(1)
        this.scene.onBeforeRenderObservable.remove(this.observer)
      }
    })
    this.from.play(true)
    this.to.play(true)
  }

  public stop(): void {
    this.from?.stop()
    this.to?.stop()
  }
}
