export function findNeighbors(meshArray: Mesh, target: Coordinates) {
  const { x, y } = target;
  const south = y - 1 > -1 ? meshArray[x][y - 1] : undefined;
  const north = y + 1 < meshArray[x].length ? meshArray[x][y + 1] : undefined;

  const west = x - 1 > -1 ? meshArray[x - 1][y] : undefined;
  const east = x + 1 < meshArray.length ? meshArray[x + 1][y] : undefined;

  return [east, west, north, south];
}

export const NeighboreIndex = {
  east: 0,
  west: 1,
  north: 2,
  south: 3,
};

export type NeighboreKeys = 0 | 1 | 2 | 3;
