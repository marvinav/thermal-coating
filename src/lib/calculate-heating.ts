/**
 *
 * @param heater Radiance of source in Wh/(m^2), time in s, area in m^2
 * @param material
 * @returns
 */
export function calculateHeating(
  heater: { radiance: number; time: number; area: number },
  material: {
    temperature: number;
    heatCapacity: number;
    mass: number;
  }
) {
  const energy = heater.area * heater.time * heater.radiance;
  const currentEnergy =
    material.heatCapacity * material.mass * material.temperature;

  return (currentEnergy + energy) / material.heatCapacity / material.mass;
}
