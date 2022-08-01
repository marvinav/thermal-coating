"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
const parse_cmd_arg_1 = require("./interfaces/parse-cmd-arg");
const main_1 = require("./lib/main");
(0, parse_cmd_arg_1.parseCmdArgs)().then((x) => __awaiter(void 0, void 0, void 0, function* () {
    if (x === "START_EXECUTION") {
        yield (0, main_1.main)();
    }
    else {
        (0, process_1.exit)(1);
    }
}));
