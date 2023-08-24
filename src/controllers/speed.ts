import type { Scene } from "@babylonjs/core/scene"

export class SpeedController {
  private speed = 0
  private maxSpeed = 0

  public constructor(
    private readonly scene: Scene,
    private acceleration: number,
  ) {
  }

  public getSpeed(): number {
    return this.speed
  }

  public setSpeed(speed: number): void {
    this.maxSpeed = speed
  }

  public update(): void {
    if (this.speed === this.maxSpeed) {
      return
    }
    const dt = this.scene.getEngine().getDeltaTime() / 1000.0
    if (this.speed > this.maxSpeed) {
      this.speed = Math.max(this.maxSpeed, this.speed - this.acceleration * dt)
    } else {
      this.speed = Math.min(this.maxSpeed, this.speed + this.acceleration * dt)
    }
  }
}
