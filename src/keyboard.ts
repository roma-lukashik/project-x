import { Scene } from "@babylonjs/core/scene";
import { Observer } from "@babylonjs/core/Misc";
import { KeyboardEventTypes, KeyboardInfo } from "@babylonjs/core/Events/keyboardEvents";
import { Nullable } from "@babylonjs/core/types";

export class KeyboardManager {
  private readonly keyPressed: Set<string> = new Set()
  private readonly observer: Nullable<Observer<KeyboardInfo>>

  public constructor(private readonly scene: Scene) {
    this.observer = scene.onKeyboardObservable.add(this.handleKeyboardEvent)
  }

  public isPressed(key: string): boolean {
    return this.keyPressed.has(key)
  }

  public dispose(): void {
    this.scene.onKeyboardObservable.remove(this.observer)
    this.keyPressed.clear()
  }

  private handleKeyboardEvent = (kbInfo: KeyboardInfo) => {
    switch (kbInfo.type) {
      case KeyboardEventTypes.KEYDOWN:
        switch (kbInfo.event.key) {
          case "W":
          case "w":
            this.keyPressed.add("W")
            break;
          case "Shift":
            this.keyPressed.add("Shift")
            break;
        }
        break;
      case KeyboardEventTypes.KEYUP:
        switch (kbInfo.event.key) {
          case "W":
          case "w":
            this.keyPressed.delete("W")
            break;
          case "Shift":
            this.keyPressed.delete("Shift")
            break;
        }
        break;
    }
  }
}
