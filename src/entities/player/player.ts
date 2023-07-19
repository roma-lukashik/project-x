import { Scene } from "@babylonjs/core/scene"
import { getAnimationRange, getMeshByName } from "../../utils/scene"
import { PlayerStateController } from "./controller"
import { Observer } from "@babylonjs/core/Misc"
import { Nullable } from "@babylonjs/core/types"
import { Entity } from "../entity"
import { Mesh } from "@babylonjs/core/Meshes"
import { PhysicsBody, PhysicsMotionType } from "@babylonjs/core/Physics/v2"
import type { Skeleton } from "@babylonjs/core/Bones";
import { AnimationController } from "../../animation/controller";
import { PlayerAnimation } from "./animations";
import { Animatable } from "@babylonjs/core/Animations";

export class Player implements Entity {
  public readonly mesh: Mesh
  public readonly physicsBody: PhysicsBody

  private readonly observer: Nullable<Observer<Scene>>
  private readonly stateController: PlayerStateController
  private readonly animationController: AnimationController
  private readonly skeleton: Skeleton

  public constructor(private readonly scene: Scene) {
    this.mesh = getMeshByName("Alpha_Surface", scene)
    this.skeleton = scene.getSkeletonByName("Character")!
    this.physicsBody = new PhysicsBody(this.mesh, PhysicsMotionType.ANIMATED, false, this.scene)
    this.physicsBody.setMassProperties({ mass: 70 })
    this.animationController = new AnimationController(this.scene)
    this.stateController = new PlayerStateController(this, this.scene)
    this.observer = this.scene.onBeforeRenderObservable.add(() => this.stateController.update())
  }

  public idle(): Animatable {
    return this.runAnimation(PlayerAnimation.Idle)
  }

  public walk(): Animatable {
    return this.runAnimation(PlayerAnimation.Walk)
  }

  public run(): Animatable {
    return this.runAnimation(PlayerAnimation.Run)
  }

  public jump(): Animatable {
    return this.runAnimationOnce(PlayerAnimation.JumpInPlace)
  }

  public jumpInRun(): Animatable {
    return this.runAnimationOnce(PlayerAnimation.JumpInRun)
  }

  public destroy(): void {
    this.scene.onBeforeRenderObservable.remove(this.observer)
  }

  private runAnimation(animationName: PlayerAnimation) {
    const { from, to } = this.getAnimationRange(animationName)
    const animation = this.scene.beginWeightedAnimation(this.mesh, from, to, 0.0, true)
    this.animationController.runBlend(animation)
    return animation
  }

  private runAnimationOnce(animationName: PlayerAnimation) {
    const { from, to } = this.getAnimationRange(animationName)
    const animation = this.scene.beginWeightedAnimation(this.mesh, from, to, 0.0, false)
    this.animationController.run(animation)
    return animation
  }

  private getAnimationRange(animationName: PlayerAnimation) {
    return getAnimationRange(animationName, this.skeleton)
  }
}
