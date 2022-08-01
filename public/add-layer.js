"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addLayer = void 0;
function addLayer(mesh, temperature, heatUnder) {
    const layer = mesh.length;
    mesh[layer] = [];
    for (let y = 0; y < mesh[0].length; y++) {
        mesh[layer][y] = temperature;
        if (heatUnder) {
            mesh[layer - 1][y] = mesh[layer - 1][y] + heatUnder;
        }
    }
}
exports.addLayer = addLayer;
