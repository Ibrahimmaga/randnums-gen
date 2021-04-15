"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * List of all change types from least to most significant.
 */
exports.SortedChangeTypes = ['none', 'prerelease', 'patch', 'minor', 'major'];
/**
 * Change type with the smallest weight.
 */
exports.MinChangeType = exports.SortedChangeTypes[0];
/**
 * Change type weights.
 * Note: the order in which this is defined is IMPORTANT.
 */
const ChangeTypeWeights = exports.SortedChangeTypes.reduce((weights, changeType, index) => {
    weights[changeType] = index;
    return weights;
}, {});
function getPackageChangeTypes(changeSet) {
    const changePerPackage = {};
    for (let change of changeSet.values()) {
        const { packageName } = change;
        if (!changePerPackage[packageName] || isChangeTypeGreater(change.type, changePerPackage[packageName].type)) {
            changePerPackage[packageName] = change;
        }
    }
    return changePerPackage;
}
exports.getPackageChangeTypes = getPackageChangeTypes;
function isChangeTypeGreater(a, b) {
    if (ChangeTypeWeights[a] > ChangeTypeWeights[b]) {
        return true;
    }
    else {
        return false;
    }
}
exports.isChangeTypeGreater = isChangeTypeGreater;
function getAllowedChangeType(changeType, disallowedChangeTypes) {
    if (!changeType) {
        return 'none';
    }
    if (!disallowedChangeTypes) {
        return changeType;
    }
    while (disallowedChangeTypes.includes(changeType) && changeType !== 'none') {
        const nextChangeTypeWeight = ChangeTypeWeights[changeType] - 1;
        changeType = exports.SortedChangeTypes[nextChangeTypeWeight];
    }
    return changeType;
}
exports.getAllowedChangeType = getAllowedChangeType;
function updateChangeInfoWithMaxType(changeInfo, inputA, inputB, disallowedChangeTypes) {
    return Object.assign(Object.assign({}, changeInfo), { type: getMaxChangeType(inputA, inputB, disallowedChangeTypes) });
}
exports.updateChangeInfoWithMaxType = updateChangeInfoWithMaxType;
function getMaxChangeType(inputA, inputB, disallowedChangeTypes) {
    const a = getAllowedChangeType(inputA, disallowedChangeTypes);
    const b = getAllowedChangeType(inputB, disallowedChangeTypes);
    if (!b && !a) {
        return 'none';
    }
    if (!b) {
        return a;
    }
    if (!a) {
        return b;
    }
    if (isChangeTypeGreater(a, b)) {
        return a;
    }
    else {
        return b;
    }
}
exports.getMaxChangeType = getMaxChangeType;
//# sourceMappingURL=getPackageChangeTypes.js.map