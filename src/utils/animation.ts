import type { Scene } from "@babylonjs/core/scene"
import type { AnimationGroup } from "@babylonjs/core/Animations"

export function blendAnimations(
  scene: Scene,
  from: AnimationGroup,
  to: AnimationGroup,
  step = 0.01,
) {
  let fromWeight = 1
  let toWeight = 0
  const observer = scene.onBeforeRenderObservable.add(() => {
    if (fromWeight > 0) {
      fromWeight -= step
      toWeight += step
      from.setWeightForAllAnimatables(fromWeight)
      to.setWeightForAllAnimatables(toWeight)
    } else {
      from.setWeightForAllAnimatables(0)
      from.stop()
      to.setWeightForAllAnimatables(1)
      scene.onBeforeRenderObservable.remove(observer)
    }
  })
  from.play(true)
  to.play(true)
  return observer
}
