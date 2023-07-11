import type { StateController } from "./controller"

export interface State {
  onEnter(controller: StateController): void
  onExit(controller: StateController): void
  update(controller: StateController): void
}
