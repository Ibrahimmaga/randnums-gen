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
Object.defineProperty(exports, "__esModule", { value: true });
const performBump_1 = require("../bump/performBump");
const workspace_tools_1 = require("workspace-tools");
const tagPackages_1 = require("./tagPackages");
const mergePublishBranch_1 = require("./mergePublishBranch");
const displayManualRecovery_1 = require("./displayManualRecovery");
const BUMP_PUSH_RETRIES = 5;
function bumpAndPush(bumpInfo, publishBranch, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { path: cwd, branch, tag, message } = options;
        const { remote, remoteBranch } = workspace_tools_1.parseRemoteBranch(branch);
        let completed = false;
        let tryNumber = 0;
        while (tryNumber < BUMP_PUSH_RETRIES && !completed) {
            tryNumber++;
            console.log(`Trying to push to git. Attempt ${tryNumber}/${BUMP_PUSH_RETRIES}`);
            console.log('Reverting');
            workspace_tools_1.revertLocalChanges(cwd);
            // pull in latest from origin branch
            console.log('Fetching from remote');
            workspace_tools_1.gitFailFast(['fetch', remote, remoteBranch], { cwd });
            const mergeResult = workspace_tools_1.git(['merge', '-X', 'theirs', `${branch}`], { cwd });
            if (!mergeResult.success) {
                console.warn(`[WARN ${tryNumber}/${BUMP_PUSH_RETRIES}]: pull from ${branch} has failed!\n${mergeResult.stderr}`);
                continue;
            }
            // bump the version
            console.log('Bumping the versions for git push');
            yield performBump_1.performBump(bumpInfo, options);
            // checkin
            const mergePublishBranchResult = mergePublishBranch_1.mergePublishBranch(publishBranch, branch, message, cwd);
            if (!mergePublishBranchResult.success) {
                console.warn(`[WARN ${tryNumber}/${BUMP_PUSH_RETRIES}]: merging to target has failed!`);
                continue;
            }
            // Tag & Push to remote
            tagPackages_1.tagPackages(bumpInfo, cwd);
            if (options.gitTags) {
                tagPackages_1.tagDistTag(tag, cwd);
            }
            console.log(`pushing to ${branch}, running the following command for git push:`);
            const pushArgs = ['push', '--no-verify', '--follow-tags', '--verbose', remote, `HEAD:${remoteBranch}`];
            console.log('git ' + pushArgs.join(' '));
            const pushResult = workspace_tools_1.git(pushArgs, { cwd });
            if (!pushResult.success) {
                console.warn(`[WARN ${tryNumber}/${BUMP_PUSH_RETRIES}]: push to ${branch} has failed!\n${pushResult.stderr}`);
                continue;
            }
            else {
                console.log(pushResult.stdout.toString());
                console.log(pushResult.stderr.toString());
                completed = true;
            }
        }
        if (!completed) {
            displayManualRecovery_1.displayManualRecovery(bumpInfo);
            process.exit(1);
        }
    });
}
exports.bumpAndPush = bumpAndPush;
//# sourceMappingURL=bumpAndPush.js.map