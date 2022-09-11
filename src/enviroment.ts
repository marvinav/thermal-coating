export const enviroment: {
    config?: {
        coatingStartTemperature: number,
        time: number,
        totalTime: number,
        depositTime: number,
        step: number,
        stepInZ: number,
        substrateMaterial: {
            name: string,
            radiance: number,
            heatConductivity: number,
            density: number,
            mass: number
            heatCapacity: number
        },
        coatingMaterial: {
            name: string,
            radiance: number,
            heatConductivity: number,
            density: number,
            mass: number,
            heatCapacity: number
        }
    },
    commands: {
        saveDir: string;
        configPath?: string;
    }
} = {
    commands: {
        saveDir: `${process.cwd()}/results/${Date.now()}`

    }
};
