import { Scene } from "@babylonjs/core/scene"
import { getAnimationGroupByName, getMeshByName } from "../../utils/scene"
import { PlayerStateController } from "./controller"
import { Observer } from "@babylonjs/core/Misc"
import { Nullable } from "@babylonjs/core/types"
import { Entity } from "../entity"
import { CreateBox, Mesh, TransformNode } from "@babylonjs/core/Meshes"
import { AnimationController } from "../../animation/controller"
import { PlayerAnimation } from "./animations"
import { AnimationGroup } from "@babylonjs/core/Animations"

export class Player implements Entity {
  private static readonly meshName = "__root__"

  public readonly mesh: Mesh
  public readonly cameraTarget: TransformNode
  public readonly walkingSpeed = 0.01
  public readonly runningSpeed = this.walkingSpeed * 4

  private readonly observer: Nullable<Observer<Scene>>
  private readonly stateController: PlayerStateController
  private readonly animationController: AnimationController

  public constructor(private readonly scene: Scene) {
    this.mesh = CreateBox("PlayerRoot", { width: 0.6, depth: 0.6, height: 1.8 })
    this.mesh.visibility = 0
    this.mesh.addChild(getMeshByName(Player.meshName, scene))
    this.mesh.checkCollisions = true
    this.cameraTarget = new TransformNode("PlayerCameraTarget", scene)
    this.cameraTarget.parent = this.mesh
    this.animationController = new AnimationController(scene)
    this.stateController = new PlayerStateController(this, scene)
    this.stateController.change(this.stateController.idle)
    this.observer = scene.onBeforeRenderObservable.add(() => this.stateController.update())
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

  public followCamera(): void {
    this.mesh.rotation.y = this.cameraTarget.rotation.y
    this.cameraTarget.rotation.y = 0
  }

  public destroy(): void {
    this.scene.onBeforeRenderObservable.remove(this.observer)
    this.animationController.destroy()
    this.mesh.dispose()
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
    return getAnimationGroupByName(animationName, this.scene)
  }
}
