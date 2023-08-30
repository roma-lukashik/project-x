import type { Scene } from "@babylonjs/core/scene"
import { getAnimationGroupByName, getMeshByName } from "../../utils/scene"
import { PlayerStateController } from "./controller"
import type { Observer } from "@babylonjs/core/Misc"
import type { DeepImmutable, Nullable } from "@babylonjs/core/types"
import type { Entity } from "../entity"
import { CreateCapsule, type Mesh, TransformNode } from "@babylonjs/core/Meshes"
import { AnimationController } from "../../animation/controller"
import { PlayerAnimation } from "./animations"
import type { AnimationGroup } from "@babylonjs/core/Animations"
import { ThirdPersonCamera } from "../../cameras/thirdPerson"
import { Scalar, Vector3 } from "@babylonjs/core/Maths"
import type { WeightedAnimationGroup } from "../../animation/weightedAnimationGroup"
import { floorRayCast } from "../../utils/math"
import { SpeedController } from "../../controllers/speed"
import { PlayerIKController } from "./playerIKController"
import type { IKController } from "../../controllers/ikController"

export class Player implements Entity {
  public static readonly walkingSpeed = 1.11
  public static readonly runningSpeed = Player.walkingSpeed * 4
  public static readonly jumpingSpeed = 4
  public static readonly idleCameraPosition: DeepImmutable<Vector3> = new Vector3(0, 0.7, -2.2)
  public static readonly walkCameraPosition: DeepImmutable<Vector3> = new Vector3(0, 0.7, -2.4)
  public static readonly runCameraPosition: DeepImmutable<Vector3> = new Vector3(0, 0.7, -2.7)
  public static readonly aimingCameraPosition: DeepImmutable<Vector3> = new Vector3(0.6, 0.7, -1.5)

  private static readonly meshName = "__root__"
  private static readonly rightHandMeshName = "mixamorig:RightHand"
  private static readonly leftHandMeshName = "mixamorig:LeftHand"
  private static readonly acceleration = 10
  private static readonly gravity = -9.8

  public readonly mesh: Mesh
  public readonly camera: ThirdPersonCamera
  public readonly rightHand: IKController
  public readonly leftHand: IKController
  public readonly transformNode: TransformNode

  private readonly observer: Nullable<Observer<Scene>>
  private readonly stateController: PlayerStateController
  private readonly animationController: AnimationController
  private readonly speedController: SpeedController
  private readonly cameraTarget: TransformNode
  private readonly moveVector = Vector3.Zero()

  private jumpSpeed = 0
  private fallSpeed = 0
  private grounded = false
  private followCamera = false

  public constructor(
    private readonly name: string,
    private readonly scene: Scene,
  ) {
    this.mesh = this.createMeshCollider()
    this.cameraTarget = new TransformNode(this.name + "CameraTarget", scene)
    this.cameraTarget.position.y = this.mesh.position.y
    this.camera = new ThirdPersonCamera(scene, this.cameraTarget)
    this.rightHand = new PlayerIKController(scene, this.mesh, Player.rightHandMeshName)
    this.leftHand = new PlayerIKController(scene, this.mesh, Player.leftHandMeshName)
    this.animationController = new AnimationController(scene)
    this.speedController = new SpeedController(scene, Player.acceleration)
    this.stateController = new PlayerStateController(this, scene)
    this.transformNode = scene.getTransformNodeByName("Alpha_Joints")!
    this.stateController.change(this.stateController.idle)
    this.observer = scene.onBeforeRenderObservable.add(() => this.beforeRenderStep())
  }

  public idle(): WeightedAnimationGroup {
    return this.runAnimationLoop(PlayerAnimation.Idle)
  }

  public aiming(): WeightedAnimationGroup {
    return this.runAnimationLoop(PlayerAnimation.PistolIdle)
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

  public setSpeed(speed: number): void {
    this.speedController.setSpeed(speed)
  }

  public setJumpSpeed(speed: number): void {
    this.jumpSpeed = speed
  }

  public setFollowCamera(followCamera: boolean): void {
    this.followCamera = followCamera
  }

  public dispose(): void {
    this.scene.onBeforeRenderObservable.remove(this.observer)
    this.animationController.dispose()
    this.mesh.dispose()
  }

  private createMeshCollider(): Mesh {
    const player = getMeshByName(Player.meshName, this.scene)
    const { min, max } = player.getHierarchyBoundingVectors()
    const height = max.y - min.y
    const radius = 0.35
    const mesh = CreateCapsule(this.name, { radius, height })
    mesh.visibility = 0.0
    mesh.position.y = height / 2
    mesh.ellipsoid = new Vector3(radius, height / 2, radius)
    mesh.addChild(player)
    mesh.getChildMeshes().forEach((child) => child.isPickable = false)
    return mesh
  }

  private beforeRenderStep() {
    this.stateController.update()
    this.camera.update()
    this.speedController.update()
    this.updateMoveDirection()
    this.updateGroundDetection()
    this.applyGravity()
    this.applyFollowingCamera()
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

  private updateMoveDirection() {
    const dt = this.scene.getEngine().getDeltaTime() / 1000.0
    if (this.speedController.getSpeed() > 0) {
      this.moveVector.copyFrom(this.mesh.forward)
        .scaleInPlace(this.speedController.getSpeed() * dt + 0.5 * Player.acceleration * dt * dt)
    } else {
      this.moveVector.setAll(0)
    }
  }

  private updateGroundDetection() {
    this.grounded = floorRayCast(this.mesh, this.scene, 0.05)
  }

  private applyGravity() {
    const dt = this.scene.getEngine().getDeltaTime() / 1000.0
    if (this.jumpSpeed > 0) {
      this.jumpSpeed += Player.gravity * dt
      this.moveVector.addInPlaceFromFloats(0, this.jumpSpeed * dt + 0.5 * Player.gravity * dt * dt, 0)
    } else if (!this.grounded) {
      this.fallSpeed += Player.gravity * dt
      this.moveVector.addInPlaceFromFloats(0, this.fallSpeed * dt + 0.5 * Player.gravity * dt * dt, 0)
    } else {
      this.fallSpeed = 0
      this.jumpSpeed = 0
    }
    this.mesh.moveWithCollisions(this.moveVector)
  }

  private applyFollowingCamera(): void {
    Vector3.LerpToRef(this.cameraTarget.position, this.mesh.position, 0.4, this.cameraTarget.position)
    if (this.followCamera) {
      this.mesh.rotation.y = Scalar.Lerp(this.mesh.rotation.y, this.cameraTarget.rotation.y, 0.12)
    }
  }
}
