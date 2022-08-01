import prompt from "prompt";

const cmdArgs = process.argv;

export const commands: {
  saveDir?: string;
  configPath?: string;
} = {};

const unknownCommands: string[] = [];

for (let i = 0; i < cmdArgs.length; i = i + 2) {
  switch (cmdArgs[i]) {
    case "saveDir":
      commands.saveDir = cmdArgs[i + 1];
      break;
    case "configPath":
      commands.configPath = cmdArgs[i + 1];
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
  return "START_EXECUTION";
}
