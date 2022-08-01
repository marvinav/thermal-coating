"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateHeating = void 0;
/**
 *
 * @param heater Radiance of source in Wh/(m^2), time in s, area in m^2
 * @param material
 * @returns
 */
function calculateHeating(heater, material) {
    const energy = heater.area * heater.time * heater.radiance;
    const currentEnergy = material.heatCapacity * material.mass * material.temperature;
    return (currentEnergy + energy) / material.heatCapacity / material.mass;
}
exports.calculateHeating = calculateHeating;
