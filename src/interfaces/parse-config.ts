import fs from "fs/promises"
import path from "path";
import { enviroment } from "../enviroment";

export const parseConfig = async (configPath: string) => {
    const rawConfig = await fs.readFile(path.resolve(process.cwd(), configPath));
    return JSON.parse(rawConfig.toString()) as typeof enviroment['config'];
}