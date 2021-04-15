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
const repository_1 = require("./repository");
const workspace_tools_1 = require("workspace-tools");
exports.packageJsonFixtures = {
    'packages/foo': {
        name: 'foo',
        version: '1.0.0',
        dependencies: {
            bar: '^1.3.4',
        },
        main: 'src/index.ts',
        onPublish: {
            main: 'lib/index.js',
        },
        afterPublish: {
            notify: 'message',
        },
    },
    'packages/bar': {
        name: 'bar',
        version: '1.3.4',
    },
    'packages/grouped/a': {
        name: 'a',
        version: '3.1.2',
    },
    'packages/grouped/b': {
        name: 'b',
        version: '3.1.2',
        dependencies: ['bar'],
    },
};
const beachballConfigFixture = {
    groups: [
        {
            disallowedChangeTypes: null,
            name: 'grouped',
            include: 'grouped*',
        },
    ],
};
class MonoRepoFactory extends repository_1.RepositoryFactory {
    create() {
        const originalDirectory = process.cwd();
        this.root = tmpdir_1.tmpdir({ prefix: 'beachball-monorepository-upstream-' });
        process.chdir(this.root);
        workspace_tools_1.git(['init', '--bare'], { cwd: this.root });
        const tmpRepo = new repository_1.Repository();
        this.childRepos.push(tmpRepo);
        tmpRepo.initialize();
        tmpRepo.cloneFrom(this.root);
        tmpRepo.commitChange('README');
        for (const pkg of Object.keys(exports.packageJsonFixtures)) {
            const packageJsonFixture = exports.packageJsonFixtures[pkg];
            const packageJsonFile = path_1.default.join(pkg, 'package.json');
            fs.mkdirpSync(path_1.default.join(tmpRepo.rootPath, pkg));
            fs.writeJSONSync(path_1.default.join(tmpRepo.rootPath, packageJsonFile), packageJsonFixture, {
                spaces: 2,
            });
            tmpRepo.commitChange(packageJsonFile);
        }
        tmpRepo.commitChange('package.json', JSON.stringify({ name: 'monorepo-fixture', version: '1.0.0' }, null, 2));
        tmpRepo.commitChange('beachball.config.js', 'module.exports = ' + JSON.stringify(beachballConfigFixture, null, 2));
        tmpRepo.push('origin', 'HEAD:master');
        process.chdir(originalDirectory);
    }
}
exports.MonoRepoFactory = MonoRepoFactory;
//# sourceMappingURL=monorepo.js.map