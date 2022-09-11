import prompt from "prompt";
import fs from "fs/promises";
import path from "path";

import { enviroment } from "../enviroment";
import { createPaths } from "./create-paths";
import { parseConfig } from "./parse-config";

let cmdArgs = process.argv.slice(2);

if (cmdArgs) {
  let flattenArgs: string[] = [];
  cmdArgs.forEach(x => {
    if (x.includes('=')) {
      flattenArgs.push(...x.split('='))
    } else {
      flattenArgs.push(x);
    }
  })
  cmdArgs = flattenArgs;
}


const unknownCommands: string[] = [];

for (let i = 0; i < cmdArgs.length; i = i + 2) {
  switch (cmdArgs[i]) {
    case "saveDir":
      enviroment.commands.saveDir = cmdArgs[i + 1];
      break;
    case "configPath":
      enviroment.commands.configPath = cmdArgs[i + 1];
      break;
    default:
      unknownCommands.push(cmdArgs[i]);
  }
}

export async function parseCmdArgs() {
  prompt.start();
  prompt.message = "";
  if (unknownCommands.length > 0) {
    const result = await prompt.get({
      required: true,
      type: "string",
      description: `Unknown arguments have been passed: ${unknownCommands.join(
        ","
      )}. Did you want continue? [Yes/No]`,
      name: "shouldContinue",
      allowEmpty: false,
      pattern: /^((yes)|(no)|(y)|(n))$/gim,
    });
    if (/^(|(no)|(n))$/gim.test(result.shouldContinue.toString())) {
      return "STOP_EXECUTION";
    }
  }
  if (!enviroment.commands.configPath) {
    console.error("Config path not provided");
    return "STOP_EXECUTION";
  }
  const saveDir = await createPaths(enviroment.commands.saveDir);
  enviroment.commands.saveDir = saveDir;
  console.log(`Results will be saved to ${enviroment.commands.saveDir}`)
  enviroment.config = await parseConfig(enviroment.commands.configPath);
  await fs.copyFile(enviroment.commands.configPath, path.resolve(enviroment.commands.saveDir, enviroment.commands.configPath));
  return "START_EXECUTION";
}
