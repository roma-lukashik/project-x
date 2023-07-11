import { State } from "./state"

export class StateController {
  private currentState?: State

  public update(): void {
    this.currentState?.update(this)
  }

  public change(newState: State): void {
    this.currentState?.onExit(this)
    this.currentState = newState
    this.currentState.onEnter(this)
  }
}