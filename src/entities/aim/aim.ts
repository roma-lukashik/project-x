import type { Scene } from "@babylonjs/core/scene"
import type { ICanvasRenderingContext } from "@babylonjs/core/Engines/ICanvas"
import { DynamicTexture } from "@babylonjs/core/Materials/Textures/dynamicTexture"
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial"
import { CreatePlane } from "@babylonjs/core/Meshes/Builders/planeBuilder"
import { UtilityLayerRenderer } from "@babylonjs/core/Rendering/utilityLayerRenderer"
import type { Mesh } from "@babylonjs/core/Meshes/mesh"
import type { Entity } from "../entity"

export class Aim implements Entity {
  public readonly mesh: Mesh

  private readonly texture: DynamicTexture
  private readonly context: ICanvasRenderingContext
  private readonly material: StandardMaterial
  private readonly renderLayer: UtilityLayerRenderer

  public constructor(
    private readonly scene: Scene,
    private readonly size: number = 10,
  ) {
    this.texture = new DynamicTexture("AimTexture", size, this.scene, false)
    this.texture.hasAlpha = true

    this.context = this.texture.getContext()
    this.context.arc(this.size / 2, this.size / 2, this.size / 2, 0, Math.PI * 2)
    this.context.fillStyle = "rgba(128, 128, 128, 0.8)"
    this.context.fill()
    this.texture.update()

    this.material = new StandardMaterial("AimMaterial", this.scene)
    this.material.diffuseTexture = this.texture
    this.material.emissiveTexture = this.texture
    this.material.disableLighting = true

    this.renderLayer = new UtilityLayerRenderer(this.scene)
    this.mesh = CreatePlane("Aim", { size: this.size * 0.001 }, this.renderLayer.utilityLayerScene)
    this.mesh.material = this.material
    this.mesh.isPickable = false
    this.mesh.visibility = 1.0
    this.mesh.position.set(0, 0, 1.0)
    this.mesh.parent = this.scene.activeCamera
  }

  public dispose(): void {
    this.mesh.dispose()
    this.material.dispose()
    this.texture.dispose()
    this.renderLayer.dispose()
  }
}
