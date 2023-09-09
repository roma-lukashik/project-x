import type { Mesh } from "@babylonjs/core/Meshes/mesh"

export interface Entity extends Disposable {
  mesh: Mesh
}

export interface Disposable {
  dispose(): void
}
