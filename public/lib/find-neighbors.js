"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeighboreIndex = exports.findNeighbors = void 0;
function findNeighbors(meshArray, target) {
    const { x, y } = target;
    const south = y - 1 > -1 ? meshArray[x][y - 1] : undefined;
    const north = y + 1 < meshArray[x].length ? meshArray[x][y + 1] : undefined;
    const west = x - 1 > -1 ? meshArray[x - 1][y] : undefined;
    const east = x + 1 < meshArray.length ? meshArray[x + 1][y] : undefined;
    return [east, west, north, south];
}
exports.findNeighbors = findNeighbors;
exports.NeighboreIndex = {
    east: 0,
    west: 1,
    north: 2,
    south: 3,
};
