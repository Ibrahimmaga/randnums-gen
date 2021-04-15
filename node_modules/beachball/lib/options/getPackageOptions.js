"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cosmiconfig_1 = require("cosmiconfig");
const getCliOptions_1 = require("./getCliOptions");
const getRepoOptions_1 = require("./getRepoOptions");
const getDefaultOptions_1 = require("./getDefaultOptions");
const path_1 = __importDefault(require("path"));
/**
 * Gets all package level options (default + root options + package options + cli options)
 * This function inherits packageOptions from the repoOptions
 */
function getCombinedPackageOptions(actualPackageOptions) {
    const defaultOptions = getDefaultOptions_1.getDefaultOptions();
    const cliOptions = getCliOptions_1.getCliOptions(process.argv);
    const repoOptions = getRepoOptions_1.getRepoOptions(cliOptions);
    return Object.assign(Object.assign(Object.assign(Object.assign({}, defaultOptions), repoOptions), actualPackageOptions), cliOptions);
}
exports.getCombinedPackageOptions = getCombinedPackageOptions;
/**
 * Gets all the package options from the configuration file of the package itself without inheritance
 */
function getPackageOptions(packagePath) {
    const configExplorer = cosmiconfig_1.cosmiconfigSync('beachball', { cache: false });
    try {
        const results = configExplorer.load(path_1.default.join(packagePath, 'package.json'));
        return (results && results.config) || {};
    }
    catch (e) {
        // File does not exist, returns the default packageOptions
        return {};
    }
}
exports.getPackageOptions = getPackageOptions;
//# sourceMappingURL=getPackageOptions.js.map