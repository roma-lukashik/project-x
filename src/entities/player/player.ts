import { Scene } from "@babylonjs/core/scene"
import { getMeshByName } from "../../utils/scene"
import { PlayerStateController } from "./controller"
import { Observer } from "@babylonjs/core/Misc"
import { Nullable } from "@babylonjs/core/types"
import { Entity } from "../entity"
import { Mesh } from "@babylonjs/core/Meshes"
import { PhysicsBody, PhysicsMotionType } from "@babylonjs/core/Physics/v2"
import { AnimationController } from "../../animation/controller"
import { PlayerAnimation } from "./animations"
import { AnimationGroup } from "@babylonjs/core/Animations"

export class Player implements Entity {
  public readonly mesh: Mesh
  public readonly physicsBody: PhysicsBody

  private readonly observer: Nullable<Observer<Scene>>
  private readonly stateController: PlayerStateController
  private readonly animationController: AnimationController

  public constructor(private readonly scene: Scene) {
    this.mesh = getMeshByName("Alpha_Surface", scene)
    this.physicsBody = new PhysicsBody(this.mesh, PhysicsMotionType.ANIMATED, false, this.scene)
    this.physicsBody.setMassProperties({ mass: 70 })
    this.animationController = new AnimationController(this.scene)
    this.stateController = new PlayerStateController(this, this.scene)
    this.stateController.change(this.stateController.idleState)
    this.observer = this.scene.onBeforeRenderObservable.add(() => this.stateController.update())
  }

  public idle(): AnimationGroup {
    return this.runAnimationLoop(PlayerAnimation.Idle)
  }

  public walk(): AnimationGroup {
    return this.runAnimationLoop(PlayerAnimation.Walk)
  }

  public run(): AnimationGroup {
    return this.runAnimationLoop(PlayerAnimation.Run)
  }

  public jump(): AnimationGroup {
    return this.runAnimationOnce(PlayerAnimation.JumpInPlace)
  }

  public jumpInRun(): AnimationGroup {
    return this.runAnimationOnce(PlayerAnimation.JumpInRun)
  }

  public destroy(): void {
    this.scene.onBeforeRenderObservable.remove(this.observer)
  }

  private runAnimationLoop(animationName: PlayerAnimation) {
    const animation = this.getAnimationGroup(animationName)
    this.animationController.blend(animation)
    return animation
  }

  private runAnimationOnce(animationName: PlayerAnimation) {
    const animation = this.getAnimationGroup(animationName)
    this.animationController.run(animation)
    return animation
  }

  private getAnimationGroup(animationName: PlayerAnimation) {
    return this.scene.getAnimationGroupByName(animationName)!
  }
}
