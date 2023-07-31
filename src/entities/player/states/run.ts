import { State } from "../../../state/state"
import { DeviceManager, KeyboardKey } from "../../../devices/device"
import { Player } from "../player"
import { PlayerStateController } from "../controller"
import { Scene } from "@babylonjs/core/scene"
import { Nullable } from "@babylonjs/core/types"
import { Observer } from "@babylonjs/core/Misc"

export class RunState implements State {
  private observer: Nullable<Observer<Scene>>

  public constructor(
    private readonly player: Player,
    private readonly scene: Scene,
  ) {
  }

  public onEnter() {
    this.player.run()
    this.observer = this.scene.onBeforeRenderObservable.add(() => {
      this.player.physics.body.setLinearVelocity(this.player.mesh.forward.scale(this.player.runningSpeed))
    })
  }

  public onExit() {
    this.scene.onBeforeRenderObservable.remove(this.observer)
  }

  public update(controller: PlayerStateController) {
    if (!DeviceManager.getKey(KeyboardKey.Shift)) {
      if (!DeviceManager.getKey(KeyboardKey.W)) {
        controller.change(controller.idle)
      } else {
        controller.change(controller.walk)
      }
    } else {
      if (DeviceManager.getKey(KeyboardKey.Space)) {
        controller.change(controller.jumpInRun)
      }
    }
  }
}
