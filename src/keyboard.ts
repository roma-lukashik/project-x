import { Scene } from "@babylonjs/core/scene"
import { ActionEvent, ActionManager, ExecuteCodeAction } from "@babylonjs/core/Actions";

export class KeyboardManager {
  private static readonly keys: Set<string> = new Set()

  public static init(scene: Scene) {
    scene.actionManager = new ActionManager(scene)
    scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, KeyboardManager.handleKeyDown))
    scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, KeyboardManager.handleKeyUp))
  }

  public static getKey(keyName: string): boolean {
    return KeyboardManager.keys.has(keyName)
  }

  public static dispose(): void {
    KeyboardManager.keys.clear()
  }

  private static handleKeyDown = (event: ActionEvent) => {
    KeyboardManager.keys.add(event.sourceEvent.key)
  }

  private static handleKeyUp = (event: ActionEvent) => {
    KeyboardManager.keys.delete(event.sourceEvent.key)
  }
}
