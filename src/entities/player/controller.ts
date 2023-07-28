import { StateController } from "../../state/controller"
import { State } from "../../state/state"
import { Player } from "./player"
import { IdleState } from "./states/idle"
import { WalkState } from "./states/walk"
import { RunState } from "./states/run"
import { JumpState } from "./states/jump"
import { JumpInWalkState } from "./states/jumpInWalk"
import { JumpInRunState } from "./states/jumpInRun"
import { Scene } from "@babylonjs/core/scene"

export class PlayerStateController extends StateController {
  public readonly idle: State
  public readonly walk: State
  public readonly run: State
  public readonly jump: State
  public readonly jumpInWalk: State
  public readonly jumpInRun: State

  public constructor(player: Player, scene: Scene) {
    super()
    this.idle = new IdleState(player)
    this.walk = new WalkState(player, scene)
    this.run = new RunState(player, scene)
    this.jump = new JumpState(player)
    this.jumpInWalk = new JumpInWalkState(player)
    this.jumpInRun = new JumpInRunState(player)
  }
}
