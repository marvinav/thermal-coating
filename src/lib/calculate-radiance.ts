export function calculateRadiance(
  time: number,
  material: {
    radiance: number; // Wh/(m2·K4)
    heatCapacity: number;
    mass: number;
  },
  temperature: number,
  area: number
) {
  const currentEnergy = material.heatCapacity * material.mass * temperature;
  const lostEnergy = material.radiance * Math.pow(temperature, 4) * area * time;
  let totalEnergy = currentEnergy - lostEnergy;
  totalEnergy = totalEnergy > 0 ? totalEnergy : 0;

  return totalEnergy / material.heatCapacity / material.mass;
}
