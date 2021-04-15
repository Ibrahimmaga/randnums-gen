"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("../paths");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const workspace_tools_1 = require("workspace-tools");
const infoFromPackageJson_1 = require("./infoFromPackageJson");
function getPackageInfos(cwd) {
    const projectRoot = paths_1.findProjectRoot(cwd);
    const packageRoot = paths_1.findPackageRoot(cwd);
    return ((projectRoot && getPackageInfosFromWorkspace(projectRoot)) ||
        (projectRoot && getPackageInfosFromNonWorkspaceMonorepo(projectRoot)) ||
        (packageRoot && getPackageInfosFromSingleRepo(packageRoot)) ||
        {});
}
exports.getPackageInfos = getPackageInfos;
function getPackageInfosFromWorkspace(projectRoot) {
    try {
        const packageInfos = {};
        // first try using the workspace provided packages (if available)
        const workspaceInfo = workspace_tools_1.getWorkspaces(projectRoot);
        if (workspaceInfo && workspaceInfo.length > 0) {
            workspaceInfo.forEach(info => {
                const { path: packagePath, packageJson } = info;
                const packageJsonPath = path_1.default.join(packagePath, 'package.json');
                try {
                    packageInfos[packageJson.name] = infoFromPackageJson_1.infoFromPackageJson(packageJson, packageJsonPath);
                }
                catch (e) {
                    // Pass, the package.json is invalid
                    console.warn(`Invalid package.json file detected ${packageJsonPath}: `, e);
                }
            });
            return packageInfos;
        }
    }
    catch (e) {
        // not a recognized workspace from workspace-tools
    }
}
function getPackageInfosFromNonWorkspaceMonorepo(projectRoot) {
    const packageJsonFiles = workspace_tools_1.listAllTrackedFiles(['**/package.json', 'package.json'], projectRoot);
    const packageInfos = {};
    if (packageJsonFiles && packageJsonFiles.length > 0) {
        packageJsonFiles.forEach(packageJsonPath => {
            try {
                const packageJsonFullPath = path_1.default.join(projectRoot, packageJsonPath);
                const packageJson = fs_extra_1.default.readJSONSync(packageJsonFullPath);
                packageInfos[packageJson.name] = infoFromPackageJson_1.infoFromPackageJson(packageJson, packageJsonFullPath);
            }
            catch (e) {
                // Pass, the package.json is invalid
                console.warn(`Invalid package.json file detected ${packageJsonPath}: `, e);
            }
        });
        return packageInfos;
    }
}
function getPackageInfosFromSingleRepo(packageRoot) {
    const packageInfos = {};
    const packageJsonFullPath = path_1.default.resolve(packageRoot, 'package.json');
    const packageJson = fs_extra_1.default.readJSONSync(packageJsonFullPath);
    packageInfos[packageJson.name] = infoFromPackageJson_1.infoFromPackageJson(packageJson, packageJsonFullPath);
    return packageInfos;
}
//# sourceMappingURL=getPackageInfos.js.map