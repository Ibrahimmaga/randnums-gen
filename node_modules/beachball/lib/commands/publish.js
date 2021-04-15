"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gatherBumpInfo_1 = require("../bump/gatherBumpInfo");
const workspace_tools_1 = require("workspace-tools");
const prompts_1 = __importDefault(require("prompts"));
const getPackageChangeTypes_1 = require("../changefile/getPackageChangeTypes");
const readChangeFiles_1 = require("../changefile/readChangeFiles");
const bumpAndPush_1 = require("../publish/bumpAndPush");
const publishToRegistry_1 = require("../publish/publishToRegistry");
const getNewPackages_1 = require("../publish/getNewPackages");
function publish(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { path: cwd, branch, registry, tag } = options;
        // First, validate that we have changes to publish
        const changes = readChangeFiles_1.readChangeFiles(options);
        const packageChangeTypes = getPackageChangeTypes_1.getPackageChangeTypes(changes);
        if (Object.keys(packageChangeTypes).length === 0) {
            console.log('Nothing to bump, skipping publish!');
            return;
        }
        // Collate the changes per package
        const currentBranch = workspace_tools_1.getBranchName(cwd);
        const currentHash = workspace_tools_1.getCurrentHash(cwd);
        console.log(`Publishing with the following configuration:

  registry: ${registry}

  current branch: ${currentBranch}
  current hash: ${currentHash}
  target branch: ${branch}
  tag: ${tag}

  bumps versions: ${options.bump ? 'yes' : 'no'}
  publishes to npm registry: ${options.publish ? 'yes' : 'no'}
  pushes to remote git repo: ${options.bump && options.push && options.branch ? 'yes' : 'no'}

`);
        if (!options.yes) {
            const response = yield prompts_1.default({
                type: 'confirm',
                name: 'yes',
                message: 'Is everything correct (use the --yes or -y arg to skip this prompt)?',
            });
            if (!response.yes) {
                return;
            }
        }
        // checkout publish branch
        const publishBranch = 'publish_' + String(new Date().getTime());
        console.log(`creating temporary publish branch ${publishBranch}`);
        workspace_tools_1.gitFailFast(['checkout', '-b', publishBranch], { cwd });
        if (options.bump) {
            console.log('Bumping version for npm publish');
        }
        const bumpInfo = gatherBumpInfo_1.gatherBumpInfo(options);
        if (options.new) {
            bumpInfo.newPackages = new Set(yield getNewPackages_1.getNewPackages(bumpInfo, options.registry));
        }
        // Step 1. Bump + npm publish
        // npm / yarn publish
        if (options.publish) {
            yield publishToRegistry_1.publishToRegistry(bumpInfo, options);
        }
        else {
            console.log('Skipping publish');
        }
        // Step 2.
        // - reset, fetch latest from origin/master (to ensure less chance of conflict), then bump again + commit
        if (options.bump && branch && options.push) {
            yield bumpAndPush_1.bumpAndPush(bumpInfo, publishBranch, options);
        }
        else {
            console.log('Skipping git push and tagging');
        }
        // Step 3.
        // Clean up: switch back to current branch, delete publish branch
        const revParseSuccessful = currentBranch || currentHash;
        const inBranch = currentBranch && currentBranch !== 'HEAD';
        const hasHash = currentHash !== null;
        if (inBranch) {
            console.log(`git checkout ${currentBranch}`);
            workspace_tools_1.gitFailFast(['checkout', currentBranch], { cwd });
        }
        else if (hasHash) {
            console.log(`Looks like the repo was detached from a branch`);
            console.log(`git checkout ${currentHash}`);
            workspace_tools_1.gitFailFast(['checkout', currentHash], { cwd });
        }
        if (revParseSuccessful) {
            console.log(`deleting temporary publish branch ${publishBranch}`);
            workspace_tools_1.gitFailFast(['branch', '-D', publishBranch], { cwd });
        }
    });
}
exports.publish = publish;
//# sourceMappingURL=publish.js.map