import { type DeviceSource, DeviceSourceManager, DeviceType } from "@babylonjs/core/DeviceInput"
import type { DeviceSourceType } from "@babylonjs/core/DeviceInput/internalDeviceSourceManager"
import type { Nullable } from "@babylonjs/core/types"
import type { Scene } from "@babylonjs/core/scene"
import type { Observer } from "@babylonjs/core/Misc"
import type { DeviceInput } from "@babylonjs/core/DeviceInput/InputDevices/deviceTypes"

export enum KeyboardKey {
  W = 87,
  A = 65,
  S = 83,
  D = 68,
  Space = 32,
  Shift = 16,
  Command = 91,
}

export const MovementKeys = [
  KeyboardKey.W,
  KeyboardKey.A,
  KeyboardKey.S,
  KeyboardKey.D,
]

export class InputController {
  private static keyboard: Nullable<DeviceSource<DeviceType.Keyboard>>
  private static mouse: Nullable<DeviceSource<DeviceType.Mouse>>
  private static deviceConnectedObserver: Nullable<Observer<DeviceSourceType>>

  public static init(scene: Scene): void {
    const dsm = new DeviceSourceManager(scene.getEngine())
    InputController.deviceConnectedObserver = dsm.onDeviceConnectedObservable.add(() => {
      InputController.keyboard = dsm.getDeviceSource(DeviceType.Keyboard)
      InputController.mouse = dsm.getDeviceSource(DeviceType.Mouse)
    })
  }

  public static dispose(): void {
    InputController.deviceConnectedObserver?.remove()
  }

  public static getKey(key: KeyboardKey): boolean {
    return InputController.keyboard?.getInput(key) === 1
  }

  public static getMouseKey(key: DeviceInput<DeviceType.Mouse>): boolean {
    return InputController.mouse?.getInput(key) === 1
  }
}
