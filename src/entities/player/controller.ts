import { StateController } from "../../state/controller"
import { State } from "../../state/state"
import { Player } from "./player"
import { Scene } from "@babylonjs/core/scene"
import { IdleState } from "./states/idle"
import { WalkState } from "./states/walk"
import { RunState } from "./states/run"

export class PlayerStateController extends StateController {
  public readonly idleState: State
  public readonly walkState: State
  public readonly runState: State

  public constructor(
    player: Player,
    scene: Scene,
  ) {
    super()
    this.idleState = new IdleState(scene, player)
    this.walkState = new WalkState(scene, player)
    this.runState = new RunState(scene, player)
    this.change(this.idleState)
  }
}
