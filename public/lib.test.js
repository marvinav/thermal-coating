"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calculate_heating_1 = require("./calculate-heating");
const calculate_mesh_1 = require("./calculate-mesh");
const calculate_radiance_1 = require("./calculate-radiance");
describe("Calculate Heating", () => {
    it("Water Heating from zero", () => {
        const heater = {
            radiance: 10,
            time: 1,
            area: 1,
        };
        const material = {
            temperature: 0,
            heatCapacity: 4180,
            mass: 1,
        };
        expect((0, calculate_heating_1.calculateHeating)(heater, material)).toBeCloseTo(0.0024, 4);
    });
    it("Water Heating from 10K", () => {
        const heater = {
            radiance: 3000,
            time: 2,
            area: 10,
        };
        const material = {
            temperature: 10,
            heatCapacity: 4180,
            mass: 1,
        };
        expect((0, calculate_heating_1.calculateHeating)(heater, material)).toBeCloseTo(24.3541, 4);
    });
});
describe("Calculate Radiance Steel", () => {
    it("Steel radiate from boiling 773 K", () => {
        const material = {
            radiance: 5.67 * 0.8 * Math.pow(10, -8),
            heatCapacity: 468,
            mass: 1,
        };
        expect((0, calculate_radiance_1.calculateRadiance)(1, material, 773, 1)).toBeCloseTo(738.3945, 4);
    });
});
describe("Calculate 3D Sample", () => {
    const round = 2;
    const material = {
        radiance: 0,
        heatCapacity: 1,
        heatConductivity: 1,
        mass: 1,
    };
    const faces = [
        { area: 100, step: 10 },
        { area: 100, step: 10 },
        { area: 100, step: 10 },
        { area: 100, step: 10 },
    ];
    const contactFaces = [
        { area: 100, step: 1 },
        { area: 100, step: 1 },
        { area: 10, step: 10 },
        { area: 10, step: 10 },
    ];
    const time = 0.01;
    it("3x3 grid", () => {
        let mesh = [
            [100, 100, 100],
            [100, 120, 100],
            [100, 100, 100],
        ];
        const contactMesh = [[20000, 20000, 20000]];
        mesh = (0, calculate_mesh_1.calculateMesh)({
            mesh,
            contactMesh,
            time,
            targetMaterial: material,
            contactHeatTransfer: 0,
            faces: faces,
            contactFaces,
            round,
        });
        expect(mesh).toEqual([
            [100, 102, 100],
            [102, 112, 102],
            [100, 102, 100],
        ]);
        mesh = (0, calculate_mesh_1.calculateMesh)({
            mesh,
            contactMesh,
            time: 0.01,
            targetMaterial: material,
            contactHeatTransfer: 0,
            faces: [
                { area: 100, step: 10 },
                { area: 100, step: 10 },
                { area: 100, step: 10 },
                { area: 100, step: 10 },
            ],
            contactFaces,
            round,
        });
        expect(mesh).toEqual([
            [100.4, 102.6, 100.4],
            [102.6, 108, 102.6],
            [100.4, 102.6, 100.4],
        ]);
        for (let i = 0; i < 100; i++) {
            mesh = (0, calculate_mesh_1.calculateMesh)({
                mesh,
                contactMesh,
                time: 0.01,
                targetMaterial: material,
                contactHeatTransfer: 0,
                faces: [
                    { area: 100, step: 10 },
                    { area: 100, step: 10 },
                    { area: 100, step: 10 },
                    { area: 100, step: 10 },
                ],
                contactFaces,
                round,
            });
        }
        let sum = 0;
        for (let i = 0; i < 3; i++) {
            sum += mesh[i][0] + mesh[i][1] + mesh[i][2];
        }
        expect(sum).toBeCloseTo(920);
    });
    it("5x2 grid High Temperature", () => {
        const material = {
            radiance: 0,
            heatCapacity: 1,
            heatConductivity: 29,
            mass: 1,
        };
        const contactMesh = [[20000, 20000, 20000, 20000, 20000]];
        let mesh = [
            [38730, 38730, 38730, 38730, 38730],
            [100, 100, 100, 100, 100],
        ];
        mesh = (0, calculate_mesh_1.calculateMesh)({
            mesh,
            contactMesh,
            time: 0.00001,
            targetMaterial: material,
            contactHeatTransfer: 0,
            faces: faces,
            contactFaces,
            round,
        });
        expect(mesh).toEqual([
            [38617.97, 38617.97, 38617.97, 38617.97, 38617.97],
            [212.03, 212.03, 212.03, 212.03, 212.03],
        ]);
        let sum = 0;
        for (let i = 0; i < 2; i++) {
            sum += mesh[i][0] + mesh[i][1] + mesh[i][2] + mesh[i][3] + mesh[i][4];
        }
        expect(sum).toBeCloseTo(38730 * 5 + 100 * 5);
    });
    it("3x3 grid with contact mash in one direction", () => {
        const contactMesh = [[20000, 20000, 20000]];
        let mesh = [
            [100, 100, 100],
            [100, 120, 100],
            [100, 100, 100],
        ];
        for (let i = 0; i < 1000; i++) {
            mesh = (0, calculate_mesh_1.calculateMesh)({
                mesh,
                contactMesh,
                time: 0.01,
                targetMaterial: material,
                contactHeatTransfer: 2,
                faces,
                contactFaces,
                round,
            });
        }
        let sum = 0;
        for (let i = 0; i < 3; i++) {
            sum += mesh[i][0] + mesh[i][1] + mesh[i][2];
        }
        expect(Math.round(sum)).toBe(20000 * 9 - 1);
    });
    it("3x3 grid with real materials", () => {
        const time = 0.01;
        const coatingStep = 1;
        const step = 1;
        const subStep = 1;
        const coef = 1e6;
        const substrateMaterial = {
            radiance: 5.67e-24 * 0.4,
            heatConductivity: 4.54e-8,
            mass: step * subStep * coef * 7850 * 1e-24,
            heatCapacity: 468,
        };
        // For titanium nitride
        const coatingMaterial = {
            radiance: 0.15 * 5.67e-24 * 0,
            heatConductivity: 29e-8,
            mass: step * coef * coatingStep * 5210 * 1e-24,
            heatCapacity: 601,
        };
        const substractFaces = [
            { area: step * coef, step: subStep },
            { area: step * coef, step: subStep },
            { area: subStep * step, step: step },
            { area: subStep * step, step: step },
        ];
        const coatingFaces = [
            { area: step * coef, step: coatingStep },
            { area: step * coef, step: coatingStep },
            { area: step * step, step: step },
            { area: step * step, step: step },
        ];
        let coatingMesh = [
            [18000, 18000, 18000],
            [19000, 19000, 19000],
            [19000, 19000, 19000],
            [19000, 19000, 19000],
            [19000, 19000, 19000],
            [19000, 19000, 19000],
            [19000, 19000, 19000],
            [19000, 19000, 19000],
            [19000, 19000, 19000],
            [19000, 19000, 19000],
        ];
        let substrateMesh = [
            [273, 273, 273],
            [273, 273, 273],
            [273, 273, 273],
            [273, 273, 273],
            [273, 273, 273],
            [273, 273, 273],
            [273, 273, 273],
            [273, 273, 273],
            [273, 273, 273],
            [273, 273, 273],
            [273, 273, 273],
            [273, 273, 273],
            [273, 273, 273],
            [273, 273, 273],
            [273, 273, 273],
            [273, 273, 273],
            [273, 273, 273],
            [273, 273, 273],
            [273, 273, 273],
            [273, 273, 273],
            [273, 273, 273],
            [273, 273, 273],
        ];
        let newSubstrateMesh = (0, calculate_mesh_1.calculateMesh)({
            mesh: substrateMesh,
            contactMesh: coatingMesh,
            time,
            targetMaterial: substrateMaterial,
            contactHeatTransfer: 8e-8,
            faces: substractFaces,
            contactFaces: coatingFaces,
        });
        let newCoatingMesh = (0, calculate_mesh_1.calculateMesh)({
            mesh: coatingMesh,
            contactMesh: substrateMesh,
            time,
            targetMaterial: coatingMaterial,
            contactHeatTransfer: 8e-8,
            faces: coatingFaces,
            contactFaces: substractFaces,
        });
        coatingMesh = newCoatingMesh;
        substrateMesh = newSubstrateMesh;
        for (let i = 0; i < 54000 / time; i++) {
            newSubstrateMesh = (0, calculate_mesh_1.calculateMesh)({
                mesh: substrateMesh,
                contactMesh: coatingMesh,
                time,
                targetMaterial: substrateMaterial,
                contactHeatTransfer: 8e-8,
                faces: substractFaces,
                contactFaces: coatingFaces,
            });
            newCoatingMesh = (0, calculate_mesh_1.calculateMesh)({
                mesh: coatingMesh,
                contactMesh: substrateMesh,
                time,
                targetMaterial: coatingMaterial,
                contactHeatTransfer: 8e-8,
                faces: coatingFaces,
                contactFaces: substractFaces,
            });
            coatingMesh = newCoatingMesh;
            substrateMesh = newSubstrateMesh;
        }
        console.table(newCoatingMesh);
        console.table(newSubstrateMesh);
    });
});
