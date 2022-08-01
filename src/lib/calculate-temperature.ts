import { calculateRadiance } from "./calculate-radiance";
import { findNeighbors, NeighboreIndex, NeighboreKeys } from "./find-neighbors";

export function calculateTemperature(
  coordinates: Coordinates,
  mesh: Mesh,
  time: number,
  material: {
    radiance: number;
    heatCapacity: number;
    heatConductivity: number;
    mass: number;
  },
  faces: { area: number; step: number }[],
  boundaryFluxes: {
    heatConductivity: number;
    step: number;
    temperature: number;
  }[] = [],
  round?: number
) {
  const { x, y } = coordinates;
  const { heatConductivity } = material;
  const temperature = mesh[x][y];
  const neighbores = findNeighbors(mesh, coordinates);
  let radianceArea = 0;
  let fluxCenter = 0;
  let fluxesSum = 0;
  neighbores.forEach((temp, direction) => {
    if (!temp && !boundaryFluxes[direction]) {
      radianceArea += faces[direction].area;
    } else if (temp) {
      const flux =
        (-heatConductivity * faces[direction].area) / faces[direction].step;
      fluxCenter += flux;
      fluxesSum += flux * temp;
    } else {
      const flux =
        (-boundaryFluxes[direction].heatConductivity * faces[direction].area) /
        (faces[direction].step / 2 + boundaryFluxes[direction].step / 2);
      fluxCenter += flux;
      fluxesSum += flux * boundaryFluxes[direction].temperature;
    }
  });

  const newTemperature =
    temperature + time * (fluxCenter * temperature - fluxesSum);
  if (round) {
    return Number(
      (radianceArea > 0
        ? calculateRadiance(time, material, newTemperature, radianceArea)
        : newTemperature
      ).toFixed(round)
    );
  }
  return radianceArea > 0
    ? calculateRadiance(time, material, newTemperature, radianceArea)
    : newTemperature;
}
