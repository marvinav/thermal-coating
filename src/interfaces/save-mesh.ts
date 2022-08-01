import fs from "fs/promises";

export async function saveMesh(params: { mesh: Mesh; path: string }) {
  let { mesh, path } = params;
  let joinedY: string[] = [];
  for (let x = 0; x < mesh.length; x++) {
    joinedY.push(mesh[x].join(";"));
  }

  let result = joinedY.join("\n");
  return await fs.writeFile(path, result).catch(console.log);
}
