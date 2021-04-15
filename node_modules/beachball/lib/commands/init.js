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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const os = __importStar(require("os"));
const paths_1 = require("../paths");
function init(options) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const root = paths_1.findProjectRoot(options.path);
        if (!root) {
            console.log('Please run this command on an existing repository root.');
            return;
        }
        const packageJsonFilePath = path.join(root, 'package.json');
        const npmCmd = path.join(path.dirname(process.execPath), os.platform() === 'win32' ? 'npm.cmd' : 'npm');
        if (fs.existsSync(packageJsonFilePath)) {
            const beachballInfo = JSON.parse(child_process_1.spawnSync(npmCmd, ['info', 'beachball', '--json']).stdout);
            const beachballVersion = beachballInfo['dist-tags'].latest;
            const packageJson = JSON.parse(fs.readFileSync(packageJsonFilePath, 'utf-8'));
            packageJson.devDependencies = (_a = packageJson.devDependencies, (_a !== null && _a !== void 0 ? _a : {}));
            packageJson.devDependencies.beachball = beachballVersion;
            packageJson.scripts = (_b = packageJson.scripts, (_b !== null && _b !== void 0 ? _b : {}));
            packageJson.scripts.checkchange = 'beachball check';
            packageJson.scripts.change = 'beachball change';
            packageJson.scripts.release = 'beachball publish';
            fs.writeFileSync(packageJsonFilePath, JSON.stringify(packageJson, null, 2));
            console.log('beachball has been initialized, please run `yarn` or `npm install` to install beachball into your repo');
        }
    });
}
exports.init = init;
//# sourceMappingURL=init.js.map