import { Animatable, Mesh, PhysicsBody, PhysicsMotionType } from "@babylonjs/core";
import { Scene } from "@babylonjs/core/scene";
import { getMeshByName } from "../../utils/scene";

export class Player {
  public readonly mesh: Mesh
  public readonly body: PhysicsBody

  public constructor(private readonly scene: Scene) {
    this.mesh = getMeshByName("mixamorig:Skin", scene)
    this.body = new PhysicsBody(this.mesh, PhysicsMotionType.ANIMATED, false, this.scene)
    this.body.setMassProperties({mass: 70})
  }

  public idle(): Animatable {
    return this.scene.beginWeightedAnimation(this.mesh, 0, 90, 0.0, true)
  }

  public walk(): Animatable {
    return this.scene.beginWeightedAnimation(this.mesh, 91, 126, 0.0, true)
  }

  public run(): Animatable {
    return this.scene.beginWeightedAnimation(this.mesh, 127, 148, 0.0, true)
  }
}
