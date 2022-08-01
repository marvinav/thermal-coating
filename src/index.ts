import { exit } from "process";

import { parseCmdArgs } from "./interfaces/parse-cmd-arg";
import { main } from "./lib/main";

parseCmdArgs().then(async (x) => {
  if (x === "START_EXECUTION") {
    await main();
  } else {
    exit(1);
  }
});
