"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cosmiconfig_1 = require("cosmiconfig");
const workspace_tools_1 = require("workspace-tools");
function getRepoOptions(cliOptions) {
    let repoOptions;
    if (cliOptions.configPath) {
        repoOptions = tryLoadConfig(cliOptions.configPath);
        if (!repoOptions) {
            console.error(`Config file "${cliOptions.configPath}" could not be loaded`);
            process.exit(1);
        }
    }
    else {
        repoOptions = trySearchConfig() || {};
    }
    // Only if the branch isn't specified in cliOptions (which takes precedence), fix it up or add it
    // in repoOptions. (We don't want to do the getDefaultRemoteBranch() lookup unconditionally to
    // avoid potential for log messages/errors which aren't relevant if the branch was specified on
    // the command line.)
    if (!cliOptions.branch) {
        if (repoOptions.branch && !repoOptions.branch.includes('/')) {
            // Add a remote to the branch if it's not already included
            repoOptions.branch = workspace_tools_1.getDefaultRemoteBranch(repoOptions.branch, cliOptions.path);
        }
        else if (!repoOptions.branch) {
            // Branch is not specified at all. Add in the default remote and branch.
            repoOptions.branch = workspace_tools_1.getDefaultRemoteBranch('master', cliOptions.path);
        }
    }
    return repoOptions;
}
exports.getRepoOptions = getRepoOptions;
function tryLoadConfig(configPath) {
    const configExplorer = cosmiconfig_1.cosmiconfigSync('beachball');
    const loadResults = configExplorer.load(configPath);
    return (loadResults && loadResults.config) || null;
}
function trySearchConfig() {
    const configExplorer = cosmiconfig_1.cosmiconfigSync('beachball');
    const searchResults = configExplorer.search();
    return (searchResults && searchResults.config) || null;
}
//# sourceMappingURL=getRepoOptions.js.map