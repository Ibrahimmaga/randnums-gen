"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tag_1 = require("../tag");
const workspace_tools_1 = require("workspace-tools");
function createTag(tag, cwd) {
    workspace_tools_1.gitFailFast(['tag', '-a', '-f', tag, '-m', tag], { cwd });
}
function tagPackages(bumpInfo, cwd) {
    const { modifiedPackages, newPackages } = bumpInfo;
    [...modifiedPackages, ...newPackages].forEach(pkg => {
        var _a;
        const packageInfo = bumpInfo.packageInfos[pkg];
        const changeType = (_a = bumpInfo.packageChangeTypes[pkg]) === null || _a === void 0 ? void 0 : _a.type;
        // Do not tag change type of "none", private packages, or packages opting out of tagging
        if (changeType === 'none' || packageInfo.private || !packageInfo.combinedOptions.gitTags) {
            return;
        }
        console.log(`Tagging - ${packageInfo.name}@${packageInfo.version}`);
        const generatedTag = tag_1.generateTag(packageInfo.name, packageInfo.version);
        createTag(generatedTag, cwd);
    });
}
exports.tagPackages = tagPackages;
function tagDistTag(tag, cwd) {
    if (tag && tag !== 'latest') {
        createTag(tag, cwd);
    }
}
exports.tagDistTag = tagDistTag;
//# sourceMappingURL=tagPackages.js.map