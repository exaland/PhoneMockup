import { Loader, Object3D } from 'three';

declare module 'three/examples/jsm/loaders/OBJLoader' {
  export class OBJLoader extends Loader {
    constructor(manager?: THREE.LoadingManager);
    load(
      url: string,
      onLoad?: (object: Object3D) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    parse(data: string): Object3D;
    setMaterials(materials: THREE.Material[]): this;
    setPath(path: string): this;
  }
} 