import { type DeviceSource, DeviceSourceManager, DeviceType } from "@babylonjs/core/DeviceInput"
import type { DeviceSourceType } from "@babylonjs/core/DeviceInput/internalDeviceSourceManager"
import type { Nullable } from "@babylonjs/core/types"
import type { Scene } from "@babylonjs/core/scene"
import type { Observer } from "@babylonjs/core/Misc"

export enum KeyboardKey {
  W = 87,
  A = 65,
  S = 83,
  D = 69,
  Space = 32,
  Shift = 16,
}

export class DeviceManager {
  private static keyboard: Nullable<DeviceSource<DeviceType.Keyboard>>
  private static deviceConnectedObserver: Nullable<Observer<DeviceSourceType>>

  public static init(scene: Scene): void {
    const dsm = new DeviceSourceManager(scene.getEngine())
    DeviceManager.deviceConnectedObserver = dsm.onDeviceConnectedObservable.add(() => {
      DeviceManager.keyboard = dsm.getDeviceSource(DeviceType.Keyboard)
    })
  }

  public dispose(): void {
    DeviceManager.deviceConnectedObserver?.remove()
  }

  public static getKey(key: KeyboardKey): boolean {
    return DeviceManager.keyboard?.getInput(key) === 1
  }
}
