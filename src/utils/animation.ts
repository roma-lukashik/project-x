import type { Scene } from "@babylonjs/core/scene"
import type { Animatable } from "@babylonjs/core/Animations"

export function blendAnimations(
  scene: Scene,
  from: Animatable,
  to: Animatable,
  step = 0.01,
) {
  const observer = scene.onBeforeRenderObservable.add(() => {
    if (from.weight > 0) {
      from.weight -= step
      to.weight += step
    } else {
      from.weight = 0
      to.weight = 1
      scene.onBeforeRenderObservable.remove(observer)
    }
  })
  from.weight = 1
  to.weight = 0
  to.syncWith(null)
  from.syncWith(to)
  return observer
}

export function smoothlyStartAnimation(
  scene: Scene,
  animation: Animatable,
  step = 0.01,
) {
  const observer = scene.onBeforeRenderObservable.add(() => {
    if (animation.weight < 1) {
      animation.weight += step
    } else {
      animation.weight = 1
      scene.onBeforeRenderObservable.remove(observer)
    }
  })
  animation.weight = 0
  return observer
}

export function smoothlyCancelAnimation(
  scene: Scene,
  animation: Animatable,
  step = 0.01,
) {
  const observer = scene.onBeforeRenderObservable.add(() => {
    if (animation.weight > 0) {
      animation.weight -= step
    } else {
      animation.weight = 0
      scene.onBeforeRenderObservable.remove(observer)
    }
  })
  animation.weight = 1
  return observer
}
