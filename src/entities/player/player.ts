import { Animatable, Mesh, PhysicsBody, PhysicsMotionType } from "@babylonjs/core"
import { Scene } from "@babylonjs/core/scene"
import { getMeshByName } from "../../utils/scene"
import { PlayerStateController } from "./controller"
import { Observer } from "@babylonjs/core/Misc"
import { Nullable } from "@babylonjs/core/types"

export class Player {
  public readonly mesh: Mesh
  public readonly body: PhysicsBody

  private readonly observer: Nullable<Observer<Scene>>
  private readonly stateController: PlayerStateController

  public constructor(private readonly scene: Scene) {
    this.mesh = getMeshByName("mixamorig:Skin", scene)
    this.body = new PhysicsBody(this.mesh, PhysicsMotionType.ANIMATED, false, this.scene)
    this.body.setMassProperties({ mass: 70 })
    this.stateController = new PlayerStateController(this, this.scene)
    this.observer = this.scene.onBeforeRenderObservable.add(() => this.stateController.update())
  }

  public idle(): Animatable {
    return this.scene.beginWeightedAnimation(this.mesh, 0, 90, 0.0, true)
  }

  public walk(): Animatable {
    return this.scene.beginWeightedAnimation(this.mesh, 91, 126, 0.0, true)
  }

  public run(): Animatable {
    return this.scene.beginWeightedAnimation(this.mesh, 127, 148, 0.0, true)
  }

  public destroy(): void {
    this.scene.onBeforeRenderObservable.remove(this.observer)
  }
}
