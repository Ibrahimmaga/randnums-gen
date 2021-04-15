"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getPackageChangeTypes_1 = require("../changefile/getPackageChangeTypes");
/**
 * Updates package change types based on dependents (e.g given A -> B, if B has a minor change, A should also have minor change)
 *
 * This function is recursive and will futher call itself to update related dependent packages noting groups and bumpDeps flag
 */
function updateRelatedChangeType(pkgName, changeInfo, bumpInfo, dependentChangeInfos, bumpDeps) {
    var _a, _b, _c;
    const { packageChangeTypes, packageGroups, dependents, packageInfos, dependentChangeTypes, groupOptions } = bumpInfo;
    const packageInfo = packageInfos[pkgName];
    const disallowedChangeTypes = (_b = (_a = packageInfo.combinedOptions) === null || _a === void 0 ? void 0 : _a.disallowedChangeTypes, (_b !== null && _b !== void 0 ? _b : []));
    let depChangeInfo = getPackageChangeTypes_1.updateChangeInfoWithMaxType(changeInfo, getPackageChangeTypes_1.MinChangeType, dependentChangeTypes[pkgName], disallowedChangeTypes);
    let dependentPackages = dependents[pkgName];
    // Handle groups
    packageChangeTypes[pkgName] = getPackageChangeTypes_1.updateChangeInfoWithMaxType(packageChangeTypes[pkgName], changeInfo.type, (_c = packageChangeTypes[pkgName]) === null || _c === void 0 ? void 0 : _c.type, disallowedChangeTypes);
    const groupName = packageInfos[pkgName].group;
    if (groupName) {
        let groupChangeInfo = Object.assign(Object.assign({}, changeInfo), { type: getPackageChangeTypes_1.MinChangeType });
        // calculate maxChangeType
        packageGroups[groupName].packageNames.forEach(groupPkgName => {
            var _a, _b;
            groupChangeInfo = Object.assign(Object.assign({}, groupChangeInfo), { type: getPackageChangeTypes_1.getMaxChangeType(groupChangeInfo.type, (_a = packageChangeTypes[groupPkgName]) === null || _a === void 0 ? void 0 : _a.type, (_b = groupOptions[groupName]) === null || _b === void 0 ? void 0 : _b.disallowedChangeTypes) });
            // disregard the target disallowed types for now and will be culled at the subsequent update steps
            dependentChangeTypes[groupPkgName] = getPackageChangeTypes_1.getMaxChangeType(depChangeInfo.type, dependentChangeTypes[groupPkgName], []);
        });
        packageGroups[groupName].packageNames.forEach(groupPkgName => {
            var _a;
            if (((_a = packageChangeTypes[groupPkgName]) === null || _a === void 0 ? void 0 : _a.type) !== groupChangeInfo.type) {
                updateRelatedChangeType(groupPkgName, groupChangeInfo, bumpInfo, dependentChangeInfos, bumpDeps);
            }
        });
    }
    if (bumpDeps && dependentPackages) {
        new Set(dependentPackages).forEach(parent => {
            var _a;
            if (((_a = packageChangeTypes[parent]) === null || _a === void 0 ? void 0 : _a.type) !== depChangeInfo.type) {
                // propagate the dependentChangeType of the current package to the subsequent related packages
                dependentChangeTypes[parent] = depChangeInfo.type;
                let changeInfos = dependentChangeInfos.get(pkgName);
                if (!changeInfos) {
                    changeInfos = new Map();
                    dependentChangeInfos.set(pkgName, changeInfos);
                }
                let prevChangeInfo = changeInfos.get(parent);
                let nextChangeInfo = {
                    type: depChangeInfo.type,
                    packageName: parent,
                    email: depChangeInfo.email,
                    commit: depChangeInfo.commit,
                    comment: '',
                };
                if (prevChangeInfo) {
                    nextChangeInfo = Object.assign(Object.assign({}, nextChangeInfo), { type: getPackageChangeTypes_1.getMaxChangeType(prevChangeInfo.type, nextChangeInfo.type, disallowedChangeTypes) });
                }
                changeInfos.set(parent, nextChangeInfo);
                updateRelatedChangeType(parent, depChangeInfo, bumpInfo, dependentChangeInfos, bumpDeps);
            }
        });
    }
}
exports.updateRelatedChangeType = updateRelatedChangeType;
//# sourceMappingURL=updateRelatedChangeType.js.map