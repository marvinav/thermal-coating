import path from "path";
import { addLayer } from "./add-layer";
import { calculateMesh } from "./calculate-mesh";
import { createMesh } from "./create-mesh";
import { saveMesh } from "../interfaces/save-mesh";

function contactHeatConductivity(
  firstHeatConductivity: number,
  secondHeatConductivity: number
) {
  //https://mash-xxl.info/page/061113185172243045057154113150133029152196088180/
  return (
    (2 * firstHeatConductivity * secondHeatConductivity) /
    (firstHeatConductivity + secondHeatConductivity)
  );
}

export async function main() {
  const coatingStartTemperature = 1e4 * 100;

  const time = 0.001;
  const totalTime = 5400;
  const depositTime = 10;
  const step = 1;
  const stepInZ = 1e6;

  const substrateMaterial = {
    radiance: 5.67e-24 * 0.4,
    heatConductivity: 4.54e-6,
    mass: step * step * stepInZ * 10 * 7850 * 1e-24 * 1000,
    heatCapacity: 468,
  };

  // For titanium nitride
  const coatingMaterial = {
    radiance: 0.15 * 5.67e-24,
    heatConductivity: 29e-6,
    mass: step * stepInZ * step * 5210 * 1e-24 * 1000,
    heatCapacity: 601,
  };
  const substractFaces = [
    { area: step * stepInZ, step: step },
    { area: step * stepInZ, step: step },
    { area: 0, step: step },
    { area: 0, step: step },
  ];

  const coatingFaces = [
    { area: step * stepInZ, step: step },
    { area: step * stepInZ, step: step },
    { area: 0, step: step },
    { area: 0, step: step },
  ];

  // const contactHeatTransfer = contactHeatConductivity(
  //   substrateMaterial.heatConductivity,
  //   coatingMaterial.heatConductivity
  // );
  const logs: Promise<unknown>[] = [];

  let coatingMesh = createMesh(
    { x: step, y: step * 1 },
    { x: step, y: step },
    coatingStartTemperature
  );
  console.log("Coating mesh created");
  let substrateMesh = createMesh(
    { x: step * 1e2, y: step * 1 },
    { x: step, y: step },
    293
  );
  console.log(path.join(__dirname, "../result"));
  console.log("Substrate mesh created");
  let i = 0;
  let logIterate = 0;
  const contactHeatTransfer = 8e-5;
  let elapsed = 0;

  for (i; i < totalTime / time; i++) {
    elapsed = elapsed + time;
    logIterate++;
    let newSubstrateMesh = calculateMesh({
      mesh: substrateMesh,
      contactMesh: coatingMesh,
      time,
      targetMaterial: substrateMaterial,
      contactHeatTransfer,
      faces: substractFaces,
      contactFaces: coatingFaces,
    });

    let newCoatingMesh = calculateMesh({
      mesh: coatingMesh,
      contactMesh: substrateMesh,
      time,
      targetMaterial: coatingMaterial,
      contactHeatTransfer,
      faces: coatingFaces,
      contactFaces: substractFaces,
    });

    coatingMesh = newCoatingMesh;
    substrateMesh = newSubstrateMesh;
    if (logIterate == (depositTime / time) * 10) {
      console.log(i);
      logIterate = 0;
      await saveMesh({
        mesh: coatingMesh,
        path: path.join(
          __dirname,
          `../result/coating.${Math.round(i / time)}.csv`
        ),
      });
      await saveMesh({
        mesh: substrateMesh,
        path: path.join(
          __dirname,
          `../result/substrate.${Math.round(i / time)}.csv`
        ),
      });
    }
    if (elapsed >= depositTime) {
      // Deposit layer after coatingDeltaTime elapsed
      elapsed = 0;
      addLayer(
        coatingMesh,
        coatingStartTemperature,
        coatingStartTemperature * 0.5
      );

      console.log("deposit");
      console.timeLog("calc");
      console.log(`Elapsed ${1 - i / (totalTime / time)}`);
    }
  }
  await saveMesh({
    mesh: coatingMesh,
    path: path.join(__dirname, `../result/coating.end.${i}.csv`),
  });
  await saveMesh({
    mesh: substrateMesh,
    path: path.join(__dirname, `../result/substrate.end.${i}.csv`),
  });
  console.log({ coatingStartTemperature, contactHeatTransfer });
  console.timeEnd("calc");
}
