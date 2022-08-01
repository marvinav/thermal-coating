"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMesh = void 0;
const calculate_temperature_1 = require("./calculate-temperature");
const find_neighbors_1 = require("./find-neighbors");
function calculateMesh(params) {
    const { round, mesh, contactMesh, time, targetMaterial, contactHeatTransfer, faces, contactFaces, westEdgeFlux, } = params;
    let newMesh = [];
    for (let x = 0; x < mesh.length; x++) {
        for (let y = 0; y < mesh[x].length; y++) {
            if (!newMesh[x]) {
                newMesh[x] = [];
            }
            const boundaryFluxes = [];
            if (x === 0) {
                boundaryFluxes[find_neighbors_1.NeighboreIndex.west] = {
                    heatConductivity: contactHeatTransfer,
                    step: contactFaces[find_neighbors_1.NeighboreIndex.west].step,
                    temperature: contactMesh[x][y],
                };
            }
            if (x === mesh.length && westEdgeFlux) {
                boundaryFluxes[find_neighbors_1.NeighboreIndex.west] = westEdgeFlux;
            }
            const temperature = (0, calculate_temperature_1.calculateTemperature)({ x, y }, mesh, time, targetMaterial, faces, boundaryFluxes, round);
            newMesh[x][y] = temperature;
        }
    }
    return newMesh;
}
exports.calculateMesh = calculateMesh;
