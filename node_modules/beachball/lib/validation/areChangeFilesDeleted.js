"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("../paths");
const workspace_tools_1 = require("workspace-tools");
function areChangeFilesDeleted(options) {
    const { branch, path: cwd } = options;
    const root = paths_1.findProjectRoot(cwd);
    if (!root) {
        console.error('Failed to find the project root');
        process.exit(1);
    }
    const changePath = paths_1.getChangePath(cwd);
    if (!changePath) {
        console.error('Failed to find a folder with change files');
        process.exit(1);
    }
    console.log(`Checking for deleted change files against "${branch}"`);
    const changeFilesDeletedSinceRef = workspace_tools_1.getChangesBetweenRefs(branch, 'HEAD', [
        '--diff-filter=D',
    ], `${changePath}/*.json`, root);
    // if this value is undefined, git has failed to execute the command above.
    if (!changeFilesDeletedSinceRef) {
        process.exit(1);
    }
    const changeFilesDeleted = changeFilesDeletedSinceRef.length > 0;
    if (changeFilesDeleted) {
        const changeFiles = changeFilesDeletedSinceRef.map(file => `- ${file}`);
        const errorMessage = 'The following change files were deleted:';
        console.error(`${errorMessage}\n${changeFiles.join('\n')}\n`);
    }
    return changeFilesDeleted;
}
exports.areChangeFilesDeleted = areChangeFilesDeleted;
//# sourceMappingURL=areChangeFilesDeleted.js.map