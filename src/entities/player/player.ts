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
import { Scalar, Vector3 } from "@babylonjs/core/Maths"
import { WeightedAnimationGroup } from "../../animation/weightedAnimationGroup"
import { floorRayCast } from "../../utils/math"

export class Player implements Entity {
  private static readonly meshName = "__root__"
  private static readonly gravity = -9.8

  public speed = 0

  public readonly mesh: Mesh
  public readonly cameraTarget: TransformNode
  public readonly walkingSpeed = 0.01
  public readonly runningSpeed = this.walkingSpeed * 4

  public readonly previousRotation = Vector3.Zero()
  public readonly gravity = Vector3.Zero()
  public readonly moveDirection = Vector3.Zero()

  private readonly observer: Nullable<Observer<Scene>>
  private readonly stateController: PlayerStateController
  private readonly animationController: AnimationController
  private readonly camera: ThirdPersonCamera
  private grounded = false

  public constructor(
    private readonly name: string,
    private readonly scene: Scene,
  ) {
    this.mesh = CreateCapsule(this.name, { radius: 0.3, height: 1.8 })
    this.mesh.visibility = 0.0
    this.mesh.position.y = 0.9
    this.mesh.ellipsoid = new Vector3(0.3, 0.9, 0.3)
    this.mesh.addChild(getMeshByName(Player.meshName, scene))
    this.cameraTarget = new TransformNode(this.name + "CameraTarget", scene)
    this.cameraTarget.position.y = 0.9
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
    this.moveDirection.copyFrom(this.mesh.forward).normalize().scaleInPlace(this.speed)
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
    this.cameraTarget.position = Vector3.Lerp(this.cameraTarget.position, this.mesh.position, 0.4)
    this.mesh.rotation.y = Scalar.Lerp(this.mesh.rotation.y, this.cameraTarget.rotation.y, 0.15)
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
      this.gravity.y += dt * Player.gravity
    }
    this.moveDirection.addInPlace(this.gravity)
    this.mesh.moveWithCollisions(this.moveDirection)
  }
}
