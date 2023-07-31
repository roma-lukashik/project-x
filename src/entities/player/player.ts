import { Scene } from "@babylonjs/core/scene"
import { getAnimationGroupByName, getMeshByName } from "../../utils/scene"
import { PlayerStateController } from "./controller"
import { Observer } from "@babylonjs/core/Misc"
import { Nullable } from "@babylonjs/core/types"
import { Entity } from "../entity"
import { CreateBox, Mesh, TransformNode } from "@babylonjs/core/Meshes"
import { PhysicsAggregate, PhysicsMotionType, PhysicsShapeType } from "@babylonjs/core/Physics/v2"
import { AnimationController } from "../../animation/controller"
import { PlayerAnimation } from "./animations"
import { AnimationGroup } from "@babylonjs/core/Animations"

export class Player implements Entity {
  private static readonly meshName = "__root__"

  public readonly mesh: Mesh
  public readonly cameraTarget: TransformNode
  public readonly physics: PhysicsAggregate
  public readonly walkingSpeed = 1
  public readonly runningSpeed = this.walkingSpeed * 4

  private readonly observer: Nullable<Observer<Scene>>
  private readonly stateController: PlayerStateController
  private readonly animationController: AnimationController

  public constructor(private readonly scene: Scene) {
    this.mesh = CreateBox("PlayerRoot", { width: 0.6, depth: 0.6, height: 1.8 })
    this.mesh.position.y = 0.9
    this.mesh.visibility = 0
    this.mesh.addChild(getMeshByName(Player.meshName, scene))
    this.mesh.checkCollisions = true
    this.physics = new PhysicsAggregate(
      this.mesh,
      PhysicsShapeType.BOX,
      { mass: 100, restitution: 0.01, friction: 1 },
      scene,
    )
    this.physics.body.setMotionType(PhysicsMotionType.DYNAMIC)
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

  public destroy(): void {
    this.scene.onBeforeRenderObservable.remove(this.observer)
    this.animationController.destroy()
    this.mesh.dispose()
    this.physics.dispose()
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
