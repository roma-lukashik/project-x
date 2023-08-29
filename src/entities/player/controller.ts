import { StateController } from "../../state/controller"
import type { State } from "../../state/state"
import type { Player } from "./player"
import { IdleState } from "./states/idle"
import { WalkState } from "./states/walk"
import { RunState } from "./states/run"
import { JumpState } from "./states/jump"
import { JumpInWalkState } from "./states/jumpInWalk"
import { JumpInRunState } from "./states/jumpInRun"
import { AimState } from "./states/aim"

export class PlayerStateController extends StateController {
  public readonly idle: State
  public readonly aim: State
  public readonly walk: State
  public readonly run: State
  public readonly jump: State
  public readonly jumpInWalk: State
  public readonly jumpInRun: State

  public constructor(player: Player) {
    super()
    this.idle = new IdleState(player)
    this.aim = new AimState(player)
    this.walk = new WalkState(player)
    this.run = new RunState(player)
    this.jump = new JumpState(player)
    this.jumpInWalk = new JumpInWalkState(player)
    this.jumpInRun = new JumpInRunState(player)
  }
}
