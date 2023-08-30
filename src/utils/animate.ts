import type { Scene } from "@babylonjs/core/scene"
import type { Nullable } from "@babylonjs/core/types"
import type { Observer } from "@babylonjs/core/Misc"

export function animate(
  scene: Scene,
  duration: number,
  onProgress: (elapsed: number) => void,
  onEnd: () => void,
): Nullable<Observer<Scene>> {
  const startTime = Date.now()
  const observer = scene.onBeforeRenderObservable.add(() => {
    const elapsed = (Date.now() - startTime) / duration
    if (elapsed > 1) {
      scene.onBeforeRenderObservable.remove(observer)
      onEnd()
    } else {
      onProgress(elapsed)
    }
  })
  return observer
}
