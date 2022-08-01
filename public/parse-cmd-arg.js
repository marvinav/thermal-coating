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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCmdArgs = exports.commands = void 0;
const prompt_1 = __importDefault(require("prompt"));
const cmdArgs = process.argv;
exports.commands = {};
const unknownCommands = [];
for (let i = 0; i < cmdArgs.length; i = i + 2) {
    switch (cmdArgs[i]) {
        case "saveDir":
            exports.commands.saveDir = cmdArgs[i + 1];
            break;
        case "configPath":
            exports.commands.configPath = cmdArgs[i + 1];
            break;
        default:
            unknownCommands.push(cmdArgs[i]);
    }
}
function parseCmdArgs() {
    return __awaiter(this, void 0, void 0, function* () {
        prompt_1.default.start();
        prompt_1.default.message = "";
        if (unknownCommands.length > 0) {
            const result = yield prompt_1.default.get({
                required: true,
                type: "string",
                description: `Unknown arguments have been passed: ${unknownCommands.join(",")}. Did you want continue? [Yes/No]`,
                name: "shouldContinue",
                allowEmpty: false,
                pattern: /^((yes)|(no)|(y)|(n))$/gim,
            });
            if (/^(|(no)|(n))$/gim.test(result.shouldContinue.toString())) {
                return "STOP_EXECUTION";
            }
        }
        return "START_EXECUTION";
    });
}
exports.parseCmdArgs = parseCmdArgs;
