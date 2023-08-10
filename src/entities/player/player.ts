import { Scene } from "@babylonjs/core/scene"
import { getAnimationGroupByName, getMeshByName } from "../../utils/scene"
import { PlayerStateController } from "./controller"
import { Observer } from "@babylonjs/core/Misc"
import { Nullable } from "@babylonjs/core/types"
import { Entity } from "../entity"
import { CreateCapsule, Mesh, TransformNode } from "@babylonjs/core/Meshes"
import { AnimationController } from "../../animation/controller"
import { PlayerAnimation } from "./animations"
import { AnimationGroup } from "@babylonjs/core/Animations"
import { ThirdPersonCamera } from "../../cameras/thirdPerson"
import { Vector3 } from "@babylonjs/core/Maths"
import { WeightedAnimationGroup } from "../../animation/weightedAnimationGroup"
import { floorRayCast } from "../../utils/math"

export class Player implements Entity {
  private static readonly meshName = "__root__"

  public speed = 0

  public readonly mesh: Mesh
  public readonly cameraTarget: TransformNode
  public readonly walkingSpeed = 0.01
  public readonly runningSpeed = this.walkingSpeed * 4

  public previousRotation = Vector3.Zero()

  private readonly observer: Nullable<Observer<Scene>>
  private readonly stateController: PlayerStateController
  private readonly animationController: AnimationController
  private readonly camera: ThirdPersonCamera

  private readonly gravity = Vector3.Zero()
  private moveDirection = Vector3.Zero()
  private grounded = false

  public constructor(
    private readonly name: string,
    private readonly scene: Scene,
  ) {
    this.mesh = CreateCapsule(this.name, { radius: 0.3, height: 1.8 })
    this.mesh.visibility = 0.0
    this.mesh.addChild(getMeshByName(Player.meshName, scene))
    this.mesh.checkCollisions = true
    this.cameraTarget = new TransformNode(this.name + "CameraTarget", scene)
    this.cameraTarget.parent = this.mesh
    this.camera = new ThirdPersonCamera(this.scene, this.cameraTarget)
    this.animationController = new AnimationController(scene)
    this.stateController = new PlayerStateController(this, scene)
    this.stateController.change(this.stateController.idle)
    this.observer = scene.onBeforeRenderObservable.add(() => {
      this.stateController.update()
      this.camera.update()
      this.updateGroundDetection()
      this.applyGravity()
    })
  }

  public updateMoveDirection() {
    this.moveDirection = this.mesh.forward.normalizeToNew().scaleInPlace(this.speed)
  }

  public idle(): WeightedAnimationGroup {
    return this.runAnimationLoop(PlayerAnimation.Idle)
  }

  public walk(): WeightedAnimationGroup {
    return this.runAnimationLoop(PlayerAnimation.Walk)
  }

  public run(): WeightedAnimationGroup {
    return this.runAnimationLoop(PlayerAnimation.Run)
  }

  public jump(): AnimationGroup {
    return this.runAnimationOnce(PlayerAnimation.JumpInPlace)
  }

  public jumpInRun(): AnimationGroup {
    return this.runAnimationOnce(PlayerAnimation.JumpInRun)
  }

  public followCamera(): void {
    this.mesh.rotation.y = this.cameraTarget.rotation.y + this.previousRotation.y
    this.cameraTarget.rotation.y = 0
  }

  public returnCamera(): void {
    this.camera.reset()
  }

  public dispose(): void {
    this.scene.onBeforeRenderObservable.remove(this.observer)
    this.animationController.dispose()
    this.mesh.dispose()
  }

  private runAnimationLoop(animationName: PlayerAnimation) {
    const animation = this.getAnimationGroup(animationName)
    return this.animationController.run(animation)
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

  private updateGroundDetection() {
    this.grounded = floorRayCast(this.mesh, this.scene, 0.05)
  }

  private applyGravity() {
    const dt = this.scene.getEngine().getDeltaTime() / 1000.0
    if (this.grounded) {
      this.gravity.y = 0
    } else {
      this.gravity.addInPlace(Vector3.Up().scaleInPlace(dt * -9.8))
    }
    this.moveDirection.addInPlace(this.gravity)
    this.mesh.moveWithCollisions(this.moveDirection)
  }
}
