"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const path_1 = __importDefault(require("path"));
const add_layer_1 = require("./add-layer");
const calculate_mesh_1 = require("./calculate-mesh");
const create_mesh_1 = require("./create-mesh");
const save_mesh_1 = require("../interfaces/save-mesh");
function contactHeatConductivity(firstHeatConductivity, secondHeatConductivity) {
    //https://mash-xxl.info/page/061113185172243045057154113150133029152196088180/
    return ((2 * firstHeatConductivity * secondHeatConductivity) /
        (firstHeatConductivity + secondHeatConductivity));
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
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
        const logs = [];
        let coatingMesh = (0, create_mesh_1.createMesh)({ x: step, y: step * 1 }, { x: step, y: step }, coatingStartTemperature);
        console.log("Coating mesh created");
        let substrateMesh = (0, create_mesh_1.createMesh)({ x: step * 1e2, y: step * 1 }, { x: step, y: step }, 293);
        console.log(path_1.default.join(__dirname, "../result"));
        console.log("Substrate mesh created");
        let i = 0;
        let logIterate = 0;
        const contactHeatTransfer = 8e-5;
        let elapsed = 0;
        for (i; i < totalTime / time; i++) {
            elapsed = elapsed + time;
            logIterate++;
            let newSubstrateMesh = (0, calculate_mesh_1.calculateMesh)({
                mesh: substrateMesh,
                contactMesh: coatingMesh,
                time,
                targetMaterial: substrateMaterial,
                contactHeatTransfer,
                faces: substractFaces,
                contactFaces: coatingFaces,
            });
            let newCoatingMesh = (0, calculate_mesh_1.calculateMesh)({
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
                yield (0, save_mesh_1.saveMesh)({
                    mesh: coatingMesh,
                    path: path_1.default.join(__dirname, `../result/coating.${Math.round(i / time)}.csv`),
                });
                yield (0, save_mesh_1.saveMesh)({
                    mesh: substrateMesh,
                    path: path_1.default.join(__dirname, `../result/substrate.${Math.round(i / time)}.csv`),
                });
            }
            if (elapsed >= depositTime) {
                // Deposit layer after coatingDeltaTime elapsed
                elapsed = 0;
                (0, add_layer_1.addLayer)(coatingMesh, coatingStartTemperature, coatingStartTemperature * 0.5);
                console.log("deposit");
                console.timeLog("calc");
                console.log(`Elapsed ${1 - i / (totalTime / time)}`);
            }
        }
        yield (0, save_mesh_1.saveMesh)({
            mesh: coatingMesh,
            path: path_1.default.join(__dirname, `../result/coating.end.${i}.csv`),
        });
        yield (0, save_mesh_1.saveMesh)({
            mesh: substrateMesh,
            path: path_1.default.join(__dirname, `../result/substrate.end.${i}.csv`),
        });
        console.log({ coatingStartTemperature, contactHeatTransfer });
        console.timeEnd("calc");
    });
}
exports.main = main;
