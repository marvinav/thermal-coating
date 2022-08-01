"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTemperature = void 0;
const calculate_radiance_1 = require("./calculate-radiance");
const find_neighbors_1 = require("./find-neighbors");
function calculateTemperature(coordinates, mesh, time, material, faces, boundaryFluxes = [], round) {
    const { x, y } = coordinates;
    const { heatConductivity } = material;
    const temperature = mesh[x][y];
    const neighbores = (0, find_neighbors_1.findNeighbors)(mesh, coordinates);
    let radianceArea = 0;
    let fluxCenter = 0;
    let fluxesSum = 0;
    neighbores.forEach((temp, direction) => {
        if (!temp && !boundaryFluxes[direction]) {
            radianceArea += faces[direction].area;
        }
        else if (temp) {
            const flux = (-heatConductivity * faces[direction].area) / faces[direction].step;
            fluxCenter += flux;
            fluxesSum += flux * temp;
        }
        else {
            const flux = (-boundaryFluxes[direction].heatConductivity * faces[direction].area) /
                (faces[direction].step / 2 + boundaryFluxes[direction].step / 2);
            fluxCenter += flux;
            fluxesSum += flux * boundaryFluxes[direction].temperature;
        }
    });
    const newTemperature = temperature + time * (fluxCenter * temperature - fluxesSum);
    if (round) {
        return Number((radianceArea > 0
            ? (0, calculate_radiance_1.calculateRadiance)(time, material, newTemperature, radianceArea)
            : newTemperature).toFixed(round));
    }
    return radianceArea > 0
        ? (0, calculate_radiance_1.calculateRadiance)(time, material, newTemperature, radianceArea)
        : newTemperature;
}
exports.calculateTemperature = calculateTemperature;
