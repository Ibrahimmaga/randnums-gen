"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getPackageChangeTypes_1 = require("../changefile/getPackageChangeTypes");
const readChangeFiles_1 = require("../changefile/readChangeFiles");
const getPackageInfos_1 = require("../monorepo/getPackageInfos");
const bumpInPlace_1 = require("./bumpInPlace");
const getScopedPackages_1 = require("../monorepo/getScopedPackages");
const paths_1 = require("../paths");
const path_1 = __importDefault(require("path"));
function gatherPreBumpInfo(options) {
    const { path: cwd } = options;
    // Collate the changes per package
    const packageInfos = getPackageInfos_1.getPackageInfos(cwd);
    const changes = readChangeFiles_1.readChangeFiles(options);
    const changePath = paths_1.getChangePath(cwd);
    const dependentChangeTypes = {};
    const groupOptions = {};
    // Clear changes for non-existent and accidental private packages
    // NOTE: likely these are from the same PR that deleted or modified the private flag
    const filteredChanges = new Map();
    for (let [changeFile, change] of changes) {
        if (!packageInfos[change.packageName] || packageInfos[change.packageName].private) {
            console.warn(`Invalid change file detected (non-existent package or private package); delete this file "${path_1.default.resolve(changePath, changeFile)}"`);
            continue;
        }
        filteredChanges.set(changeFile, change);
        dependentChangeTypes[change.packageName] = change.dependentChangeType || 'patch';
    }
    // Clear non-existent changeTypes
    const packageChangeTypes = getPackageChangeTypes_1.getPackageChangeTypes(filteredChanges);
    Object.keys(packageChangeTypes).forEach(packageName => {
        if (!packageInfos[packageName]) {
            delete packageChangeTypes[packageName];
        }
    });
    return {
        packageChangeTypes,
        packageInfos,
        packageGroups: {},
        changes: filteredChanges,
        modifiedPackages: new Set(),
        newPackages: new Set(),
        scopedPackages: new Set(getScopedPackages_1.getScopedPackages(options)),
        dependentChangeTypes,
        groupOptions,
        dependents: {},
        dependentChangeInfos: new Array(),
    };
}
function gatherBumpInfo(options) {
    const bumpInfo = gatherPreBumpInfo(options);
    bumpInPlace_1.bumpInPlace(bumpInfo, options);
    return bumpInfo;
}
exports.gatherBumpInfo = gatherBumpInfo;
//# sourceMappingURL=gatherBumpInfo.js.map