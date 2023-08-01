import type { Scene } from "@babylonjs/core/scene"
import type { TransformNode } from "@babylonjs/core/Meshes"
import { UniversalCamera } from "@babylonjs/core/Cameras"
import { Scalar, Vector3 } from "@babylonjs/core/Maths"
import { Tools } from "@babylonjs/core/Misc"

export class ThirdPersonCamera {
  private readonly camera: UniversalCamera
  private mouseX: number = 0
  private mouseY: number = 0

  public constructor(
    scene: Scene,
    private readonly target: TransformNode,
    private readonly canvas: HTMLCanvasElement,
    initialPosition: Vector3 = new Vector3(0, 0.5, -2.75),
  ) {
    this.camera = new UniversalCamera("ThirdPersonCamera", initialPosition, scene)
    this.camera.fov = 1.25
    this.camera.minZ = 0
    this.camera.applyGravity = true
    this.camera.checkCollisions = true
    this.camera.inputs.clear()
    this.camera.parent = target
    this.setupPointerLock()
  }

  public update(): void {
    this.target.rotation.x = Tools.ToRadians(this.mouseY)
    this.target.rotation.y = Tools.ToRadians(this.mouseX)
    this.target.rotation.z = 0
  }

  public destroy(): void {
    document.removeEventListener("pointerlockchange", this.onPointerLockChange, false)
    this.canvas.removeEventListener("click", this.canvas.requestPointerLock)
  }

  private setupPointerLock() {
    document.addEventListener("pointerlockchange", this.onPointerLockChange, false)
    this.canvas.addEventListener("click", this.canvas.requestPointerLock)
  }

  private onPointerLockChange = () => {
    if (document.pointerLockElement === this.canvas) {
      document.addEventListener("mousemove", this.mouseMove, false)
    } else {
      document.removeEventListener("mousemove", this.mouseMove, false)
    }
  }

  private mouseMove = ({ movementX, movementY }: MouseEvent) => {
    this.mouseX += movementX * 0.1
    this.mouseY = Scalar.Clamp(this.mouseY + movementY * 0.1, -25, 45)
  }
}
