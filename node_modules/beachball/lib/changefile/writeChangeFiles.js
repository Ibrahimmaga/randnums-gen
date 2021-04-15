"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("../paths");
const workspace_tools_1 = require("workspace-tools");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
/**
 * Loops through the `changes` and writes out a list of change files
 * @returns List of changefile paths, mainly for testing purposes.
 */
function writeChangeFiles(changes, cwd, commitChangeFiles = true) {
    if (Object.keys(changes).length === 0) {
        return [];
    }
    const changePath = paths_1.getChangePath(cwd);
    const branchName = workspace_tools_1.getBranchName(cwd);
    if (changePath && !fs_extra_1.default.existsSync(changePath)) {
        fs_extra_1.default.mkdirpSync(changePath);
    }
    if (changes && branchName && changePath) {
        const changeFiles = Object.keys(changes).map(pkgName => {
            const change = changes[pkgName];
            const prefix = pkgName.replace(/[^a-zA-Z0-9@]/g, '-');
            const fileName = `${prefix}-${uuid_1.v4()}.json`;
            let changeFile = path_1.default.join(changePath, fileName);
            fs_extra_1.default.writeJSONSync(changeFile, change, { spaces: 2 });
            return changeFile;
        });
        workspace_tools_1.stage(changeFiles, cwd);
        if (commitChangeFiles) {
            workspace_tools_1.commit('Change files', cwd);
        }
        console.log(`git ${commitChangeFiles ? 'commited' : 'staged'} these change files: ${changeFiles
            .map(f => ` - ${f}`)
            .join('\n')}`);
        return changeFiles;
    }
    return [];
}
exports.writeChangeFiles = writeChangeFiles;
//# sourceMappingURL=writeChangeFiles.js.map