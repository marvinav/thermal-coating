import { exit } from "process";
import { calculateTemperature } from "./calculate-temperature";
import { NeighboreIndex } from "./find-neighbors";

export function calculateMesh(params: {
  mesh: Mesh;
  contactMesh: Mesh;
  time: number;
  targetMaterial: Material;
  contactHeatTransfer: number;
  faces: { area: number; step: number }[];
  contactFaces: { area: number; step: number }[];
  round?: number;
  westEdgeFlux?: {
    heatConductivity: number;
    step: number;
    temperature: number;
  };
}) {
  const {
    round,
    mesh,
    contactMesh,
    time,
    targetMaterial,
    contactHeatTransfer,
    faces,
    contactFaces,
    westEdgeFlux,
  } = params;
  let newMesh: Mesh = [];
  for (let x = 0; x < mesh.length; x++) {
    for (let y = 0; y < mesh[x].length; y++) {
      if (!newMesh[x]) {
        newMesh[x] = [];
      }
      const boundaryFluxes = [];
      if (x === 0) {
        boundaryFluxes[NeighboreIndex.west] = {
          heatConductivity: contactHeatTransfer,
          step: contactFaces[NeighboreIndex.west].step,
          temperature: contactMesh[x][y],
        };
      }
      if (x === mesh.length && westEdgeFlux) {
        boundaryFluxes[NeighboreIndex.west] = westEdgeFlux;
      }

      const temperature = calculateTemperature(
        { x, y },
        mesh,
        time,
        targetMaterial,
        faces,
        boundaryFluxes,
        round
      );
      newMesh[x][y] = temperature;
    }
  }
  return newMesh;
}
