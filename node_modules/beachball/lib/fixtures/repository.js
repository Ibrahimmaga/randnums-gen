"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process = __importStar(require("process"));
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs-extra"));
const tmpdir_1 = require("./tmpdir");
const workspace_tools_1 = require("workspace-tools");
exports.packageJsonFixture = {
    name: 'foo',
    version: '1.0.0',
    dependencies: {
        bar: '1.0.0',
        baz: '1.0.0',
    },
};
class RepositoryFactory {
    constructor() {
        /** Cloned child repos, tracked so we can clean them up */
        this.childRepos = [];
    }
    create() {
        const originalDirectory = process.cwd();
        this.root = tmpdir_1.tmpdir({ prefix: 'beachball-repository-upstream-' });
        process.chdir(this.root);
        workspace_tools_1.git(['init', '--bare'], { cwd: this.root });
        const tmpRepo = new Repository();
        this.childRepos.push(tmpRepo);
        tmpRepo.initialize();
        tmpRepo.cloneFrom(this.root);
        tmpRepo.commitChange('README');
        fs.writeJSONSync(path_1.default.join(tmpRepo.rootPath, 'package.json'), exports.packageJsonFixture, {
            spaces: 2,
        });
        tmpRepo.commitChange('package.json');
        tmpRepo.push('origin', 'HEAD:master');
        process.chdir(originalDirectory);
    }
    cloneRepository() {
        if (!this.root) {
            throw new Error('Must create before cloning');
        }
        const newRepo = new Repository();
        newRepo.initialize();
        newRepo.cloneFrom(this.root);
        return newRepo;
    }
    cleanUp() {
        if (!this.root) {
            throw new Error('Must create before cleaning up');
        }
        fs.removeSync(this.root);
        for (const repo of this.childRepos) {
            repo.cleanUp();
        }
    }
}
exports.RepositoryFactory = RepositoryFactory;
class Repository {
    initialize() {
        this.root = tmpdir_1.tmpdir({ prefix: 'beachball-repository-cloned-' });
    }
    get rootPath() {
        if (!this.root) {
            throw new Error('Must initialize before accessing path');
        }
        return this.root;
    }
    cloneFrom(path, originName) {
        if (!this.root) {
            throw new Error('Must initialize before cloning');
        }
        workspace_tools_1.git(['clone', ...(originName ? ['-o', originName] : []), path, '.'], { cwd: this.root });
        workspace_tools_1.git(['config', 'user.email', 'ci@example.com'], { cwd: this.root });
        workspace_tools_1.git(['config', 'user.name', 'CIUSER'], { cwd: this.root });
        this.origin = path;
    }
    /** Commits a change, automatically uses root path, do not pass absolute paths here */
    commitChange(newFilename, content) {
        if (!this.root) {
            throw new Error('Must initialize before cloning');
        }
        fs.ensureFileSync(path_1.default.join(this.root, newFilename));
        if (content) {
            fs.writeFileSync(path_1.default.join(this.root, newFilename), content);
        }
        workspace_tools_1.git(['add', newFilename], { cwd: this.root });
        workspace_tools_1.git(['commit', '-m', `"${newFilename}"`], { cwd: this.root });
    }
    /** Commits a change, automatically uses root path, do not pass absolute paths here */
    commitAll() {
        if (!this.root) {
            throw new Error('Must initialize before cloning');
        }
        workspace_tools_1.git(['add', '-A'], { cwd: this.root });
        workspace_tools_1.git(['commit', '-m', 'Committing everything'], { cwd: this.root });
    }
    getCurrentHash() {
        if (!this.root) {
            throw new Error('Must initialize before getting head');
        }
        const result = workspace_tools_1.git(['rev-parse', 'HEAD'], { cwd: this.root });
        return result.stdout.trim();
    }
    branch(branchName) {
        if (!this.root) {
            throw new Error('Must initialize before cloning');
        }
        workspace_tools_1.git(['checkout', '-b', branchName], { cwd: this.root });
    }
    push(remote, branch) {
        if (!this.root) {
            throw new Error('Must initialize before push');
        }
        workspace_tools_1.git(['push', remote, branch], { cwd: this.root });
    }
    cleanUp() {
        if (!this.root) {
            throw new Error('Must initialize before clean up');
        }
        fs.removeSync(this.root);
    }
    /**
     * Set to invalid root
     */
    setRemoteUrl(remote, remoteUrl) {
        if (!this.root) {
            throw new Error('Must initialize before change remote url');
        }
        workspace_tools_1.git(['remote', 'set-url', remote, remoteUrl], { cwd: this.root });
    }
}
exports.Repository = Repository;
//# sourceMappingURL=repository.js.map