import path from "path"
import fs from 'fs/promises';

export const createPaths = async (targetPath: string) => {
    const fullPath = path.resolve(process.cwd(), targetPath);
    await fs.mkdir(fullPath, { recursive: true, });
    return fullPath;
}