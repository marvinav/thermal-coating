import { exit } from "process";

export function addLayer(mesh: Mesh, temperature: number, heatUnder?: number) {
  const layer = mesh.length;

  mesh[layer] = [];
  for (let y = 0; y < mesh[0].length; y++) {
    mesh[layer][y] = temperature;
    if (heatUnder) {
      mesh[layer - 1][y] = mesh[layer - 1][y] + heatUnder;
    }
  }
}
