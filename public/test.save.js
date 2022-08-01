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
const path_1 = __importDefault(require("path"));
const create_mesh_1 = require("./create-mesh");
const save_mesh_1 = require("./save-mesh");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const mesh = (0, create_mesh_1.createMesh)({ x: 10, y: 10 }, { x: 1, y: 1 });
        console.log(path_1.default.join(__dirname, `save.cs`));
        yield (0, save_mesh_1.saveMesh)({ mesh, path: path_1.default.join(__dirname, `save.cs`) });
    });
}
main();
