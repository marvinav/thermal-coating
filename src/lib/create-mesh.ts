export function createMesh(
  sample: Dimension,
  step: { x: number; y: number },
  temperature: number = 273
) {
  const xSize = Math.round(sample.x / step.x);
  const ySize = Math.round(sample.y / step.y);
  console.log({ xSize, ySize });
  const result: Mesh = [];
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
