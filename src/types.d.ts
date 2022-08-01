declare global {
  interface Coordinates {
    x: number;
    y: number;
  }

  interface Dimension {
    x: number;
    y: number;
  }

  type MeshItem = number;

  type Mesh = MeshItem[][];

  interface Material {
    radiance: number;
    heatConductivity: number;
    mass: number;
    heatCapacity: number;
  }
}

export {};
