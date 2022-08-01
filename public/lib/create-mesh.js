"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMesh = void 0;
function createMesh(sample, step, temperature = 273) {
    const xSize = Math.round(sample.x / step.x);
    const ySize = Math.round(sample.y / step.y);
    console.log({ xSize, ySize });
    const result = [];
    for (let x = 0; x < xSize; x++) {
        for (let y = 0; y < ySize; y++) {
            if (!result[x]) {
                result[x] = [];
            }
            result[x][y] = temperature;
        }
    }
    return result;
}
exports.createMesh = createMesh;
