export class SpeedController {
  private speed = 0
  private maxSpeed = 0

  public constructor(private acceleration: number) {
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
    if (this.speed > this.maxSpeed) {
      this.speed = Math.max(this.maxSpeed, this.speed - this.acceleration)
    } else {
      this.speed = Math.min(this.maxSpeed, this.speed + this.acceleration)
    }
  }
}
