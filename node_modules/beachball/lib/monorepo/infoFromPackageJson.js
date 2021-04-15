"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const getPackageOptions_1 = require("../options/getPackageOptions");
function infoFromPackageJson(packageJson, packageJsonPath) {
    const packageOptions = getPackageOptions_1.getPackageOptions(path_1.default.dirname(packageJsonPath));
    return {
        name: packageJson.name,
        version: packageJson.version,
        packageJsonPath,
        dependencies: packageJson.dependencies,
        devDependencies: packageJson.devDependencies,
        peerDependencies: packageJson.peerDependencies,
        private: packageJson.private !== undefined ? packageJson.private : false,
        combinedOptions: getPackageOptions_1.getCombinedPackageOptions(packageOptions),
        packageOptions,
    };
}
exports.infoFromPackageJson = infoFromPackageJson;
//# sourceMappingURL=infoFromPackageJson.js.map