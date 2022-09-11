import fs from "fs/promises";

export async function saveMesh(params: { mesh: Mesh; path: string, scale?: number }) {
  let { mesh, path, scale } = params;
  let joinedY: string[] = [];

  for (let x = 0; x < mesh.length; x++) {
    if (scale) {
      joinedY.push(`${scale * x};${mesh[x].join(";")}`);
    } else {
      joinedY.push(mesh[x].join(";"));

    }
  }

  let result = joinedY.join("\n");
  return await fs.writeFile(path, result).catch(console.log);
}

export async function saveMeshs(params: { coating: Mesh; substrate: Mesh, path: string, coatingScale?: number, substrateScale?: number }) {
  let { coating, substrate, path, coatingScale, substrateScale } = params;
  let joinedY: string[] = [];
  for (let x = 0; x < substrate.length; x++) {
    if (substrateScale) {
      joinedY.push(`${substrateScale * x};${substrate[x].join(";")}`);
    } else {
      joinedY.push(substrate[x].join(";"));

    }
  }

  for (let x = 0; x < coating.length; x++) {
    if (coatingScale) {
      joinedY.push(`${coatingScale * (x + 1)};${coating[x].join(";")}`);
    } else {
      joinedY.push(coating[x].join(";"));

    }
  }


  let result = joinedY.join("\n");
  return await fs.writeFile(path, result).catch(console.log);
}