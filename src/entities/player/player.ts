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
  public readonly walkingSpeed = 150
  public readonly runningSpeed = this.walkingSpeed * 4

  private static readonly meshName = "__root__"

  private readonly observer: Nullable<Observer<Scene>>
  private readonly stateController: PlayerStateController
  private readonly animationController: AnimationController

  public constructor(private readonly scene: Scene) {
    this.mesh = getMeshByName(Player.meshName, scene)
    this.mesh.scaling.set(1, -1, 1) // TODO why scale is changing?
    this.physicsBody = new PhysicsBody(this.mesh, PhysicsMotionType.ANIMATED, true, this.scene)
    this.physicsBody.setMassProperties({ mass: 70 })
    this.animationController = new AnimationController(this.scene)
    this.stateController = new PlayerStateController(this)
    this.stateController.change(this.stateController.idle)
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
    this.animationController.destroy()
  }

  private runAnimationLoop(animationName: PlayerAnimation) {
    const animation = this.getAnimationGroup(animationName)
    this.animationController.run(animation)
    return animation
  }

  private runAnimationOnce(animationName: PlayerAnimation) {
    this.animationController.stop()
    const animation = this.getAnimationGroup(animationName)
    animation.setWeightForAllAnimatables(1)
    animation.play(false)
    return animation
  }

  private getAnimationGroup(animationName: PlayerAnimation) {
    return this.scene.getAnimationGroupByName(animationName)!
  }
}
