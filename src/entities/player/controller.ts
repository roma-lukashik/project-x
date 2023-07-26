import { StateController } from "../../state/controller"
import { State } from "../../state/state"
import { Player } from "./player"
import { IdleState } from "./states/idle"
import { WalkState } from "./states/walk"
import { RunState } from "./states/run"
import { JumpState } from "./states/jump"
import { JumpInRunState } from "./states/jumpInRun"

export class PlayerStateController extends StateController {
  public readonly idleState: State
  public readonly walkState: State
  public readonly runState: State
  public readonly jumpState: State
  public readonly jumpInRunState: State

  public constructor(player: Player) {
    super()
    this.idleState = new IdleState(player)
    this.walkState = new WalkState(player)
    this.runState = new RunState(player)
    this.jumpState = new JumpState(player)
    this.jumpInRunState = new JumpInRunState(player)
  }
}
