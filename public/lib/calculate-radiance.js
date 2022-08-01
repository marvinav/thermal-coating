"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRadiance = void 0;
function calculateRadiance(time, material, temperature, area) {
    const currentEnergy = material.heatCapacity * material.mass * temperature;
    const lostEnergy = material.radiance * Math.pow(temperature, 4) * area * time;
    let totalEnergy = currentEnergy - lostEnergy;
    totalEnergy = totalEnergy > 0 ? totalEnergy : 0;
    return totalEnergy / material.heatCapacity / material.mass;
}
exports.calculateRadiance = calculateRadiance;
