import type { Scene } from "@babylonjs/core/scene"
import { TransformNode } from "@babylonjs/core/Meshes"
import { UniversalCamera } from "@babylonjs/core/Cameras"
import { Scalar, Vector3 } from "@babylonjs/core/Maths"
import { Tools } from "@babylonjs/core/Misc"
import type { Nullable } from "@babylonjs/core/types"
import { Disposable } from "../entities/entity"

export class ThirdPersonCamera implements Disposable {
  private readonly camera: UniversalCamera
  private readonly canvas: Nullable<HTMLCanvasElement>
  private readonly target: TransformNode
  private readonly minY = -25
  private readonly maxY = 35
  private readonly cameraSpeed = 0.1
  private mouseX: number = 0
  private mouseY: number = 0

  public constructor(
    scene: Scene,
    target: TransformNode,
    position = new Vector3(0, -0.2, -2.6),
  ) {
    this.camera = new UniversalCamera("ThirdPersonCamera", position, scene)
    this.camera.fov = 1.25
    this.camera.minZ = 0
    this.camera.applyGravity = true
    this.camera.checkCollisions = true
    this.camera.inputs.clear()
    this.canvas = scene.getEngine().getRenderingCanvas()
    this.camera.parent = target
    this.target = target
    this.setupPointerLock()
  }

  public update() {
    this.target.rotation.x = Tools.ToRadians(this.mouseY)
    this.target.rotation.y = Tools.ToRadians(this.mouseX)
  }

  public reset() {
    this.mouseX = 0
  }

  public dispose(): void {
    document.removeEventListener("pointerlockchange", this.onPointerLockChange, false)
    this.canvas?.removeEventListener("click", this.canvas.requestPointerLock)
  }

  private setupPointerLock() {
    document.addEventListener("pointerlockchange", this.onPointerLockChange, false)
    this.canvas?.addEventListener("click", this.canvas.requestPointerLock)
  }

  private onPointerLockChange = () => {
    if (document.pointerLockElement === this.canvas) {
      document.addEventListener("mousemove", this.mouseMove, false)
    } else {
      document.removeEventListener("mousemove", this.mouseMove, false)
    }
  }

  private mouseMove = ({ movementX, movementY }: MouseEvent) => {
    this.mouseX += movementX * this.cameraSpeed
    this.mouseY = Scalar.Clamp(this.mouseY + movementY * this.cameraSpeed, this.minY, this.maxY)
  }
}
