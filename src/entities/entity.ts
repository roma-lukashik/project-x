import { Mesh } from "@babylonjs/core/Meshes"

export interface Entity extends Disposable {
  mesh: Mesh
}

export interface Disposable {
  dispose(): void
}
