"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const workspace_tools_1 = require("workspace-tools");
/**
 * Starting from `cwd`, searches up the directory hierarchy for `pathName`
 */
function searchUp(pathName, cwd) {
    const root = path_1.default.parse(cwd).root;
    let found = false;
    while (!found && cwd !== root) {
        if (fs_extra_1.default.existsSync(path_1.default.join(cwd, pathName))) {
            found = true;
            break;
        }
        cwd = path_1.default.dirname(cwd);
    }
    if (found) {
        return cwd;
    }
    return null;
}
exports.searchUp = searchUp;
function findGitRoot(cwd) {
    return searchUp('.git', cwd);
}
exports.findGitRoot = findGitRoot;
function findProjectRoot(cwd) {
    let workspaceRoot;
    try {
        workspaceRoot = workspace_tools_1.getWorkspaceRoot(cwd);
    }
    catch (_a) { }
    return workspaceRoot || findGitRoot(cwd);
}
exports.findProjectRoot = findProjectRoot;
function findPackageRoot(cwd) {
    return searchUp('package.json', cwd);
}
exports.findPackageRoot = findPackageRoot;
function getChangePath(cwd) {
    const root = findProjectRoot(cwd);
    if (root) {
        return path_1.default.join(root, 'change');
    }
    return null;
}
exports.getChangePath = getChangePath;
function isChildOf(child, parent) {
    const relativePath = path_1.default.relative(child, parent);
    return /^[.\/\\]+$/.test(relativePath);
}
exports.isChildOf = isChildOf;
//# sourceMappingURL=paths.js.map